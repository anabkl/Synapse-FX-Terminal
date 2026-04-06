// NexusQuant AI — Order Router
//
// Placeholder for smart order routing (SOR) logic.
// Will handle order splitting, venue selection, and execution reporting.

use serde::{Deserialize, Serialize};
use tracing::info;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum OrderSide {
    Buy,
    Sell,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum OrderType {
    Market,
    Limit,
    StopLimit,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Order {
    pub id:           String,
    pub symbol:       String,
    pub side:         OrderSide,
    pub order_type:   OrderType,
    pub quantity:     f64,
    pub limit_price:  Option<f64>,
    pub stop_price:   Option<f64>,
    pub created_at_ns: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum OrderStatus {
    Pending,
    PartiallyFilled { filled_qty: f64 },
    Filled { avg_price: f64 },
    Rejected { reason: String },
    Cancelled,
}

/// Route an order to the appropriate execution venue.
/// TODO: implement venue selection, order splitting, and retry logic.
pub async fn route_order(order: &Order) -> OrderStatus {
    info!(
        "Routing order: {:?} {} {} @ {:?}",
        order.side,
        order.quantity,
        order.symbol,
        order.limit_price
    );

    // Placeholder — always returns Pending
    OrderStatus::Pending
}
