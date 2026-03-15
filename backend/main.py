from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings
from backend.api.routes import crypto

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "AI Trading System Operational", "mode": "PAPER" if settings.PAPER_MODE else "LIVE"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}

# Include Streamlit-migrated routes
app.include_router(crypto.router, prefix=f"{settings.API_V1_STR}/crypto", tags=["crypto"])
