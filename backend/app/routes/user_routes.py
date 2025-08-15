"""
User management routes - Profile, Update profile, etc.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from app.models.schemas import User, UserUpdate, APIResponse
from app.core.auth import get_current_user
from app.database.connection import get_users_collection
from datetime import datetime

router = APIRouter()


@router.get("/profile", response_model=APIResponse)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """
    ## 👤 Get User Profile

    Get the current authenticated user's profile information.
    """
    return APIResponse(
        success=True,
        message="Profile retrieved successfully",
        data=current_user
    )


@router.put("/profile", response_model=APIResponse)
async def update_user_profile(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user)
):
    """
    ## ✏️ Update User Profile

    Update the current authenticated user's profile information.
    """
    users_collection = get_users_collection()

    # Remove None values from update data
    update_data = {k: v for k, v in user_data.dict(
        exclude_unset=True).items() if v is not None}

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid fields to update"
        )

    # Add updated timestamp
    update_data["updated_at"] = datetime.now()

    # Update user in database
    from bson import ObjectId
    result = await users_collection.update_one(
        {"_id": ObjectId(current_user.id)},
        {"$set": update_data}
    )

    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No changes were made"
        )

    return APIResponse(
        success=True,
        message="Profile updated successfully"
    )
