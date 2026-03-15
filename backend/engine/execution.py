import logging
import json
from tenacity import retry, stop_after_attempt, wait_fixed, retry_if_exception_type
from backend.core.config import settings
from backend.engine.redis_queue import order_queue
from backend.engine.exchange import BinanceExchange

logger = logging.getLogger(__name__)

class ExecutionEngine:
    def __init__(self):
        self.running = False
        # Initialize exchanges (add more as needed)
        self.exchanges = {
            "BINANCE": BinanceExchange(
                api_key=settings.BINANCE_API_KEY, 
                secret_key=settings.BINANCE_SECRET_KEY, 
                sandbox=settings.PAPER_MODE
            )
        }

    async def start(self):
        """Start the execution loop."""
        self.running = True
        logger.info("Execution Engine Started")
        
        # Connect to exchanges
        for name, exchange in self.exchanges.items():
            await exchange.connect()
            logger.info(f"Connected to {name}")

        while self.running:
            try:
                # Blokcing pop from Redis
                order_data = await order_queue.pop()
                if order_data:
                    await self.process_order(order_data)
            except Exception as e:
                logger.error(f"Error in execution loop: {e}")
                await asyncio.sleep(1)

    async def stop(self):
        """Stop the execution loop."""
        self.running = False
        for name, exchange in self.exchanges.items():
            await exchange.close()

    @retry(stop=stop_after_attempt(3), wait=wait_fixed(2), retry=retry_if_exception_type(Exception))
    async def process_order(self, order: dict):
        """Route order to exchange."""
        logger.info(f"Processing order: {order}")
        exchange_name = order.get("exchange", "BINANCE").upper()
        exchange = self.exchanges.get(exchange_name)
        
        if not exchange:
            logger.error(f"Exchange {exchange_name} not found")
            return

        # Execute Order
        result = await exchange.create_order(
            symbol=order['symbol'],
            type=order['type'],
            side=order['side'],
            amount=order['amount'],
            price=order.get('price')
        )
        logger.info(f"Order Executed: {result}")
        # TODO: Push fill update to Redis/DB (implementation pending)

# Global instance
execution_engine = ExecutionEngine()
