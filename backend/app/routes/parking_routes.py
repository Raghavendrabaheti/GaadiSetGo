"""
Parking routes - Parking lots, booking management, search functionality
"""

from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from datetime import datetime, timedelta
from bson import ObjectId
import math

from app.models.schemas import (
    ParkingLot, ParkingBooking, ParkingBookingCreate,
    BookingStatus, PaymentStatus, APIResponse, User
)
from app.core.auth import get_current_user
from app.database.connection import (
    get_parking_lots_collection,
    get_parking_bookings_collection,
    get_vehicles_collection
)

router = APIRouter()


@router.get("/lots", response_model=APIResponse)
async def get_parking_lots(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    features: Optional[List[str]] = Query(None)
):
    """
    ## 🅿️ Get Parking Lots

    Retrieve a paginated list of parking lots with optional filtering.
    """
    lots_collection = get_parking_lots_collection()

    # Build query filter
    query = {}

    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"location": {"$regex": search, "$options": "i"}},
            {"address": {"$regex": search, "$options": "i"}}
        ]

    if min_price is not None:
        query["price_per_hour"] = {"$gte": min_price}

    if max_price is not None:
        if "price_per_hour" in query:
            query["price_per_hour"]["$lte"] = max_price
        else:
            query["price_per_hour"] = {"$lte": max_price}

    if features:
        query["features"] = {"$in": features}

    # Calculate skip for pagination
    skip = (page - 1) * limit

    # Get total count
    total = await lots_collection.count_documents(query)

    # Get parking lots
    cursor = lots_collection.find(query).skip(skip).limit(limit)
    lots = await cursor.to_list(length=limit)

    # Convert ObjectId to string
    for lot in lots:
        lot["id"] = str(lot["_id"])
        lot.pop("_id", None)

    return APIResponse(
        status="success",
        message="Parking lots retrieved successfully",
        data={
            "lots": lots,
            "pagination": {
                "current_page": page,
                "total_pages": math.ceil(total / limit),
                "total_items": total,
                "items_per_page": limit
            }
        }
    )


@router.get("/lots/nearby", response_model=APIResponse)
async def get_nearby_parking_lots(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    radius: float = Query(5.0, ge=0.1, le=50,
                          description="Radius in kilometers"),
    limit: int = Query(10, ge=1, le=50)
):
    """
    ## 📍 Get Nearby Parking Lots

    Find parking lots near a specific location using geospatial search.
    """
    lots_collection = get_parking_lots_collection()

    # Convert radius from kilometers to meters (MongoDB uses meters)
    radius_meters = radius * 1000

    # Geospatial query
    query = {
        "location_coordinates": {
            "$near": {
                "$geometry": {
                    "type": "Point",
                    "coordinates": [longitude, latitude]
                },
                "$maxDistance": radius_meters
            }
        }
    }

    # Alternative query if location_coordinates doesn't exist
    # Using approximate distance calculation
    lots = await lots_collection.find({}).to_list(length=None)

    nearby_lots = []
    for lot in lots:
        # Calculate approximate distance using Haversine formula
        distance = calculate_distance(
            latitude, longitude,
            lot.get("latitude", 0), lot.get("longitude", 0)
        )

        if distance <= radius:
            lot["distance"] = round(distance, 2)
            lot["id"] = str(lot["_id"])
            lot.pop("_id", None)
            nearby_lots.append(lot)

    # Sort by distance and limit results
    nearby_lots.sort(key=lambda x: x["distance"])
    nearby_lots = nearby_lots[:limit]

    return APIResponse(
        status="success",
        message="Nearby parking lots retrieved successfully",
        data={
            "lots": nearby_lots,
            "search_center": {"latitude": latitude, "longitude": longitude},
            "radius_km": radius
        }
    )


