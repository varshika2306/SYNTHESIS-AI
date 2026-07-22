from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.auth import router as auth_router
from app.api.investigation import router as investigation_router

from app.core.exception_handler import register_exception_handlers

# Database
from app.database.database import Base, engine

# Import models so SQLAlchemy registers the tables
from app.models.user import User
from app.models.investigation import Investigation


app = FastAPI(
    title="Synthesis AI API",
    description="AI Powered Image Authenticity & Digital Forensics Platform",
    version="1.0.0"
)


# -----------------------------
# Startup Event
# Create database tables automatically
# -----------------------------
@app.on_event("startup")
async def startup():

    Base.metadata.create_all(bind=engine)

    print("Database initialized successfully.")


# -----------------------------
# Global Exception Handler
# -----------------------------
register_exception_handlers(app)


# -----------------------------
# CORS Configuration
# -----------------------------
app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],

    allow_credentials=True,

    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS",
    ],

    allow_headers=[
        "Authorization",
        "Content-Type",
    ],
)


# -----------------------------
# Static Files
# -----------------------------
app.mount(
    "/uploads",
    StaticFiles(directory="app/uploads"),
    name="uploads",
)


# -----------------------------
# Authentication Routes
# -----------------------------
app.include_router(auth_router)


# -----------------------------
# Investigation Routes
# -----------------------------
app.include_router(
    investigation_router,
    prefix="/api/v1",
)


# -----------------------------
# Root Endpoint
# -----------------------------
@app.get("/")
def root():

    return {
        "project": "Synthesis AI",
        "status": "Backend Running",
        "version": "1.0.0",
    }