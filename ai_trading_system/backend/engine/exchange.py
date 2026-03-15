from abc import ABC, abstractmethod
import ccxt.pro as ccxt
import asyncio
from typing import Dict, Any

class BaseExchange(ABC):
    def __init__(self, api_key: str, secret_key: str, sandbox: bool = False):
        self.api_key = api_key
        self.secret_key = secret_key
        self.sandbox = sandbox
        self.exchange = None

    @abstractmethod
    async def connect(self):
        """Initialize connection to exchange."""
        pass

    @abstractmethod
    async def fetch_ticker(self, symbol: str) -> Dict[str, Any]:
        """Fetch current ticker data."""
        pass

    @abstractmethod
    async def create_order(self, symbol: str, type: str, side: str, amount: float, price: float = None):
        """Place an order."""
        pass

    @abstractmethod
    async def fetch_balance(self) -> Dict[str, float]:
        """Fetch account balance."""
        pass

    async def close(self):
        """Close exchange connection."""
        if self.exchange:
            await self.exchange.close()

class BinanceExchange(BaseExchange):
    async def connect(self):
        self.exchange = ccxt.binance({
            'apiKey': self.api_key,
            'secret': self.secret_key,
            'enableRateLimit': True,
        })
        if self.sandbox:
            self.exchange.set_sandbox_mode(True)
    
    async def fetch_ticker(self, symbol: str):
        return await self.exchange.fetch_ticker(symbol)

    async def create_order(self, symbol: str, type: str, side: str, amount: float, price: float = None):
        # Determine params based on order type (LIMIT vs MARKET)
        params = {}
        if type.upper() == 'LIMIT' and price:
            return await self.exchange.create_order(symbol, type, side, amount, price, params)
        return await self.exchange.create_order(symbol, type, side, amount, params)

    async def fetch_balance(self):
        return await self.exchange.fetch_balance()
