// NexusQuant AI — Tauri Backend
// Founders: Anas Lahraoui & Othman Karam
//
// This module is the Tauri IPC bridge between the React frontend and the
// async Rust execution engine. It handles:
//
//   1. `subscribe_ticks`  — Opens a low-latency WebSocket stream to a market
//                           data provider and forwards tick/OHLCV events
//                           directly to the frontend via Tauri events, bypassing
//                           HTTP request/response overhead entirely.
//
//   2. `unsubscribe_ticks` — Gracefully cancels an active stream.
//
//   3. `get_ai_signal`    — Queries the local Python AI engine (FastAPI) for
//                           model-generated trading signals.
//
// All commands are `async` and run on the Tokio runtime embedded in Tauri,
// ensuring zero blocking on the UI thread.

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Arc;

use futures_util::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter, Manager, State};
use tokio::sync::{broadcast, Mutex};
use tokio_tungstenite::{connect_async, tungstenite::Message};
use tracing::{error, info, warn};

// ── Data Structures ─────────────────────────────────────────────────────────

/// A single OHLCV candlestick tick received from the market data feed.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OhlcvTick {
    /// Unix timestamp (seconds)
    pub time: u64,
    pub open: f64,
    pub high: f64,
    pub low: f64,
    pub close: f64,
    pub volume: f64,
    pub symbol: String,
}

/// A raw bid/ask quote (Level 1 tick).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuoteTick {
    pub symbol: String,
    pub bid: f64,
    pub ask: f64,
    pub timestamp_ns: u64,
}

/// Response payload from the AI engine signal endpoint.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AiSignal {
    pub symbol: String,
    pub signal: String,        // "LONG" | "SHORT" | "FLAT"
    pub confidence: f64,
    pub model_version: String,
    pub generated_at: u64,
}

/// Shared application state — holds the shutdown channel for active WS streams.
pub struct AppState {
    /// Sending half of a broadcast channel used to cancel running streams.
    pub shutdown_tx: Mutex<Option<broadcast::Sender<()>>>,
}

// ── Tauri Commands ───────────────────────────────────────────────────────────

