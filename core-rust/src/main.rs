// NexusQuant AI — Core Execution Engine
// Founders: Anas Lahraoui & Othman Karam
//
// Entry point for the standalone core engine binary.
// In production, this process runs alongside the Tauri desktop app,
// handling high-throughput WebSocket ingestion and order routing.

use anyhow::Result;
use nexusquant_core::engine;
use tracing::info;

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "nexusquant_core=debug".parse().unwrap()),
        )
        .init();

    info!("⚡ NexusQuant AI Core Engine starting...");

    engine::run().await
}
