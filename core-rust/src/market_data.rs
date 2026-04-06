// NexusQuant AI — Market Data Ingestion
//
// Responsible for connecting to exchange WebSocket feeds, normalising
// raw messages into internal data types, and broadcasting them to
// downstream consumers (order router, AI engine, Tauri IPC).

use anyhow::Result;
use futures_util::StreamExt;
use serde::{Deserialize, Serialize};
use tokio_tungstenite::connect_async;
use tracing::{error, info};

/// Normalised OHLCV tick — exchange-agnostic internal representation.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OhlcvTick {
    pub symbol:       String,
    pub time:         u64,   // Unix epoch seconds
    pub open:         f64,
    pub high:         f64,
    pub low:          f64,
    pub close:        f64,
    pub volume:       f64,
}

/// Level-1 bid/ask quote.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QuoteTick {
    pub symbol:       String,
    pub bid:          f64,
    pub ask:          f64,
    pub timestamp_ns: u64,   // Nanosecond precision for HFT latency tracking
}

/// Connect to `ws_url` and stream ticks, invoking `on_tick` for each message.
///
/// This function is designed to be spawned as a Tokio task.
/// The caller passes a closure that handles each normalised tick.
pub async fn stream_ticks<F>(ws_url: &str, symbol: &str, mut on_tick: F) -> Result<()>
where
    F: FnMut(OhlcvTick) + Send + 'static,
{
    let url = url::Url::parse(ws_url)?;
    info!("Connecting to market data feed: {}", ws_url);

    let (ws_stream, _) = connect_async(url).await?;
    let (_, mut reader) = ws_stream.split();

    info!("Market data feed connected for {}", symbol);

    while let Some(msg) = reader.next().await {
        match msg {
            Ok(tokio_tungstenite::tungstenite::Message::Text(text)) => {
                match serde_json::from_str::<OhlcvTick>(&text) {
                    Ok(tick) => on_tick(tick),
                    Err(e) => error!("Failed to parse tick message: {} | raw: {}", e, text),
                }
            }
            Ok(tokio_tungstenite::tungstenite::Message::Close(_)) => {
                info!("Market data feed closed for {}", symbol);
                break;
            }
            Err(e) => {
                error!("WebSocket error: {}", e);
                break;
            }
            _ => {}
        }
    }

    Ok(())
}