/// **subscribe_ticks**
///
/// Establishes an asynchronous WebSocket connection to `ws_url` and subscribes
/// to the given `symbol`. Each incoming message is parsed and emitted as a
/// Tauri `"tick"` event that the React `CandlestickChart` component can consume
/// via `@tauri-apps/api/event`.
///
/// The connection runs entirely on Tokio's thread pool — the UI thread is never
/// blocked, maintaining sub-millisecond UI responsiveness.
#[tauri::command]
pub async fn subscribe_ticks(
    app: AppHandle,
    state: State<'_, Arc<AppState>>,
    symbol: String,
    ws_url: String,
) -> Result<String, String> {
    info!("Subscribing to ticks: symbol={} url={}", symbol, ws_url);

    // Cancel any previously running stream
    {
        let mut guard = state.shutdown_tx.lock().await;
        if let Some(tx) = guard.take() {
            let _ = tx.send(());
        }
    }

    let (shutdown_tx, mut shutdown_rx) = broadcast::channel::<()>(1);
    {
        let mut guard = state.shutdown_tx.lock().await;
        *guard = Some(shutdown_tx);
    }

    let symbol_clone = symbol.clone();
    let app_clone = app.clone();

    // Spawn the WebSocket reader onto Tokio — fire-and-forget with graceful cancel
    tokio::spawn(async move {
        let url = match url::Url::parse(&ws_url) {
            Ok(u) => u,
            Err(e) => {
                error!("Invalid WebSocket URL '{}': {}", ws_url, e);
                return;
            }
        };

        let (ws_stream, _) = match connect_async(url).await {
            Ok(pair) => pair,
            Err(e) => {
                error!("WebSocket connection failed: {}", e);
                let _ = app_clone.emit("ws-error", e.to_string());
                return;
            }
        };

        info!("WebSocket connected for {}", symbol_clone);
        let _ = app_clone.emit("ws-connected", &symbol_clone);

        let (mut ws_sink, mut ws_stream) = ws_stream.split();

        // Send subscription message — NOTE: This uses a generic format.
        // Different exchanges use different subscription protocols.
        // Adapt this message for your target data provider
        // (e.g. Binance: {"method":"SUBSCRIBE","params":["btcusdt@kline_1m"]},
        //        Kraken:  {"event":"subscribe","pair":["XBT/USD"],"subscription":{"name":"ohlc"}})
        let subscribe_msg = serde_json::json!({
            "type": "subscribe",
            "symbol": symbol_clone,
            "channels": ["ohlcv_1m", "quotes"]
        });
        if let Err(e) = ws_sink.send(Message::Text(subscribe_msg.to_string().into())).await {
            error!("Failed to send subscribe message: {}", e);
            return;
        }

        // Read loop — runs until shutdown signal or connection drop
        loop {
            tokio::select! {
                // Shutdown signal from `unsubscribe_ticks`
                _ = shutdown_rx.recv() => {
                    info!("Shutting down WS stream for {}", symbol_clone);
                    let _ = ws_sink.send(Message::Close(None)).await;
                    break;
                }

                // Incoming WebSocket message
                msg = ws_stream.next() => {
                    match msg {
                        Some(Ok(Message::Text(text))) => {
                            match serde_json::from_str::<OhlcvTick>(&text) {
                                Ok(tick) => {
                                    // Emit to the React frontend — zero-copy via Tauri IPC
                                    if let Err(e) = app_clone.emit("tick", &tick) {
                                        warn!("Failed to emit tick event: {}", e);
                                    }
                                }
                                Err(_) => {
                                    // Try parsing as a raw quote
                                    if let Ok(quote) = serde_json::from_str::<QuoteTick>(&text) {
                                        let _ = app_clone.emit("quote", &quote);
                                    }
                                }
                            }
                        }
                        Some(Ok(Message::Ping(payload))) => {
                            let _ = ws_sink.send(Message::Pong(payload)).await;
                        }
                        Some(Ok(Message::Close(_))) => {
                            info!("Server closed WS connection for {}", symbol_clone);
                            let _ = app_clone.emit("ws-disconnected", &symbol_clone);
                            break;
                        }
                        Some(Err(e)) => {
                            error!("WebSocket error for {}: {}", symbol_clone, e);
                            let _ = app_clone.emit("ws-error", e.to_string());
                            break;
                        }
                        None => break,
                        _ => {}
                    }
                }
            }
        }
    });

    Ok(format!("Subscribed to {}", symbol))
}

/// **unsubscribe_ticks**
///
/// Sends a shutdown signal to the active WebSocket stream task, causing it to
/// close the connection gracefully.
#[tauri::command]
pub async fn unsubscribe_ticks(
    state: State<'_, Arc<AppState>>,
) -> Result<String, String> {
    let mut guard = state.shutdown_tx.lock().await;
    if let Some(tx) = guard.take() {
        let _ = tx.send(());
        Ok("Unsubscribed successfully".into())
    } else {
        Ok("No active subscription".into())
    }
}

/// **get_ai_signal**
///
/// Issues an HTTP GET request to the local Python AI engine and returns the
/// model's trading signal for the given symbol.
#[tauri::command]
pub async fn get_ai_signal(symbol: String) -> Result<AiSignal, String> {
    let url = format!("http://localhost:8000/api/v1/signals/{}", symbol);
    info!("Fetching AI signal from {}", url);

    let response = reqwest::get(&url)
        .await
        .map_err(|e| format!("HTTP request failed: {}", e))?;

    let signal: AiSignal = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse AI signal response: {}", e))?;

    Ok(signal)
}

// ── Application Entry Point ──────────────────────────────────────────────────

fn main() {
    // Initialize structured logging (respects RUST_LOG env var)
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| {
                    "nexusquant_tauri_lib=debug,tauri=warn"
                        .parse()
                        .expect("default tracing filter is valid")
                }),
        )
        .init();

    let state = Arc::new(AppState {
        shutdown_tx: Mutex::new(None),
    });

    tauri::Builder::default()
        .manage(state)
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            subscribe_ticks,
            unsubscribe_ticks,
            get_ai_signal,
        ])
        .run(tauri::generate_context!())
        .expect("error while running NexusQuant AI terminal");
}
