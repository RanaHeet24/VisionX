import numpy as np
from typing import List, Dict

class RiskEngine:
    def __init__(self, confidence_level: float = 0.95):
        self.confidence_level = confidence_level

    def calculate_var(self, returns: List[float], portfolio_value: float) -> float:
        """
        Calculate Value at Risk (VaR) using Historical Simulation.
        """
        if not returns or len(returns) < 50:
            return 0.0

        # Sort returns
        sorted_returns = np.sort(returns)
        
        # Determine index for confidence level
        index = int((1 - self.confidence_level) * len(sorted_returns))
        
        # VaR is the return at that index
        var_pct = abs(sorted_returns[index])
        
        return var_pct * portfolio_value

    def calculate_position_size(self, capital: float, risk_per_trade: float, sl_pips: float, pip_value: float) -> float:
        """
        Calculate position size based on risk per trade.
        """
        risk_amount = capital * risk_per_trade
        if sl_pips == 0:
            return 0.0
        
        size = risk_amount / (sl_pips * pip_value)
        return size

    def check_circuit_breaker(self, daily_loss: float, max_daily_loss: float) -> bool:
        """
        Return True if trading should be halted.
        """
        return daily_loss >= max_daily_loss

risk_engine = RiskEngine()
