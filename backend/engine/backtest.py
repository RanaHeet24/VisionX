import pandas as pd
import numpy as np
from typing import List, Dict, Callable
import logging 
from backend.engine.risk_utils import apply_slippage

logger = logging.getLogger(__name__)

class BacktestEngine:
    def __init__(self, initial_capital: float = 10000.0, commission: float = 0.001):
        self.initial_capital = initial_capital
        self.commission = commission
        self.current_capital = initial_capital
        self.positions: Dict[str, float] = {}  # Symbol -> Amount
        self.equity_curve: List[Dict] = []
        self.trades: List[Dict] = []

    def run(self, data: pd.DataFrame, strategy_fn: Callable):
        """
        Run backtest on provided data.
        data: DataFrame with OHLCV and 'timestamp' index.
        strategy_fn: Function that takes (row, context) and returns Action.
        """
        logger.info("Starting Backtest...")
        
        # Reset state
        self.current_capital = self.initial_capital
        self.positions = {}
        self.equity_curve = []
        self.trades = []
        
        for timestamp, row in data.iterrows():
            # 1. Update Portfolio Value
            portfolio_value = self.current_capital
            current_price = row['close']
            
            for symbol, amount in self.positions.items():
                portfolio_value += amount * current_price
                
            self.equity_curve.append({
                "timestamp": timestamp,
                "equity": portfolio_value
            })
            
            # 2. Strategy Signal
            # Context can provide current pos, capital, etc.
            context = {
                "capital": self.current_capital,
                "positions": self.positions,
                "portfolio_value": portfolio_value
            }
            
            signal = strategy_fn(row, context)
            
            # 3. Execution (Simulated)
            if signal:
                self._execute_signal(signal, current_price, row['volume'])

        return self._calculate_metrics()

    def _execute_signal(self, signal: dict, price: float, volume: float):
        """
        Simulate order execution with slippage and commission.
        Signal format: {"side": "BUY"/"SELL", "amount": float, "symbol": str}
        """
        side = signal.get("side").upper()
        amount = signal.get("amount")
        symbol = signal.get("symbol", "ASSET") # Default for single asset
        
        # Apply Slippage
        # Estimate volatility as mock 0.01 if not passed, or calc from TR later
        exec_price = apply_slippage(price, volume, volatility=0.01, side=side)
        
        cost = exec_price * amount
        fee = cost * self.commission
        total_cost = cost + fee
        
        if side == "BUY":
            if self.current_capital >= total_cost:
                self.current_capital -= total_cost
                self.positions[symbol] = self.positions.get(symbol, 0) + amount
                self._record_trade(symbol, side, exec_price, amount, fee)
        
        elif side == "SELL":
            current_pos = self.positions.get(symbol, 0)
            if current_pos >= amount:
                proceeds = (exec_price * amount) - fee
                self.current_capital += proceeds
                self.positions[symbol] -= amount
                self._record_trade(symbol, side, exec_price, amount, fee)

    def _record_trade(self, symbol, side, price, amount, fee):
        self.trades.append({
            "symbol": symbol,
            "side": side,
            "price": price,
            "amount": amount,
            "fee": fee
        })

    def _calculate_metrics(self):
        if not self.equity_curve:
            return {}
            
        df = pd.DataFrame(self.equity_curve)
        df.set_index('timestamp', inplace=True)
        
        df['returns'] = df['equity'].pct_change().fillna(0)
        
        total_return = (df['equity'].iloc[-1] - self.initial_capital) / self.initial_capital
        
        # Risk-Free Rate (assumed 0 for simplicity, or 2%)
        rf = 0.0
        excess_returns = df['returns'] - rf/365
        
        # Sharpe Ratio
        std_dev = df['returns'].std()
        sharpe = (excess_returns.mean() / std_dev) * np.sqrt(365) if std_dev != 0 else 0
        
        # Sortino Ratio (Downside Deviation)
        downside_returns = df['returns'][df['returns'] < 0]
        downside_std = downside_returns.std()
        sortino = (excess_returns.mean() / downside_std) * np.sqrt(365) if downside_std != 0 else 0
        
        # Max Drawdown
        cumulative = (1 + df['returns']).cumprod()
        peak = cumulative.cummax()
        drawdown = (cumulative - peak) / peak
        max_drawdown = drawdown.min()
        
        # Trade Analysis
        wins = [t for t in self.trades if t['price'] > 0] # Placeholder logic optimization needed
        # Actual win/loss logic requires tracking entry vs exit price per trade
        # For now, we return the raw list for frontend processing
        
        return {
            "Total_Return": total_return,
            "Sharpe_Ratio": sharpe,
            "Sortino_Ratio": sortino,
            "Max_Drawdown": max_drawdown,
            "Total_Trades": len(self.trades),
            "Equity_Curve": df['equity'].tolist()
        }
