"""
Service routes - Service centers, appointments, and maintenance tracking
"""

from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from datetime import datetime, timedelta
from bson import ObjectId
import math

from app.models.schemas import (
    ServiceCenter, ServiceAppointment, ServiceAppointmentCreate,
    ServiceStatus, APIResponse, User
)
from app.core.auth import get_current_user
from app.database.connection import (
    get_service_centers_collection,
    get_service_appointments_collection,
    get_vehicles_collection
)

router = APIRouter()


# ===== SERVICE CENTER ROUTES =====

@router.get("/centers", response_model=APIResponse)
async def get_service_centers(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    search: Optional[str] = None,
    brand: Optional[str] = None,
    service_type: Optional[str] = None,
    min_rating: Optional[float] = None
):
    """
    ## 🔧 Get Service Centers

    Retrieve a paginated list of service centers with filtering options.
    """
    centers_collection = get_service_centers_collection()

    # Build query filter
    query = {}

    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"brand": {"$regex": search, "$options": "i"}},
            {"location": {"$regex": search, "$options": "i"}},
            {"address": {"$regex": search, "$options": "i"}}
        ]

    if brand:
        query["brand"] = {"$regex": brand, "$options": "i"}

    if service_type:
        query["services"] = {"$in": [service_type]}

    if min_rating is not None:
        query["rating"] = {"$gte": min_rating}

    # Calculate skip for pagination
    skip = (page - 1) * limit

    # Get total count
    total = await centers_collection.count_documents(query)

    # Get service centers (highest rating first)
    cursor = centers_collection.find(query).sort(
        "rating", -1).skip(skip).limit(limit)
    centers = await cursor.to_list(length=limit)

    # Convert ObjectIds to strings
    for center in centers:
        center["id"] = str(center["_id"])
        center.pop("_id", None)

    return APIResponse(
        success=True,
        message="Service centers retrieved successfully",
        data={
            "centers": centers,
            "pagination": {
                "current_page": page,
                "total_pages": math.ceil(total / limit),
                "total_items": total,
                "items_per_page": limit
            },
            "filters_applied": {
                "search": search,
                "brand": brand,
                "service_type": service_type,
                "min_rating": min_rating
            }
        }
    )


@router.get("/centers/nearby", response_model=APIResponse)
async def get_nearby_service_centers(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    radius: float = Query(10.0, ge=0.1, le=100,
                          description="Radius in kilometers"),
    service_type: Optional[str] = None,
    brand: Optional[str] = None,
    limit: int = Query(10, ge=1, le=50)
):
    """
    ## 📍 Get Nearby Service Centers

    Find service centers near a specific location.
    """
    centers_collection = get_service_centers_collection()

    # Build query
    query = {}
    if service_type:
        query["services"] = {"$in": [service_type]}
    if brand:
        query["brand"] = {"$regex": brand, "$options": "i"}

    # Get all centers and calculate distance
    all_centers = await centers_collection.find(query).to_list(length=None)

    nearby_centers = []
    for center in all_centers:
        # Calculate distance using the same function from parking routes
        distance = calculate_distance(
            latitude, longitude,
            center.get("latitude", 0), center.get("longitude", 0)
        )

        if distance <= radius:
            center["distance"] = round(distance, 2)
            center["id"] = str(center["_id"])
            center.pop("_id", None)
            nearby_centers.append(center)

    # Sort by distance and limit results
    nearby_centers.sort(key=lambda x: x["distance"])
    nearby_centers = nearby_centers[:limit]

    return APIResponse(
        success=True,
        message="Nearby service centers retrieved successfully",
        data={
            "centers": nearby_centers,
            "search_center": {"latitude": latitude, "longitude": longitude},
            "radius_km": radius,
            "count": len(nearby_centers)
        }
    )


@router.get("/centers/{center_id}", response_model=APIResponse)
async def get_service_center_details(center_id: str):
    """
    ## 🔍 Get Service Center Details

    Retrieve detailed information about a specific service center.
    """
    if not ObjectId.is_valid(center_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid service center ID"
        )

    centers_collection = get_service_centers_collection()
    appointments_collection = get_service_appointments_collection()

    center = await centers_collection.find_one({"_id": ObjectId(center_id)})
    if not center:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service center not found"
        )

    # Convert ObjectId to string
    center["id"] = str(center["_id"])
    center.pop("_id", None)

    # Get availability for next 7 days
    today = datetime.now().date()
    availability = []

    for i in range(7):
        check_date = today + timedelta(days=i)
        start_of_day = datetime.combine(check_date, datetime.min.time())
        end_of_day = datetime.combine(check_date, datetime.max.time())

        # Count appointments for this day
        appointments_count = await appointments_collection.count_documents({
            "service_center_id": ObjectId(center_id),
            "appointment_date": {
                "$gte": start_of_day,
                "$lte": end_of_day
            },
            "status": {"$in": [ServiceStatus.CONFIRMED, ServiceStatus.IN_PROGRESS]}
        })

        # Assume max 10 appointments per day
        max_appointments = 10
        available_slots = max(0, max_appointments - appointments_count)

        availability.append({
            "date": check_date.isoformat(),
            "day_name": check_date.strftime("%A"),
            "available_slots": available_slots,
            "is_available": available_slots > 0
        })

    center["availability"] = availability

    return APIResponse(
        success=True,
        message="Service center details retrieved successfully",
        data={"center": center}
    )