@router.get("/lots/{lot_id}", response_model=APIResponse)
async def get_parking_lot_details(lot_id: str):
    """
    ## 🅿️ Get Parking Lot Details

    Retrieve detailed information about a specific parking lot.
    """
    if not ObjectId.is_valid(lot_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid parking lot ID"
        )

    lots_collection = get_parking_lots_collection()

    lot = await lots_collection.find_one({"_id": ObjectId(lot_id)})
    if not lot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Parking lot not found"
        )

    # Convert ObjectId to string
    lot["id"] = str(lot["_id"])
    lot.pop("_id", None)

    # Get current availability (check active bookings)
    bookings_collection = get_parking_bookings_collection()
    now = datetime.now()

    active_bookings = await bookings_collection.count_documents({
        "parking_lot_id": ObjectId(lot_id),
        "status": BookingStatus.ACTIVE,
        "start_time": {"$lte": now},
        "end_time": {"$gte": now}
    })

    lot["current_available_spots"] = max(
        0, lot.get("total_capacity", 0) - active_bookings)

    return APIResponse(
        status="success",
        message="Parking lot details retrieved successfully",
        data={"lot": lot}
    )


@router.post("/bookings", response_model=APIResponse)
async def create_parking_booking(
    booking_data: ParkingBookingCreate,
    current_user: User = Depends(get_current_user)
):
    """
    ## 📝 Create Parking Booking

    Create a new parking booking for the current user.
    """
    lots_collection = get_parking_lots_collection()
    bookings_collection = get_parking_bookings_collection()
    vehicles_collection = get_vehicles_collection()

    # Validate parking lot exists
    if not ObjectId.is_valid(booking_data.parking_lot_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid parking lot ID"
        )

    lot = await lots_collection.find_one({"_id": ObjectId(booking_data.parking_lot_id)})
    if not lot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Parking lot not found"
        )

    # Validate vehicle exists and belongs to user
    if not ObjectId.is_valid(booking_data.vehicle_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid vehicle ID"
        )

    vehicle = await vehicles_collection.find_one({
        "_id": ObjectId(booking_data.vehicle_id),
        "user_id": ObjectId(current_user.id)
    })
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found or doesn't belong to user"
        )

    # Validate booking time
    if booking_data.start_time >= booking_data.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End time must be after start time"
        )

    if booking_data.start_time < datetime.now():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot book for past time"
        )

    # Check availability
    active_bookings = await bookings_collection.count_documents({
        "parking_lot_id": ObjectId(booking_data.parking_lot_id),
        "status": {"$in": [BookingStatus.CONFIRMED, BookingStatus.ACTIVE]},
        "$or": [
            {
                "start_time": {"$lte": booking_data.start_time},
                "end_time": {"$gt": booking_data.start_time}
            },
            {
                "start_time": {"$lt": booking_data.end_time},
                "end_time": {"$gte": booking_data.end_time}
            },
            {
                "start_time": {"$gte": booking_data.start_time},
                "end_time": {"$lte": booking_data.end_time}
            }
        ]
    })

    if active_bookings >= lot.get("total_capacity", 0):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No available spots for the requested time"
        )

    # Calculate total amount
    duration_hours = (booking_data.end_time -
                      booking_data.start_time).total_seconds() / 3600
    total_amount = duration_hours * lot.get("price_per_hour", 0)

    # Create booking
    booking = {
        "user_id": ObjectId(current_user.id),
        "parking_lot_id": ObjectId(booking_data.parking_lot_id),
        "vehicle_id": ObjectId(booking_data.vehicle_id),
        "start_time": booking_data.start_time,
        "end_time": booking_data.end_time,
        "status": BookingStatus.PENDING,
        "total_amount": round(total_amount, 2),
        "payment_status": PaymentStatus.PENDING,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }

    result = await bookings_collection.insert_one(booking)
    booking["id"] = str(result.inserted_id)
    booking.pop("_id", None)

    # Convert ObjectIds to strings for response
    booking["user_id"] = str(booking["user_id"])
    booking["parking_lot_id"] = str(booking["parking_lot_id"])
    booking["vehicle_id"] = str(booking["vehicle_id"])

    return APIResponse(
        status="success",
        message="Parking booking created successfully",
        data={"booking": booking}
    )


