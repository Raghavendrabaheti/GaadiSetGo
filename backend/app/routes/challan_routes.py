"""
Challan management routes - Check, Pay, Track challans
"""

from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from datetime import datetime
from app.models.schemas import (
    Challan, User, APIResponse
)
from app.core.auth import get_current_active_user
from app.database.connection import get_challans_collection, get_vehicles_collection
import uuid

router = APIRouter()


@router.get("/", response_model=List[Challan])
async def get_user_challans(
    current_user: User = Depends(get_current_active_user),
    vehicle_id: Optional[str] = Query(None),
    is_paid: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100)
):
    """
    ## 📋 Get User Challans

    Retrieve challans for the user with optional filtering.
    """
    challans_collection = get_challans_collection()

    # Build query
    query = {"user_id": current_user.id}
    if vehicle_id:
        query["vehicle_id"] = vehicle_id
    if is_paid is not None:
        query["is_paid"] = is_paid

    # Calculate pagination
    skip = (page - 1) * size

    # Get challans sorted by violation date (newest first)
    cursor = challans_collection.find(query).sort(
        "violation_date", -1).skip(skip).limit(size)
    challans = await cursor.to_list(length=size)

    return [Challan(**challan) for challan in challans]


@router.get("/{challan_id}", response_model=Challan)
async def get_challan(
    challan_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    ## 📄 Get Challan Details

    Get detailed information about a specific challan.
    """
    challans_collection = get_challans_collection()

    challan = await challans_collection.find_one({
        "_id": challan_id,
        "user_id": current_user.id
    })

    if not challan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Challan not found"
        )

    return Challan(**challan)


@router.post("/check")
async def check_challans_by_vehicle(
    registration_number: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    ## 🔍 Check Challans by Vehicle

    Check for challans using vehicle registration number.
    """
    vehicles_collection = get_vehicles_collection()
    challans_collection = get_challans_collection()

    # Verify vehicle belongs to user
    vehicle = await vehicles_collection.find_one({
        "registration_number": registration_number,
        "user_id": current_user.id
    })

    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found or doesn't belong to user"
        )

    # Get challans for the vehicle
    cursor = challans_collection.find({
        "vehicle_id": vehicle["_id"]
    }).sort("violation_date", -1)

    challans = await cursor.to_list(length=None)

    # Calculate summary
    total_challans = len(challans)
    paid_challans = len([c for c in challans if c["is_paid"]])
    unpaid_challans = total_challans - paid_challans
    total_amount = sum(c["amount"] for c in challans if not c["is_paid"])

    return {
        "vehicle": {
            "registration_number": registration_number,
            "vehicle_id": vehicle["_id"]
        },
        "summary": {
            "total_challans": total_challans,
            "paid_challans": paid_challans,
            "unpaid_challans": unpaid_challans,
            "total_pending_amount": total_amount
        },
        "challans": [Challan(**challan) for challan in challans],
        "check_time": datetime.now().isoformat()
    }


@router.post("/{challan_id}/pay", response_model=APIResponse)
async def pay_challan(
    challan_id: str,
    payment_method: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    ## 💳 Pay Challan

    Pay a traffic challan online.
    """
    challans_collection = get_challans_collection()

    # Get challan
    challan = await challans_collection.find_one({
        "_id": challan_id,
        "user_id": current_user.id,
        "is_paid": False
    })

    if not challan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Unpaid challan not found"
        )

    # Check if payment is overdue (simplified logic)
    if datetime.now() > challan["due_date"]:
        # Add penalty (simplified - in real scenario, this would be more complex)
        penalty_amount = challan["amount"] * 0.1  # 10% penalty
        total_amount = challan["amount"] + penalty_amount
    else:
        total_amount = challan["amount"]

    # Process payment (simplified - in real scenario, integrate with payment gateway)
    payment_id = f"PAY{datetime.now().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:6].upper()}"

    # Update challan as paid
    await challans_collection.update_one(
        {"_id": challan_id},
        {
            "$set": {
                "is_paid": True,
                "payment_date": datetime.now(),
                "updated_at": datetime.now()
            }
        }
    )

    return APIResponse(
        success=True,
        message="Challan payment processed successfully",
        data={
            "challan_id": challan_id,
            "challan_number": challan["challan_number"],
            "amount_paid": total_amount,
            "payment_id": payment_id,
            "payment_method": payment_method,
            "payment_date": datetime.now().isoformat()
        }
    )


@router.get("/summary")
async def get_challan_summary(
    current_user: User = Depends(get_current_active_user)
):
    """
    ## 📊 Get Challan Summary

    Get summary of all challans for the user.
    """
    challans_collection = get_challans_collection()

    # Get all user challans
    cursor = challans_collection.find({"user_id": current_user.id})
    challans = await cursor.to_list(length=None)

    # Calculate summary statistics
    total_challans = len(challans)
    paid_challans = len([c for c in challans if c["is_paid"]])
    unpaid_challans = total_challans - paid_challans

    total_paid_amount = sum(c["amount"] for c in challans if c["is_paid"])
    total_pending_amount = sum(c["amount"]
                               for c in challans if not c["is_paid"])

    # Overdue challans
    overdue_challans = len([
        c for c in challans
        if not c["is_paid"] and datetime.now() > c["due_date"]
    ])

    # Recent activity (last 30 days)
    thirty_days_ago = datetime.now().replace(day=1)  # Simplified
    recent_challans = [
        c for c in challans
        if c["violation_date"] >= thirty_days_ago
    ]

    return {
        "summary": {
            "total_challans": total_challans,
            "paid_challans": paid_challans,
            "unpaid_challans": unpaid_challans,
            "overdue_challans": overdue_challans,
            "total_paid_amount": total_paid_amount,
            "total_pending_amount": total_pending_amount
        },
        "recent_activity": {
            "last_30_days": len(recent_challans),
            "recent_violations": [
                {
                    "violation_type": c["violation_type"],
                    "amount": c["amount"],
                    "date": c["violation_date"],
                    "location": c["location"]
                }
                for c in recent_challans[-5:]  # Last 5 recent
            ]
        },
        "generated_at": datetime.now().isoformat()
    }