@router.get("/centers/brands", response_model=APIResponse)
async def get_service_brands():
    """
    ## 🏷️ Get Service Brands

    Retrieve all available service center brands.
    """
    centers_collection = get_service_centers_collection()

    # Get distinct brands
    brands = await centers_collection.distinct("brand")

    # Get brand counts
    brand_counts = []
    for brand in brands:
        count = await centers_collection.count_documents({"brand": brand})
        brand_counts.append({
            "name": brand,
            "count": count
        })

    # Sort alphabetically
    brand_counts.sort(key=lambda x: x["name"])

    return APIResponse(
        success=True,
        message="Service brands retrieved successfully",
        data={"brands": brand_counts}
    )


@router.get("/types", response_model=APIResponse)
async def get_service_types():
    """
    ## 🔧 Get Service Types

    Retrieve all available service types.
    """
    service_types = [
        {
            "name": "Oil Change",
            "description": "Engine oil and filter replacement",
            "estimated_duration": "30-45 minutes",
            "typical_cost": "₹1,500 - ₹3,000"
        },
        {
            "name": "General Service",
            "description": "Comprehensive vehicle inspection and maintenance",
            "estimated_duration": "2-3 hours",
            "typical_cost": "₹3,000 - ₹8,000"
        },
        {
            "name": "Brake Service",
            "description": "Brake pad and disc inspection/replacement",
            "estimated_duration": "1-2 hours",
            "typical_cost": "₹2,000 - ₹10,000"
        },
        {
            "name": "Tire Service",
            "description": "Tire rotation, alignment, and replacement",
            "estimated_duration": "1-2 hours",
            "typical_cost": "₹2,000 - ₹20,000"
        },
        {
            "name": "Battery Service",
            "description": "Battery testing and replacement",
            "estimated_duration": "30 minutes",
            "typical_cost": "₹3,000 - ₹8,000"
        },
        {
            "name": "AC Service",
            "description": "Air conditioning system maintenance",
            "estimated_duration": "1-2 hours",
            "typical_cost": "₹2,000 - ₹6,000"
        },
        {
            "name": "Engine Repair",
            "description": "Engine diagnostics and repair",
            "estimated_duration": "4-8 hours",
            "typical_cost": "₹5,000 - ₹50,000"
        },
        {
            "name": "Transmission Service",
            "description": "Transmission fluid change and inspection",
            "estimated_duration": "2-3 hours",
            "typical_cost": "₹3,000 - ₹15,000"
        }
    ]

    return APIResponse(
        success=True,
        message="Service types retrieved successfully",
        data={"service_types": service_types}
    )


# ===== APPOINTMENT ROUTES =====