@router.get("/bookings", response_model=APIResponse)
async def get_user_bookings(
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    status: Optional[BookingStatus] = None
):
    """
    ## 📋 Get User Bookings

    Retrieve current user's parking bookings with optional status filtering.
    """
    bookings_collection = get_parking_bookings_collection()
    lots_collection = get_parking_lots_collection()
    vehicles_collection = get_vehicles_collection()

    # Build query
    query = {"user_id": ObjectId(current_user.id)}
    if status:
        query["status"] = status

    # Calculate skip for pagination
    skip = (page - 1) * limit

    # Get total count
    total = await bookings_collection.count_documents(query)

    # Get bookings with sorting (most recent first)
    cursor = bookings_collection.find(query).sort(
        "created_at", -1).skip(skip).limit(limit)
    bookings = await cursor.to_list(length=limit)

    # Enrich bookings with parking lot and vehicle details
    for booking in bookings:
        booking["id"] = str(booking["_id"])
        booking.pop("_id", None)

        # Get parking lot details
        lot = await lots_collection.find_one({"_id": booking["parking_lot_id"]})
        if lot:
            booking["parking_lot"] = {
                "id": str(lot["_id"]),
                "name": lot.get("name"),
                "location": lot.get("location"),
                "address": lot.get("address")
            }

        # Get vehicle details
        vehicle = await vehicles_collection.find_one({"_id": booking["vehicle_id"]})
        if vehicle:
            booking["vehicle"] = {
                "id": str(vehicle["_id"]),
                "make": vehicle.get("make"),
                "model": vehicle.get("model"),
                "license_plate": vehicle.get("license_plate")
            }

        # Convert ObjectIds to strings
        booking["user_id"] = str(booking["user_id"])
        booking["parking_lot_id"] = str(booking["parking_lot_id"])
        booking["vehicle_id"] = str(booking["vehicle_id"])

    return APIResponse(
        status="success",
        message="User bookings retrieved successfully",
        data={
            "bookings": bookings,
            "pagination": {
                "current_page": page,
                "total_pages": math.ceil(total / limit),
                "total_items": total,
                "items_per_page": limit
            }
        }
    )


@router.get("/bookings/{booking_id}", response_model=APIResponse)
async def get_booking_details(
    booking_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    ## 📄 Get Booking Details

    Retrieve detailed information about a specific booking.
    """
    if not ObjectId.is_valid(booking_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid booking ID"
        )

    bookings_collection = get_parking_bookings_collection()
    lots_collection = get_parking_lots_collection()
    vehicles_collection = get_vehicles_collection()

    booking = await bookings_collection.find_one({
        "_id": ObjectId(booking_id),
        "user_id": ObjectId(current_user.id)
    })

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # Enrich with parking lot and vehicle details
    booking["id"] = str(booking["_id"])
    booking.pop("_id", None)

    # Get parking lot details
    lot = await lots_collection.find_one({"_id": booking["parking_lot_id"]})
    if lot:
        lot["id"] = str(lot["_id"])
        lot.pop("_id", None)
        booking["parking_lot"] = lot

    # Get vehicle details
    vehicle = await vehicles_collection.find_one({"_id": booking["vehicle_id"]})
    if vehicle:
        vehicle["id"] = str(vehicle["_id"])
        vehicle.pop("_id", None)
        booking["vehicle"] = vehicle

    # Convert ObjectIds to strings
    booking["user_id"] = str(booking["user_id"])
    booking["parking_lot_id"] = str(booking["parking_lot_id"])
    booking["vehicle_id"] = str(booking["vehicle_id"])

    return APIResponse(
        status="success",
        message="Booking details retrieved successfully",
        data={"booking": booking}
    )


@router.patch("/bookings/{booking_id}/cancel", response_model=APIResponse)
async def cancel_booking(
    booking_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    ## ❌ Cancel Booking

    Cancel a parking booking (only allowed for pending/confirmed bookings).
    """
    if not ObjectId.is_valid(booking_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid booking ID"
        )

    bookings_collection = get_parking_bookings_collection()

    booking = await bookings_collection.find_one({
        "_id": ObjectId(booking_id),
        "user_id": ObjectId(current_user.id)
    })

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # Check if booking can be cancelled
    if booking["status"] not in [BookingStatus.PENDING, BookingStatus.CONFIRMED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel booking with status: {booking['status']}"
        )

    # Check if cancellation is allowed (e.g., not too close to start time)
    time_until_start = booking["start_time"] - datetime.now()
    if time_until_start < timedelta(hours=1):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel booking less than 1 hour before start time"
        )

    # Update booking status
    await bookings_collection.update_one(
        {"_id": ObjectId(booking_id)},
        {
            "$set": {
                "status": BookingStatus.CANCELLED,
                "updated_at": datetime.now()
            }
        }
    )

    return APIResponse(
        status="success",
        message="Booking cancelled successfully",
        data={"booking_id": booking_id}
    )


