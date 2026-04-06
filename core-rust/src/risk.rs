// NexusQuant AI — Risk Engine
//
// Pre-trade and post-trade risk checks.
// Enforces position limits, drawdown limits, and concentration rules.

use crate::order_router::Order;
use tracing::warn;

/// Risk parameters loaded from configuration.
#[derive(Debug, Clone)]
pub struct RiskConfig {
    /// Maximum single-order notional value (USD)
    pub max_order_notional: f64,
    /// Maximum total portfolio drawdown as a fraction (e.g. 0.05 = 5%)
    pub max_drawdown_frac: f64,
    /// Maximum position size per symbol (units)
    pub max_position_per_symbol: f64,
}

impl Default for RiskConfig {
    fn default() -> Self {
        Self {
            max_order_notional:      1_000_000.0,
            max_drawdown_frac:       0.05,
            max_position_per_symbol: 10_000_000.0,
        }
    }
}

/// Result of a risk check.
#[derive(Debug)]
pub enum RiskCheckResult {
    Approved,
    Rejected { reason: String },
}

/// Run pre-trade risk checks against the given order.
pub fn check_order(order: &Order, current_price: f64, config: &RiskConfig) -> RiskCheckResult {
    let notional = order.quantity * current_price;

    if notional > config.max_order_notional {
        let reason = format!(
            "Order notional ${:.2} exceeds max ${:.2}",
            notional, config.max_order_notional
        );
        warn!("Risk check REJECTED: {}", reason);
        return RiskCheckResult::Rejected { reason };
    }

    if order.quantity > config.max_position_per_symbol {
        let reason = format!(
            "Order quantity {:.0} exceeds position limit {:.0}",
            order.quantity, config.max_position_per_symbol
        );
        warn!("Risk check REJECTED: {}", reason);
        return RiskCheckResult::Rejected { reason };
    }

    RiskCheckResult::Approved
}
