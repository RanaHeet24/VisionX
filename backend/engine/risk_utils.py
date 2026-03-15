import random

def apply_slippage(price: float, volume: float, volatility: float, side: str) -> float:
    """
    Apply synthetic slippage model.
    P_exec = P_market * (1 +/- slippage_rate)
    
    Simple model: Slippage increases with volatility and volume.
    """
    base_slippage = 0.0001  # 1 bps base
    impact = (volume / 100000) * 0.0005  # impact per 100k
    
    total_slippage = base_slippage + impact + (volatility * 0.1)
    
    # Introduce random noise
    noise = random.uniform(0, 0.0002)
    total_slippage += noise
    
    if side.upper() == 'BUY':
        return price * (1 + total_slippage)
    else:
        return price * (1 - total_slippage)