@router.patch("/bookings/{booking_id}/checkin", response_model=APIResponse)
async def checkin_parking(
    booking_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    ## 🚗 Check-in to Parking

    Check-in to a confirmed parking booking.
    """
    if not ObjectId.is_valid(booking_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid booking ID"
        )

    bookings_collection = get_parking_bookings_collection()

    booking = await bookings_collection.find_one({
        "_id": ObjectId(booking_id),
        "user_id": ObjectId(current_user.id)
    })

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    if booking["status"] != BookingStatus.CONFIRMED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only check-in to confirmed bookings"
        )

    # Check if check-in time is valid
    now = datetime.now()
    if now < booking["start_time"] - timedelta(minutes=15):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Check-in not allowed more than 15 minutes before start time"
        )

    if now > booking["end_time"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot check-in after booking end time"
        )

    # Update booking status to active
    await bookings_collection.update_one(
        {"_id": ObjectId(booking_id)},
        {
            "$set": {
                "status": BookingStatus.ACTIVE,
                "actual_start_time": now,
                "updated_at": now
            }
        }
    )

    return APIResponse(
        status="success",
        message="Successfully checked in to parking",
        data={"booking_id": booking_id, "checkin_time": now}
    )


@router.patch("/bookings/{booking_id}/checkout", response_model=APIResponse)
async def checkout_parking(
    booking_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    ## 🚗 Check-out of Parking

    Check-out of an active parking booking.
    """
    if not ObjectId.is_valid(booking_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid booking ID"
        )

    bookings_collection = get_parking_bookings_collection()

    booking = await bookings_collection.find_one({
        "_id": ObjectId(booking_id),
        "user_id": ObjectId(current_user.id)
    })

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    if booking["status"] != BookingStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only check-out from active bookings"
        )

    now = datetime.now()

    # Calculate actual duration and any additional charges
    actual_start = booking.get("actual_start_time", booking["start_time"])
    actual_duration_hours = (now - actual_start).total_seconds() / 3600

    # Get parking lot details for pricing
    lots_collection = get_parking_lots_collection()
    lot = await lots_collection.find_one({"_id": booking["parking_lot_id"]})

    if not lot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Parking lot not found"
        )

    # Calculate final amount (handle overtime if any)
    original_duration = (booking["end_time"] -
                         booking["start_time"]).total_seconds() / 3600

    if actual_duration_hours > original_duration:
        # Overtime charges
        overtime_hours = actual_duration_hours - original_duration
        overtime_charges = overtime_hours * \
            lot.get("price_per_hour", 0) * 1.5  # 1.5x for overtime
        final_amount = booking["total_amount"] + overtime_charges
    else:
        final_amount = booking["total_amount"]

    # Update booking status to completed
    await bookings_collection.update_one(
        {"_id": ObjectId(booking_id)},
        {
            "$set": {
                "status": BookingStatus.COMPLETED,
                "actual_end_time": now,
                "final_amount": round(final_amount, 2),
                "updated_at": now
            }
        }
    )

    return APIResponse(
        status="success",
        message="Successfully checked out of parking",
        data={
            "booking_id": booking_id,
            "checkout_time": now,
            "final_amount": round(final_amount, 2),
            "duration_hours": round(actual_duration_hours, 2)
        }
    )


# Helper function for distance calculation
def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points on earth (specified in decimal degrees)
    Returns distance in kilometers
    """
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * \
        math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))

    # Radius of earth in kilometers
    r = 6371

    return c * r
