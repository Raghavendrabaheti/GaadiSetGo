"""
Vehicle routes - Vehicle management, registration, and information
"""

from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
import math
import re

from app.models.schemas import (
    Vehicle, VehicleCreate, VehicleType, APIResponse, User
)
from app.core.auth import get_current_user
from app.database.connection import get_vehicles_collection

router = APIRouter()


@router.post("/", response_model=APIResponse)
async def register_vehicle(
    vehicle_data: VehicleCreate,
    current_user: User = Depends(get_current_user)
):
    """
    ## 🚗 Register Vehicle

    Register a new vehicle for the current user.
    """
    vehicles_collection = get_vehicles_collection()

    # Validate registration number format (basic Indian format)
    registration_pattern = r'^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$'
    if not re.match(registration_pattern, vehicle_data.registration_number.upper()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid registration number format. Use format: XX00XX0000"
        )

    # Check if registration number already exists
    existing_vehicle = await vehicles_collection.find_one({
        "registration_number": vehicle_data.registration_number.upper()
    })

    if existing_vehicle:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle with this registration number already exists"
        )

    # Validate year
    current_year = datetime.now().year
    if vehicle_data.year < 1990 or vehicle_data.year > current_year + 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Year must be between 1990 and {current_year + 1}"
        )

    # Create vehicle document
    vehicle_dict = vehicle_data.dict()
    vehicle_dict.update({
        "user_id": ObjectId(current_user.id),
        "registration_number": vehicle_data.registration_number.upper(),
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    })

    # Insert vehicle
    result = await vehicles_collection.insert_one(vehicle_dict)

    # Prepare response
    vehicle_dict["id"] = str(result.inserted_id)
    vehicle_dict.pop("_id", None)
    vehicle_dict["user_id"] = str(vehicle_dict["user_id"])

    return APIResponse(
        success=True,
        message="Vehicle registered successfully",
        data={"vehicle": vehicle_dict}
    )


@router.get("/", response_model=APIResponse)
async def get_user_vehicles(
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    vehicle_type: Optional[VehicleType] = None
):
    """
    ## 🚗 Get User Vehicles

    Retrieve all vehicles registered by the current user.
    """
    vehicles_collection = get_vehicles_collection()

    # Build query
    query = {"user_id": ObjectId(current_user.id)}
    if vehicle_type:
        query["vehicle_type"] = vehicle_type

    # Calculate skip for pagination
    skip = (page - 1) * limit

    # Get total count
    total = await vehicles_collection.count_documents(query)

    # Get vehicles (most recent first)
    cursor = vehicles_collection.find(query).sort(
        "created_at", -1).skip(skip).limit(limit)
    vehicles = await cursor.to_list(length=limit)

    # Convert ObjectIds to strings
    for vehicle in vehicles:
        vehicle["id"] = str(vehicle["_id"])
        vehicle.pop("_id", None)
        vehicle["user_id"] = str(vehicle["user_id"])

    return APIResponse(
        success=True,
        message="Vehicles retrieved successfully",
        data={
            "vehicles": vehicles,
            "pagination": {
                "current_page": page,
                "total_pages": math.ceil(total / limit),
                "total_items": total,
                "items_per_page": limit
            }
        }
    )


@router.get("/{vehicle_id}", response_model=APIResponse)
async def get_vehicle_details(
    vehicle_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    ## 🔍 Get Vehicle Details

    Retrieve detailed information about a specific vehicle.
    """
    if not ObjectId.is_valid(vehicle_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid vehicle ID"
        )

    vehicles_collection = get_vehicles_collection()

    vehicle = await vehicles_collection.find_one({
        "_id": ObjectId(vehicle_id),
        "user_id": ObjectId(current_user.id)
    })

    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )

    # Convert ObjectIds to strings
    vehicle["id"] = str(vehicle["_id"])
    vehicle.pop("_id", None)
    vehicle["user_id"] = str(vehicle["user_id"])

    # Add computed fields
    current_year = datetime.now().year
    vehicle["age"] = current_year - vehicle["year"]

    return APIResponse(
        success=True,
        message="Vehicle details retrieved successfully",
        data={"vehicle": vehicle}
    )


@router.patch("/{vehicle_id}", response_model=APIResponse)
async def update_vehicle(
    vehicle_id: str,
    vehicle_data: VehicleCreate,
    current_user: User = Depends(get_current_user)
):
    """
    ## ✏️ Update Vehicle

    Update vehicle information (registration number cannot be changed).
    """
    if not ObjectId.is_valid(vehicle_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid vehicle ID"
        )

    vehicles_collection = get_vehicles_collection()

    # Check if vehicle exists and belongs to user
    existing_vehicle = await vehicles_collection.find_one({
        "_id": ObjectId(vehicle_id),
        "user_id": ObjectId(current_user.id)
    })

    if not existing_vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )

    # Check if trying to change registration number
    if vehicle_data.registration_number.upper() != existing_vehicle["registration_number"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration number cannot be changed. Please delete and register a new vehicle."
        )

    # Validate year
    current_year = datetime.now().year
    if vehicle_data.year < 1990 or vehicle_data.year > current_year + 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Year must be between 1990 and {current_year + 1}"
        )

    # Update vehicle
    update_data = vehicle_data.dict()
    update_data["updated_at"] = datetime.now()

    await vehicles_collection.update_one(
        {"_id": ObjectId(vehicle_id)},
        {"$set": update_data}
    )

    # Get updated vehicle
    updated_vehicle = await vehicles_collection.find_one({"_id": ObjectId(vehicle_id)})
    updated_vehicle["id"] = str(updated_vehicle["_id"])
    updated_vehicle.pop("_id", None)
    updated_vehicle["user_id"] = str(updated_vehicle["user_id"])

    return APIResponse(
        success=True,
        message="Vehicle updated successfully",
        data={"vehicle": updated_vehicle}
    )


@router.delete("/{vehicle_id}", response_model=APIResponse)
async def delete_vehicle(
    vehicle_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    ## 🗑️ Delete Vehicle

    Delete a vehicle from the user's account.
    """
    if not ObjectId.is_valid(vehicle_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid vehicle ID"
        )

    vehicles_collection = get_vehicles_collection()

    # Check if vehicle exists and belongs to user
    vehicle = await vehicles_collection.find_one({
        "_id": ObjectId(vehicle_id),
        "user_id": ObjectId(current_user.id)
    })

    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )

    # TODO: Check if vehicle has active bookings/appointments before deletion
    # For now, we'll allow deletion

    # Delete vehicle
    await vehicles_collection.delete_one({"_id": ObjectId(vehicle_id)})

    return APIResponse(
        success=True,
        message="Vehicle deleted successfully",
        data={"vehicle_id": vehicle_id}
    )


