-- NexusQuant AI — PostgreSQL Initialisation Script
-- Creates the core schema for backtesting data and trade history.

-- ── Extensions ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "timescaledb" CASCADE;   -- optional: comment out if not using TimescaleDB

-- ── OHLCV Bars ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ohlcv_bars (
    id          UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
    symbol      VARCHAR(20) NOT NULL,
    timeframe   VARCHAR(5)  NOT NULL,   -- e.g. '1m', '5m', '1H', '1D'
    time        TIMESTAMPTZ NOT NULL,
    open        NUMERIC(18, 8) NOT NULL,
    high        NUMERIC(18, 8) NOT NULL,
    low         NUMERIC(18, 8) NOT NULL,
    close       NUMERIC(18, 8) NOT NULL,
    volume      NUMERIC(24, 4) NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_ohlcv_symbol_tf_time
    ON ohlcv_bars (symbol, timeframe, time);

-- ── AI Signals ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_signals (
    id            UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
    symbol        VARCHAR(20) NOT NULL,
    signal        VARCHAR(10) NOT NULL,   -- 'LONG' | 'SHORT' | 'FLAT'
    confidence    NUMERIC(5, 4) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    generated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Trade History ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trades (
    id            UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
    symbol        VARCHAR(20) NOT NULL,
    side          VARCHAR(5)  NOT NULL,   -- 'BUY' | 'SELL'
    order_type    VARCHAR(15) NOT NULL,   -- 'MARKET' | 'LIMIT' | 'STOP_LIMIT'
    quantity      NUMERIC(24, 8) NOT NULL,
    filled_price  NUMERIC(18, 8),
    status        VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    opened_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at     TIMESTAMPTZ,
    pnl           NUMERIC(18, 4)
);
