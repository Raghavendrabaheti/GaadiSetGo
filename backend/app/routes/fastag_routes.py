"""
FASTag management routes - Balance, Transactions, Recharge
"""

from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from datetime import datetime
from app.models.schemas import (
    FASTag, FASTagTransaction, User, APIResponse
)
from app.core.auth import get_current_active_user
from app.database.connection import get_fastags_collection, get_fastag_transactions_collection
import uuid

router = APIRouter()


@router.get("/", response_model=List[FASTag])
async def get_user_fastags(
    current_user: User = Depends(get_current_active_user)
):
    """
    ## 💳 Get User FASTags

    Retrieve all FASTags associated with the user.
    """
    fastags_collection = get_fastags_collection()

    cursor = fastags_collection.find({"user_id": current_user.id})
    fastags = await cursor.to_list(length=None)

    return [FASTag(**fastag) for fastag in fastags]


@router.get("/{fastag_id}", response_model=FASTag)
async def get_fastag(
    fastag_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    ## 🎫 Get FASTag Details

    Get detailed information about a specific FASTag.
    """
    fastags_collection = get_fastags_collection()

    fastag = await fastags_collection.find_one({
        "_id": fastag_id,
        "user_id": current_user.id
    })

    if not fastag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FASTag not found"
        )

    return FASTag(**fastag)


@router.post("/{fastag_id}/recharge", response_model=APIResponse)
async def recharge_fastag(
    fastag_id: str,
    amount: float,
    current_user: User = Depends(get_current_active_user)
):
    """
    ## 💰 Recharge FASTag

    Recharge FASTag with specified amount.
    """
    fastags_collection = get_fastags_collection()
    fastag_transactions_collection = get_fastag_transactions_collection()

    if amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recharge amount must be greater than zero"
        )

    # Get FASTag
    fastag = await fastags_collection.find_one({
        "_id": fastag_id,
        "user_id": current_user.id
    })

    if not fastag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FASTag not found"
        )

    # Calculate new balance
    new_balance = fastag["balance"] + amount

    # Update FASTag balance
    await fastags_collection.update_one(
        {"_id": fastag_id},
        {
            "$set": {
                "balance": new_balance,
                "updated_at": datetime.now()
            }
        }
    )

    # Create transaction record
    transaction = FASTagTransaction(
        id=str(uuid.uuid4()),
        fastag_id=fastag_id,
        transaction_type="credit",
        amount=amount,
        balance_after=new_balance,
        transaction_id=f"RCH{datetime.now().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:6].upper()}",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

    await fastag_transactions_collection.insert_one(
        transaction.dict(by_alias=True, exclude={"id"})
    )

    return APIResponse(
        success=True,
        message="FASTag recharged successfully",
        data={
            "amount": amount,
            "new_balance": new_balance,
            "transaction_id": transaction.transaction_id
        }
    )


@router.get("/{fastag_id}/transactions", response_model=List[FASTagTransaction])
async def get_fastag_transactions(
    fastag_id: str,
    current_user: User = Depends(get_current_active_user),
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100)
):
    """
    ## 📊 Get FASTag Transactions

    Retrieve transaction history for a specific FASTag.
    """
    fastags_collection = get_fastags_collection()
    fastag_transactions_collection = get_fastag_transactions_collection()

    # Verify FASTag ownership
    fastag = await fastags_collection.find_one({
        "_id": fastag_id,
        "user_id": current_user.id
    })

    if not fastag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FASTag not found"
        )

    # Calculate pagination
    skip = (page - 1) * size

    # Get transactions sorted by date (newest first)
    cursor = fastag_transactions_collection.find({
        "fastag_id": fastag_id
    }).sort("created_at", -1).skip(skip).limit(size)

    transactions = await cursor.to_list(length=size)

    return [FASTagTransaction(**transaction) for transaction in transactions]


@router.get("/{fastag_id}/balance")
async def get_fastag_balance(
    fastag_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    ## 💳 Get FASTag Balance

    Get current balance for a specific FASTag.
    """
    fastags_collection = get_fastags_collection()

    fastag = await fastags_collection.find_one({
        "_id": fastag_id,
        "user_id": current_user.id
    })

    if not fastag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FASTag not found"
        )

    return {
        "fastag_id": fastag_id,
        "tag_id": fastag["tag_id"],
        "balance": fastag["balance"],
        "is_active": fastag["is_active"],
        "last_updated": fastag["updated_at"]
    }
