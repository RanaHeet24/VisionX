import asyncio
import ccxt.pro as ccxt
import pandas as pd
from datetime import datetime, timedelta
import logging
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from backend.core.config import settings
from backend.models.db_models import Candle

logger = logging.getLogger(__name__)

class DataIngestion:
    def __init__(self):
        self.engine = create_async_engine(settings.DATABASE_URL, echo=False)
        self.async_session = sessionmaker(self.engine, expire_on_commit=False, class_=AsyncSession)
        self.exchange = ccxt.binance()

    async def fetch_historical_candles(self, symbol: str, timeframe: str = '1h', limit: int = 1000):
        """Fetch historical candles from Binance and store in DB."""
        logger.info(f"Fetching {limit} candles for {symbol} {timeframe}")
        try:
            ohlcv = await self.exchange.fetch_ohlcv(symbol, timeframe, limit=limit)
            await self._save_candles(symbol, timeframe, ohlcv)
            logger.info("Ingestion Complete")
        except Exception as e:
            logger.error(f"Ingestion Failed: {e}")
        finally:
            await self.exchange.close()

    async def _save_candles(self, symbol, timeframe, ohlcv):
        async with self.async_session() as session:
            async with session.begin():
                for candle_data in ohlcv:
                    timestamp = datetime.fromtimestamp(candle_data[0] / 1000)
                    candle = Candle(
                        timestamp=timestamp,
                        symbol=symbol,
                        open=candle_data[1],
                        high=candle_data[2],
                        low=candle_data[3],
                        close=candle_data[4],
                        volume=candle_data[5],
                        exchange='BINANCE',
                        timeframe=timeframe
                    )
                    await session.merge(candle)
            
# Usage Example
# ingester = DataIngestion()
# asyncio.run(ingester.fetch_historical_candles('BTC/USDT'))
