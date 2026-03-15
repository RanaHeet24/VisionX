import json
import asyncio
from redis import asyncio as aioredis
from backend.core.config import settings

class RedisQueue:
    def __init__(self, name: str):
        self.redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        self.name = name

    async def push(self, data: dict):
        """Push a message to the queue."""
        await self.redis.rpush(self.name, json.dumps(data))

    async def pop(self):
        """Pop a message from the queue (blocking)."""
        result = await self.redis.blpop(self.name, timeout=0)
        if result:
            return json.loads(result[1])
        return None

    async def publish(self, channel: str, message: dict):
        """Publish a message to a pub/sub channel."""
        await self.redis.publish(channel, json.dumps(message))

    async def subscribe(self, channel: str):
        """Subscribe to a pub/sub channel."""
        pubsub = self.redis.pubsub()
        await pubsub.subscribe(channel)
        return pubsub

# Global Queues
order_queue = RedisQueue("orders")
signal_queue = RedisQueue("signals")
