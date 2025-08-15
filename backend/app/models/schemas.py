"""
Database models and schemas using Pydantic
"""

from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
from bson import ObjectId
from pydantic import GetCoreSchemaHandler
from pydantic_core import core_schema
from typing import Any


class PyObjectId(ObjectId):

    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.no_info_after_validator_function(
            cls.validate,
            core_schema.str_schema()
        )

    @classmethod
    def validate(cls, v: Any) -> ObjectId:
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(str(v))

# ----- Base Configurable Model -----


class CustomBaseModel(BaseModel):
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        }


# ----- Timestamp Mixin -----
class TimestampMixin(CustomBaseModel):
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


# ----- Enums -----
class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"
    MODERATOR = "moderator"


class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class PaymentStatus(str, Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    REFUNDED = "refunded"


class VehicleType(str, Enum):
    HATCHBACK = "hatchback"
    SEDAN = "sedan"
    SUV = "suv"
    TRUCK = "truck"
    MOTORCYCLE = "motorcycle"


class ServiceStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


# ----- User Models -----
class UserBase(CustomBaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    location: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserLogin(CustomBaseModel):
    email: EmailStr
    password: str


class UserUpdate(CustomBaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    profile_image: Optional[str] = None


class User(UserBase, TimestampMixin):
    id: Optional[PyObjectId] = Field(alias="_id")
    role: UserRole = UserRole.USER
    is_active: bool = True
    is_verified: bool = False
    profile_image: Optional[str] = None
    total_bookings: int = 0


class UserInDB(User):
    hashed_password: str


# ----- Vehicle Models -----
class Vehicle(TimestampMixin):
    id: Optional[PyObjectId] = Field(alias="_id")
    user_id: PyObjectId
    brand: str
    model: str
    year: int
    vehicle_type: VehicleType
    registration_number: str
    color: Optional[str] = None
    fuel_type: Optional[str] = None


class VehicleCreate(CustomBaseModel):
    brand: str
    model: str
    year: int
    vehicle_type: VehicleType
    registration_number: str
    color: Optional[str] = None
    fuel_type: Optional[str] = None


# ----- Parking Models -----
class ParkingLot(TimestampMixin):
    id: Optional[PyObjectId] = Field(alias="_id")
    name: str
    location: str
    address: str
    latitude: float
    longitude: float
    total_capacity: int
    available_spots: int
    price_per_hour: float
    features: List[str] = []
    rating: float = 0.0
    images: List[str] = []
    contact_info: Dict[str, Any] = {}


class ParkingBooking(TimestampMixin):
    id: Optional[PyObjectId] = Field(alias="_id")
    user_id: PyObjectId
    parking_lot_id: PyObjectId
    vehicle_id: PyObjectId
    spot_number: Optional[str] = None
    start_time: datetime
    end_time: datetime
    status: BookingStatus = BookingStatus.PENDING
    total_amount: float
    payment_status: PaymentStatus = PaymentStatus.PENDING
    payment_id: Optional[str] = None


class ParkingBookingCreate(CustomBaseModel):
    parking_lot_id: str
    vehicle_id: str
    start_time: datetime
    end_time: datetime


# ----- Service Models -----
class ServiceCenter(TimestampMixin):
    id: Optional[PyObjectId] = Field(alias="_id")
    name: str
    brand: str
    location: str
    address: str
    latitude: float
    longitude: float
    contact_phone: str
    contact_email: Optional[EmailStr] = None
    services: List[str] = []
    rating: float = 0.0
    price_range: str = "₹₹"
    opening_hours: Dict[str, str] = {}
    images: List[str] = []


class ServiceAppointment(TimestampMixin):
    id: Optional[PyObjectId] = Field(alias="_id")
    user_id: PyObjectId
    service_center_id: PyObjectId
    vehicle_id: PyObjectId
    service_type: str
    appointment_date: datetime
    status: ServiceStatus = ServiceStatus.PENDING
    estimated_cost: Optional[float] = None
    actual_cost: Optional[float] = None
    notes: Optional[str] = None


class ServiceAppointmentCreate(CustomBaseModel):
    service_center_id: str
    vehicle_id: str
    service_type: str
    appointment_date: datetime
    notes: Optional[str] = None


# ----- E-Commerce Models -----
class Product(TimestampMixin):
    id: Optional[PyObjectId] = Field(alias="_id")
    name: str
    description: str
    brand: str
    category: str
    price: float
    original_price: Optional[float] = None
    stock_quantity: int
    images: List[str] = []
    specifications: Dict[str, Any] = {}
    rating: float = 0.0
    review_count: int = 0
    is_active: bool = True


class CartItem(CustomBaseModel):
    product_id: PyObjectId
    quantity: int
    price: float


class Order(TimestampMixin):
    id: Optional[PyObjectId] = Field(alias="_id")
    user_id: PyObjectId
    order_number: str
    items: List[CartItem]
    total_amount: float
    shipping_address: Dict[str, str]
    payment_status: PaymentStatus = PaymentStatus.PENDING
    order_status: str = "pending"
    payment_id: Optional[str] = None


# ----- AI Assistant Models -----
class ChatMessage(TimestampMixin):
    id: Optional[PyObjectId] = Field(alias="_id")
    user_id: PyObjectId
    message: str
    response: str
    intent: Optional[str] = None
    confidence: Optional[float] = None


# ----- FASTag Models -----
class FASTag(TimestampMixin):
    id: Optional[PyObjectId] = Field(alias="_id")
    user_id: PyObjectId
    vehicle_id: PyObjectId
    tag_id: str
    balance: float = 0.0
    is_active: bool = True
    bank_name: str
    account_number: Optional[str] = None


class FASTagTransaction(TimestampMixin):
    id: Optional[PyObjectId] = Field(alias="_id")
    fastag_id: PyObjectId
    transaction_type: str  # debit, credit
    amount: float
    balance_after: float
    location: Optional[str] = None
    transaction_id: str


# ----- Challan Models -----
class Challan(TimestampMixin):
    id: Optional[PyObjectId] = Field(alias="_id")
    user_id: PyObjectId
    vehicle_id: PyObjectId
    challan_number: str
    violation_type: str
    amount: float
    location: str
    violation_date: datetime
    due_date: datetime
    is_paid: bool = False
    payment_date: Optional[datetime] = None


# ----- Notification Models -----
class Notification(TimestampMixin):
    id: Optional[PyObjectId] = Field(alias="_id")
    user_id: PyObjectId
    title: str
    message: str
    type: str  # info, warning, success, error
    is_read: bool = False
    action_url: Optional[str] = None


# ----- API Response Models -----
class APIResponse(CustomBaseModel):
    success: bool = True
    message: str = "Operation successful"
    data: Optional[Any] = None
    timestamp: datetime = Field(default_factory=datetime.now)


class PaginatedResponse(CustomBaseModel):
    items: List[Any]
    total: int
    page: int
    size: int
    pages: int


# ----- Auth Models -----
class Token(CustomBaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(CustomBaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None
