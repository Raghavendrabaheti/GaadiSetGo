# GaadiSetGo - FastAPI Backend
from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import uvicorn
from datetime import datetime, timedelta
from typing import Optional, List
import os
from contextlib import asynccontextmanager

# Import all route modules
from app.routes import (
    auth_routes,
    # parking_routes,  # Empty file
    # vehicle_routes,  # Empty file
    # service_routes,  # Empty file
    # ecommerce_routes,  # Empty file
    # ai_assistant_routes,  # Empty file
    user_routes,  # Now has profile endpoint
    fastag_routes,
    challan_routes,
    notification_routes
)

# Import database and authentication
from app.database.connection import init_db, close_db
from app.core.config import get_settings

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    # Startup
    await init_db()
    print("🚀 Database initialized successfully")
    print("🚗 GaadiSetGo API Server is ready!")

    yield

    # Shutdown
    await close_db()
    print("📴 Database connection closed")


# Initialize FastAPI app
app = FastAPI(
    title="GaadiSetGo API",
    description="""
    ## 🚗 GaadiSetGo - Complete Vehicle Management Platform
    """,
    version="1.0.0",
    contact={
        "name": "GaadiSetGo Development Team",
        "email": "support@gaadisetgo.com",
        "url": "https://gaadisetgo.com"
    },
    lifespan=lifespan
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH",
                   "OPTIONS"],  # these are restful api methods
    allow_headers=["*"],
)


# Validation error handler | customizes error handling for validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(
        f"Validation error for {request.method} {request.url}: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={
            "detail": exc.errors(),
            "message": "Validation failed",
            "url": str(request.url),
            "method": request.method
        }
    )


# Security scheme
security = HTTPBearer()

# Health check endpoint


@app.get("/", tags=["Health Check"])
async def root():
    """
    ## 🏠 API Health Check
    """
    return {
        "message": "🚗 GaadiSetGo API is running!",
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "features": [
            "Smart Parking Management",
            "Vehicle Services",
            "Auto E-commerce",
            "AI Assistant",
            "User Management",
            "FASTag Services",
            "Challan Tracking",
            "Smart Notifications"
        ]
    }


@app.get("/health", tags=["Health Check"])
async def health_check():
    """
    ## 🔍 Detailed Health Check

    """
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "uptime": "Available",
        "database": "Connected",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT
    }

# Include all route modules
app.include_router(auth_routes.router, prefix="/api/v1/auth",
                   tags=["🔐 Authentication"])
app.include_router(user_routes.router, prefix="/api/v1/users",
                   tags=["👤 User Management"])
# app.include_router(parking_routes.router,
#                    prefix="/api/v1/parking", tags=["🅿️ Parking Management"])  # Empty file
# app.include_router(vehicle_routes.router,
#                    prefix="/api/v1/vehicles", tags=["🚗 Vehicle Management"])  # Empty file
# app.include_router(service_routes.router,
#                    prefix="/api/v1/services", tags=["🔧 Vehicle Services"])  # Empty file
# app.include_router(ecommerce_routes.router,
#                    prefix="/api/v1/ecommerce", tags=["🛒 E-commerce"])  # Empty file
# app.include_router(ai_assistant_routes.router,
#                    prefix="/api/v1/ai", tags=["🤖 AI Assistant"])  # Empty file
app.include_router(fastag_routes.router,
                   prefix="/api/v1/fastag", tags=["💳 FASTag Services"])
app.include_router(challan_routes.router,
                   prefix="/api/v1/challans", tags=["📋 Challan Management"])
app.include_router(notification_routes.router,
                   prefix="/api/v1/notifications", tags=["🔔 Notifications"])

# Global exception handler


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for unhandled errors"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred. Please try again later.",
            "timestamp": datetime.now().isoformat()
        }
    )

# Custom 404 handler


@app.exception_handler(404)
async def not_found_handler(request, exc):
    """Custom 404 handler"""
    return JSONResponse(
        status_code=404,
        content={
            "error": "Endpoint not found",
            "message": f"The requested endpoint '{request.url.path}' was not found.",
            "available_endpoints": "/docs for API documentation",
            "timestamp": datetime.now().isoformat()
        }
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
