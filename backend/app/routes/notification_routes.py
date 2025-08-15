"""
Notification management routes - Send, Read, Manage notifications
"""

from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from datetime import datetime
from app.models.schemas import (
    Notification, User, APIResponse
)
from app.core.auth import get_current_active_user
from app.database.connection import get_notifications_collection
import uuid

router = APIRouter()


@router.get("/", response_model=List[Notification])
async def get_user_notifications(
    current_user: User = Depends(get_current_active_user),
    is_read: Optional[bool] = Query(None),
    notification_type: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100)
):
    """
    ## 🔔 Get User Notifications

    Retrieve notifications for the user with optional filtering.
    """
    notifications_collection = get_notifications_collection()

    # Build query
    query = {"user_id": current_user.id}
    if is_read is not None:
        query["is_read"] = is_read
    if notification_type:
        query["type"] = notification_type

    # Calculate pagination
    skip = (page - 1) * size

    # Get notifications sorted by creation date (newest first)
    cursor = notifications_collection.find(query).sort(
        "created_at", -1).skip(skip).limit(size)
    notifications = await cursor.to_list(length=size)

    return [Notification(**notification) for notification in notifications]


@router.patch("/{notification_id}/read", response_model=APIResponse)
async def mark_notification_read(
    notification_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    ## ✅ Mark Notification as Read

    Mark a specific notification as read.
    """
    notifications_collection = get_notifications_collection()

    # Update notification
    result = await notifications_collection.update_one(
        {
            "_id": notification_id,
            "user_id": current_user.id
        },
        {
            "$set": {
                "is_read": True,
                "updated_at": datetime.now()
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )

    return APIResponse(
        success=True,
        message="Notification marked as read"
    )


@router.patch("/mark-all-read", response_model=APIResponse)
async def mark_all_notifications_read(
    current_user: User = Depends(get_current_active_user)
):
    """
    ## ✅ Mark All Notifications as Read

    Mark all unread notifications as read for the user.
    """
    notifications_collection = get_notifications_collection()

    # Update all unread notifications
    result = await notifications_collection.update_many(
        {
            "user_id": current_user.id,
            "is_read": False
        },
        {
            "$set": {
                "is_read": True,
                "updated_at": datetime.now()
            }
        }
    )

    return APIResponse(
        success=True,
        message=f"Marked {result.modified_count} notifications as read",
        data={"updated_count": result.modified_count}
    )


@router.delete("/{notification_id}", response_model=APIResponse)
async def delete_notification(
    notification_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    ## 🗑️ Delete Notification

    Delete a specific notification.
    """
    notifications_collection = get_notifications_collection()

    # Delete notification
    result = await notifications_collection.delete_one({
        "_id": notification_id,
        "user_id": current_user.id
    })

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )

    return APIResponse(
        success=True,
        message="Notification deleted successfully"
    )


@router.get("/unread-count")
async def get_unread_count(
    current_user: User = Depends(get_current_active_user)
):
    """
    ## 🔢 Get Unread Count

    Get count of unread notifications for the user.
    """
    notifications_collection = get_notifications_collection()

    unread_count = await notifications_collection.count_documents({
        "user_id": current_user.id,
        "is_read": False
    })

    return {
        "unread_count": unread_count,
        "timestamp": datetime.now().isoformat()
    }


async def create_notification(
    user_id: str,
    title: str,
    message: str,
    notification_type: str = "info",
    action_url: Optional[str] = None
) -> str:
    """
    ## 📨 Create Notification (Internal Function)

    Internal function to create notifications for users.
    Used by other services to send notifications.
    """
    notifications_collection = get_notifications_collection()

    notification = Notification(
        id=str(uuid.uuid4()),
        user_id=user_id,
        title=title,
        message=message,
        type=notification_type,
        action_url=action_url,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

    result = await notifications_collection.insert_one(
        notification.dict(by_alias=True, exclude={"id"})
    )

    return str(result.inserted_id)
