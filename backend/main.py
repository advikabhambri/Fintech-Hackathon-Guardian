from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from api.routes import health, auth, portfolio, goals, insights, sync, wellness_score, calm_mode
from core.config import settings
from db.database import engine, Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown
    pass


app = FastAPI(
    title="Guardian API",
    description="Backend API for Guardian - Your Financial Wellness Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(goals.router, prefix="/api/goals", tags=["Goals"])
app.include_router(insights.router, prefix="/api/insights", tags=["Insights"])
app.include_router(sync.router, prefix="/api/sync", tags=["Sync"])
app.include_router(wellness_score.router, prefix="/api/wellness-score", tags=["Wellness Score"])
app.include_router(calm_mode.router, tags=["Calm Mode"])


@app.get("/")
async def root():
    return {
        "message": "Welcome to Guardian API",
        "version": "1.0.0",
        "docs": "/docs"
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