@router.post("/appointments", response_model=APIResponse)
async def create_service_appointment(
    appointment_data: ServiceAppointmentCreate,
    current_user: User = Depends(get_current_user)
):
    """
    ## 📅 Create Service Appointment

    Book a service appointment at a service center.
    """
    centers_collection = get_service_centers_collection()
    appointments_collection = get_service_appointments_collection()
    vehicles_collection = get_vehicles_collection()

    # Validate service center exists
    if not ObjectId.is_valid(appointment_data.service_center_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid service center ID"
        )

    center = await centers_collection.find_one({"_id": ObjectId(appointment_data.service_center_id)})
    if not center:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service center not found"
        )

    # Validate vehicle exists and belongs to user
    if not ObjectId.is_valid(appointment_data.vehicle_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid vehicle ID"
        )

    vehicle = await vehicles_collection.find_one({
        "_id": ObjectId(appointment_data.vehicle_id),
        "user_id": ObjectId(current_user.id)
    })
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found or doesn't belong to user"
        )

    # Validate appointment date
    if appointment_data.appointment_date < datetime.now():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot book appointment for past date"
        )

    # Check if user already has an appointment at this time
    existing_appointment = await appointments_collection.find_one({
        "user_id": ObjectId(current_user.id),
        "appointment_date": {
            "$gte": appointment_data.appointment_date - timedelta(hours=1),
            "$lte": appointment_data.appointment_date + timedelta(hours=1)
        },
        "status": {"$in": [ServiceStatus.CONFIRMED, ServiceStatus.IN_PROGRESS]}
    })

    if existing_appointment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have an appointment around this time"
        )

    # Check service center availability
    same_day_appointments = await appointments_collection.count_documents({
        "service_center_id": ObjectId(appointment_data.service_center_id),
        "appointment_date": {
            "$gte": datetime.combine(appointment_data.appointment_date.date(), datetime.min.time()),
            "$lte": datetime.combine(appointment_data.appointment_date.date(), datetime.max.time())
        },
        "status": {"$in": [ServiceStatus.CONFIRMED, ServiceStatus.IN_PROGRESS]}
    })

    # Assume max 10 appointments per day
    if same_day_appointments >= 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Service center is fully booked for this day"
        )

    # Create appointment
    appointment = {
        "user_id": ObjectId(current_user.id),
        "service_center_id": ObjectId(appointment_data.service_center_id),
        "vehicle_id": ObjectId(appointment_data.vehicle_id),
        "service_type": appointment_data.service_type,
        "appointment_date": appointment_data.appointment_date,
        "status": ServiceStatus.PENDING,
        "notes": appointment_data.notes,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }

    result = await appointments_collection.insert_one(appointment)
    appointment["id"] = str(result.inserted_id)
    appointment.pop("_id", None)

    # Convert ObjectIds to strings for response
    appointment["user_id"] = str(appointment["user_id"])
    appointment["service_center_id"] = str(appointment["service_center_id"])
    appointment["vehicle_id"] = str(appointment["vehicle_id"])

    return APIResponse(
        success=True,
        message="Service appointment created successfully",
        data={"appointment": appointment}
    )


@router.get("/appointments", response_model=APIResponse)
async def get_user_appointments(
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    status: Optional[ServiceStatus] = None,
    upcoming_only: bool = False
):
    """
    ## 📋 Get User Appointments

    Retrieve current user's service appointments.
    """
    appointments_collection = get_service_appointments_collection()
    centers_collection = get_service_centers_collection()
    vehicles_collection = get_vehicles_collection()

    # Build query
    query = {"user_id": ObjectId(current_user.id)}

    if status:
        query["status"] = status

    if upcoming_only:
        query["appointment_date"] = {"$gte": datetime.now()}

    # Calculate skip for pagination
    skip = (page - 1) * limit

    # Get total count
    total = await appointments_collection.count_documents(query)

    # Get appointments (most recent first)
    cursor = appointments_collection.find(query).sort(
        "appointment_date", -1).skip(skip).limit(limit)
    appointments = await cursor.to_list(length=limit)

    # Enrich appointments with service center and vehicle details
    for appointment in appointments:
        appointment["id"] = str(appointment["_id"])
        appointment.pop("_id", None)

        # Get service center details
        center = await centers_collection.find_one({"_id": appointment["service_center_id"]})
        if center:
            appointment["service_center"] = {
                "id": str(center["_id"]),
                "name": center.get("name"),
                "brand": center.get("brand"),
                "location": center.get("location"),
                "contact_phone": center.get("contact_phone")
            }

        # Get vehicle details
        vehicle = await vehicles_collection.find_one({"_id": appointment["vehicle_id"]})
        if vehicle:
            appointment["vehicle"] = {
                "id": str(vehicle["_id"]),
                "brand": vehicle.get("brand"),
                "model": vehicle.get("model"),
                "registration_number": vehicle.get("registration_number")
            }

        # Convert ObjectIds to strings
        appointment["user_id"] = str(appointment["user_id"])
        appointment["service_center_id"] = str(
            appointment["service_center_id"])
        appointment["vehicle_id"] = str(appointment["vehicle_id"])

        # Add time remaining for upcoming appointments
        if appointment["appointment_date"] > datetime.now():
            time_diff = appointment["appointment_date"] - datetime.now()
            appointment["time_remaining"] = {
                "days": time_diff.days,
                "hours": time_diff.seconds // 3600,
                "minutes": (time_diff.seconds % 3600) // 60
            }

    return APIResponse(
        success=True,
        message="Appointments retrieved successfully",
        data={
            "appointments": appointments,
            "pagination": {
                "current_page": page,
                "total_pages": math.ceil(total / limit),
                "total_items": total,
                "items_per_page": limit
            }
        }
    )


