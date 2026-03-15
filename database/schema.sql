-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Candles Table (OHLCV)
CREATE TABLE IF NOT EXISTS candles (
    timestamp TIMESTAMPTZ NOT NULL,
    symbol TEXT NOT NULL,
    open DOUBLE PRECISION NOT NULL,
    high DOUBLE PRECISION NOT NULL,
    low DOUBLE PRECISION NOT NULL,
    close DOUBLE PRECISION NOT NULL,
    volume DOUBLE PRECISION NOT NULL,
    exchange TEXT NOT NULL,
    timeframe TEXT NOT NULL,
    PRIMARY KEY (timestamp, symbol, exchange, timeframe)
);

-- Convert to Hypertable
SELECT create_hypertable('candles', 'timestamp', if_not_exists => TRUE);

-- Indexes for fast query
CREATE INDEX IF NOT EXISTS idx_candles_symbol_time ON candles (symbol, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_candles_exchange_time ON candles (exchange, timestamp DESC);