@router.get("/types/available", response_model=APIResponse)
async def get_vehicle_types():
    """
    ## 📋 Get Vehicle Types

    Retrieve all available vehicle types.
    """
    vehicle_types = [
        {
            "value": "hatchback",
            "label": "Hatchback",
            "description": "Compact car with rear door that opens upwards"
        },
        {
            "value": "sedan",
            "label": "Sedan",
            "description": "Three-box passenger car with separate trunk"
        },
        {
            "value": "suv",
            "label": "SUV",
            "description": "Sport Utility Vehicle with higher ground clearance"
        },
        {
            "value": "truck",
            "label": "Truck",
            "description": "Commercial vehicle for transporting goods"
        },
        {
            "value": "motorcycle",
            "label": "Motorcycle",
            "description": "Two-wheeled motor vehicle"
        }
    ]

    return APIResponse(
        success=True,
        message="Vehicle types retrieved successfully",
        data={"vehicle_types": vehicle_types}
    )


@router.get("/search/registration", response_model=APIResponse)
async def search_by_registration(
    registration: str = Query(..., min_length=4),
    current_user: User = Depends(get_current_user)
):
    """
    ## 🔍 Search Vehicle by Registration

    Search for a vehicle by registration number (user's vehicles only).
    """
    vehicles_collection = get_vehicles_collection()

    # Search in user's vehicles only
    vehicles = await vehicles_collection.find({
        "user_id": ObjectId(current_user.id),
        "registration_number": {"$regex": registration.upper(), "$options": "i"}
    }).to_list(length=10)

    # Convert ObjectIds to strings
    for vehicle in vehicles:
        vehicle["id"] = str(vehicle["_id"])
        vehicle.pop("_id", None)
        vehicle["user_id"] = str(vehicle["user_id"])

    return APIResponse(
        success=True,
        message="Vehicle search completed",
        data={
            "vehicles": vehicles,
            "search_term": registration.upper(),
            "count": len(vehicles)
        }
    )


@router.get("/{vehicle_id}/history", response_model=APIResponse)
async def get_vehicle_history(
    vehicle_id: str,
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50)
):
    """
    ## 📚 Get Vehicle History

    Retrieve parking bookings and service appointments for a specific vehicle.
    """
    if not ObjectId.is_valid(vehicle_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid vehicle ID"
        )

    vehicles_collection = get_vehicles_collection()

    # Verify vehicle belongs to user
    vehicle = await vehicles_collection.find_one({
        "_id": ObjectId(vehicle_id),
        "user_id": ObjectId(current_user.id)
    })

    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )

    # Import here to avoid circular imports
    from app.database.connection import (
        get_parking_bookings_collection,
        get_service_appointments_collection
    )

    bookings_collection = get_parking_bookings_collection()
    appointments_collection = get_service_appointments_collection()

    # Get parking bookings
    bookings = await bookings_collection.find({
        "vehicle_id": ObjectId(vehicle_id)
    }).sort("created_at", -1).limit(5).to_list(length=5)

    # Get service appointments
    appointments = await appointments_collection.find({
        "vehicle_id": ObjectId(vehicle_id)
    }).sort("created_at", -1).limit(5).to_list(length=5)

    # Convert ObjectIds to strings
    for booking in bookings:
        booking["id"] = str(booking["_id"])
        booking.pop("_id", None)
        booking["user_id"] = str(booking["user_id"])
        booking["parking_lot_id"] = str(booking["parking_lot_id"])
        booking["vehicle_id"] = str(booking["vehicle_id"])
        booking["type"] = "parking"

    for appointment in appointments:
        appointment["id"] = str(appointment["_id"])
        appointment.pop("_id", None)
        appointment["user_id"] = str(appointment["user_id"])
        appointment["service_center_id"] = str(
            appointment["service_center_id"])
        appointment["vehicle_id"] = str(appointment["vehicle_id"])
        appointment["type"] = "service"

    # Combine and sort by date
    all_history = bookings + appointments
    all_history.sort(key=lambda x: x.get(
        "created_at", datetime.min), reverse=True)

    # Apply pagination
    skip = (page - 1) * limit
    paginated_history = all_history[skip:skip + limit]

    return APIResponse(
        success=True,
        message="Vehicle history retrieved successfully",
        data={
            "vehicle_id": vehicle_id,
            "history": paginated_history,
            "pagination": {
                "current_page": page,
                "total_items": len(all_history),
                "items_per_page": limit
            },
            "summary": {
                "total_bookings": len(bookings),
                "total_appointments": len(appointments)
            }
        }
    )
