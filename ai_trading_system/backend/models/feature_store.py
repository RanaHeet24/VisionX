import json
import asyncio
from redis import asyncio as aioredis
from backend.core.config import settings

class FeatureStore:
    def __init__(self):
        self.redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)

    async def push_features(self, symbol: str, features: dict):
        """Store latest features for a symbol."""
        key = f"features:{symbol}"
        await self.redis.set(key, json.dumps(features))

    async def get_features(self, symbol: str) -> dict:
        """Get latest features for inference."""
        key = f"features:{symbol}"
        data = await self.redis.get(key)
        return json.loads(data) if data else None

feature_store = FeatureStore()
