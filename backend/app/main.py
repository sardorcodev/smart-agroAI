from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import init_db
from .routers import analyze, auth, health


def create_app() -> FastAPI:
    init_db()

    fastapi_app = FastAPI(title="Smart Agro AI API", version="2.0.0")
    fastapi_app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    fastapi_app.include_router(health.router)
    fastapi_app.include_router(auth.router)
    fastapi_app.include_router(analyze.router)

    return fastapi_app


app = create_app()