@router.get("/appointments/{appointment_id}", response_model=APIResponse)
async def get_appointment_details(
    appointment_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    ## 📄 Get Appointment Details

    Retrieve detailed information about a specific appointment.
    """
    if not ObjectId.is_valid(appointment_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid appointment ID"
        )

    appointments_collection = get_service_appointments_collection()
    centers_collection = get_service_centers_collection()
    vehicles_collection = get_vehicles_collection()

    appointment = await appointments_collection.find_one({
        "_id": ObjectId(appointment_id),
        "user_id": ObjectId(current_user.id)
    })

    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )

    # Enrich with service center and vehicle details
    appointment["id"] = str(appointment["_id"])
    appointment.pop("_id", None)

    # Get service center details
    center = await centers_collection.find_one({"_id": appointment["service_center_id"]})
    if center:
        center["id"] = str(center["_id"])
        center.pop("_id", None)
        appointment["service_center"] = center

    # Get vehicle details
    vehicle = await vehicles_collection.find_one({"_id": appointment["vehicle_id"]})
    if vehicle:
        vehicle["id"] = str(vehicle["_id"])
        vehicle.pop("_id", None)
        appointment["vehicle"] = vehicle

    # Convert ObjectIds to strings
    appointment["user_id"] = str(appointment["user_id"])
    appointment["service_center_id"] = str(appointment["service_center_id"])
    appointment["vehicle_id"] = str(appointment["vehicle_id"])

    return APIResponse(
        success=True,
        message="Appointment details retrieved successfully",
        data={"appointment": appointment}
    )


@router.patch("/appointments/{appointment_id}/cancel", response_model=APIResponse)
async def cancel_appointment(
    appointment_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    ## ❌ Cancel Appointment

    Cancel a service appointment (only allowed for pending/confirmed appointments).
    """
    if not ObjectId.is_valid(appointment_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid appointment ID"
        )

    appointments_collection = get_service_appointments_collection()

    appointment = await appointments_collection.find_one({
        "_id": ObjectId(appointment_id),
        "user_id": ObjectId(current_user.id)
    })

    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )

    # Check if appointment can be cancelled
    if appointment["status"] not in [ServiceStatus.PENDING, ServiceStatus.CONFIRMED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel appointment with status: {appointment['status']}"
        )

    # Check if cancellation is allowed (e.g., not too close to appointment time)
    time_until_appointment = appointment["appointment_date"] - datetime.now()
    if time_until_appointment < timedelta(hours=2):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel appointment less than 2 hours before scheduled time"
        )

    # Update appointment status
    await appointments_collection.update_one(
        {"_id": ObjectId(appointment_id)},
        {
            "$set": {
                "status": ServiceStatus.CANCELLED,
                "cancelled_at": datetime.now(),
                "updated_at": datetime.now()
            }
        }
    )

    return APIResponse(
        success=True,
        message="Appointment cancelled successfully",
        data={"appointment_id": appointment_id}
    )


@router.patch("/appointments/{appointment_id}/reschedule", response_model=APIResponse)
async def reschedule_appointment(
    appointment_id: str,
    new_appointment_date: datetime,
    current_user: User = Depends(get_current_user)
):
    """
    ## 📅 Reschedule Appointment

    Change the date and time of an existing appointment.
    """
    if not ObjectId.is_valid(appointment_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid appointment ID"
        )

    appointments_collection = get_service_appointments_collection()

    appointment = await appointments_collection.find_one({
        "_id": ObjectId(appointment_id),
        "user_id": ObjectId(current_user.id)
    })

    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )

    # Check if appointment can be rescheduled
    if appointment["status"] not in [ServiceStatus.PENDING, ServiceStatus.CONFIRMED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot reschedule appointment with status: {appointment['status']}"
        )

    # Validate new appointment date
    if new_appointment_date < datetime.now():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot reschedule to a past date"
        )

    # Check availability at service center for new date
    same_day_appointments = await appointments_collection.count_documents({
        "service_center_id": appointment["service_center_id"],
        # Exclude current appointment
        "_id": {"$ne": ObjectId(appointment_id)},
        "appointment_date": {
            "$gte": datetime.combine(new_appointment_date.date(), datetime.min.time()),
            "$lte": datetime.combine(new_appointment_date.date(), datetime.max.time())
        },
        "status": {"$in": [ServiceStatus.CONFIRMED, ServiceStatus.IN_PROGRESS]}
    })

    if same_day_appointments >= 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Service center is fully booked for the requested date"
        )

    # Update appointment
    await appointments_collection.update_one(
        {"_id": ObjectId(appointment_id)},
        {
            "$set": {
                "appointment_date": new_appointment_date,
                "updated_at": datetime.now()
            }
        }
    )

    return APIResponse(
        success=True,
        message="Appointment rescheduled successfully",
        data={
            "appointment_id": appointment_id,
            "new_appointment_date": new_appointment_date
        }
    )


# Helper function for distance calculation (same as in parking routes)
def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points on earth (specified in decimal degrees)
    Returns distance in kilometers
    """
    import math

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
