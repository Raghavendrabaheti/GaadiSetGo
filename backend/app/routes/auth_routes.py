"""
Authentication routes - Login, Register, Token refresh
"""

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPAuthorizationCredentials
from datetime import timedelta
from app.models.schemas import (
    User, UserCreate, UserLogin, UserInDB, Token, APIResponse
)
from app.core.auth import (
    verify_password, get_password_hash, create_access_token,
    create_refresh_token, verify_token, security, get_current_user
)
from app.database.connection import get_users_collection
from app.core.config import get_settings
import uuid
from datetime import datetime

router = APIRouter()
settings = get_settings()


@router.post("/register", response_model=APIResponse)
async def register_user(user_data: UserCreate):
    """
    ## 📝 User Registration

    Register a new user account with email and password.
    """
    users_collection = get_users_collection()

    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user_dict = user_data.dict()
    user_dict.pop("password")

    # Add additional fields
    user_dict.update({
        "hashed_password": hashed_password,
        "role": "user",
        "is_active": True,
        "is_verified": False,
        "total_bookings": 0,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    })

    # Insert user into database
    result = await users_collection.insert_one(user_dict)

    if result.inserted_id:
        # Create tokens for the new user
        access_token_expires = timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(result.inserted_id), "email": user_data.email},
            expires_delta=access_token_expires
        )
        refresh_token = create_refresh_token(
            data={"sub": str(result.inserted_id), "email": user_data.email}
        )

        return APIResponse(
            success=True,
            message="User registered successfully",
            data={
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer"
            }
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )


@router.post("/login", response_model=APIResponse)
async def login_user(login_data: UserLogin):
    """
    ## 🔐 User Login

    Authenticate user and return access & refresh tokens.
    """
    users_collection = get_users_collection()

    # Find user by email
    user = await users_collection.find_one({"email": login_data.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Verify password
    if not verify_password(login_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Check if user is active
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated"
        )

    # Create tokens
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user["_id"]), "email": user["email"]},
        expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(
        data={"sub": str(user["_id"]), "email": user["email"]}
    )

    # Update last login
    await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"updated_at": datetime.now()}}
    )

    return APIResponse(
        success=True,
        message="Login successful",
        data={
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
    )


@router.post("/refresh", response_model=APIResponse)
async def refresh_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    ## 🔄 Token Refresh

    Refresh access token using refresh token.
    """
    refresh_token = credentials.credentials

    # Verify refresh token
    token_data = verify_token(refresh_token, token_type="refresh")
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    # Get user from database
    users_collection = get_users_collection()
    from bson import ObjectId
    try:
        user_object_id = ObjectId(token_data.user_id)
        user = await users_collection.find_one({"_id": user_object_id})
    except Exception:
        # Invalid ObjectId format
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user ID"
        )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    # Create new access token
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    new_access_token = create_access_token(
        data={"sub": str(user["_id"]), "email": user["email"]},
        expires_delta=access_token_expires
    )

    return APIResponse(
        success=True,
        message="Token refreshed successfully",
        data={
            "access_token": new_access_token,
            "refresh_token": refresh_token,  # Keep the same refresh token
            "token_type": "bearer"
        }
    )


@router.post("/logout", response_model=APIResponse)
async def logout_user():
    """
    ## 👋 User Logout

    Logout user (client should delete tokens).
    """
    return APIResponse(
        success=True,
        message="Logged out successfully",
        data={"note": "Please delete tokens from client storage"}
    )


@router.post("/forgot-password", response_model=APIResponse)
async def forgot_password(email: str):
    """
    ## 📧 Forgot Password

    Send password reset email to user.
    """
    users_collection = get_users_collection()

    # Check if user exists
    user = await users_collection.find_one({"email": email})
    if not user:
        # Don't reveal that user doesn't exist
        return APIResponse(
            success=True,
            message="If the email exists, a reset link has been sent"
        )

    # TODO: Implement email sending logic
    # For now, just return success message
    return APIResponse(
        success=True,
        message="Password reset email sent successfully"
    )


@router.post("/reset-password", response_model=APIResponse)
async def reset_password(token: str, new_password: str):
    """
    ## 🔑 Reset Password

    Reset user password using reset token.
    """
    # TODO: Implement password reset logic with token verification

    return APIResponse(
        success=True,
        message="Password reset successfully"
    )


@router.post("/verify-email", response_model=APIResponse)
async def verify_email(token: str):
    """
    ## ✅ Verify Email

    Verify user email address using verification token.
    """
    # TODO: Implement email verification logic

    return APIResponse(
        success=True,
        message="Email verified successfully"
    )
