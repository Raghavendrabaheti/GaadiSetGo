"""
Database connection and initialization
"""

from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import get_settings
import logging

settings = get_settings()
logger = logging.getLogger(__name__)

# Global database client
client: AsyncIOMotorClient = None
database = None


async def init_db():
    """Initialize database connection"""
    global client, database
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        database = client[settings.DATABASE_NAME]

        # Test connection
        await client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")

        # Create indexes
        await create_indexes()

    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise e


async def close_db():
    """Close database connection"""
    global client
    if client:
        client.close()
        logger.info("Database connection closed")


async def get_database():
    """Get database instance"""
    return database


async def create_indexes():
    """Create database indexes for optimal performance"""
    try:
        # User collection indexes
        await database.users.create_index("email", unique=True)
        await database.users.create_index("phone")

        # Vehicle collection indexes
        await database.vehicles.create_index("user_id")
        await database.vehicles.create_index("registration_number", unique=True)

        # Parking collection indexes
        await database.parking_lots.create_index([("latitude", "2dsphere"), ("longitude", "2dsphere")])
        await database.parking_bookings.create_index("user_id")
        await database.parking_bookings.create_index("parking_lot_id")
        await database.parking_bookings.create_index("start_time")

        # Service collection indexes
        await database.service_centers.create_index([("latitude", "2dsphere"), ("longitude", "2dsphere")])
        await database.service_appointments.create_index("user_id")
        await database.service_appointments.create_index("appointment_date")

        # E-commerce collection indexes
        await database.products.create_index("category")
        await database.products.create_index("brand")
        await database.orders.create_index("user_id")
        await database.orders.create_index("order_number", unique=True)

        # Challan collection indexes
        await database.challans.create_index("user_id")
        await database.challans.create_index("vehicle_id")
        await database.challans.create_index("challan_number", unique=True)

        # FASTag collection indexes
        await database.fastags.create_index("user_id")
        await database.fastags.create_index("tag_id", unique=True)
        await database.fastag_transactions.create_index("fastag_id")

        # Notification collection indexes
        await database.notifications.create_index("user_id")
        await database.notifications.create_index("created_at")

        # Chat collection indexes
        await database.chat_messages.create_index("user_id")
        await database.chat_messages.create_index("created_at")

        logger.info("Database indexes created successfully")

    except Exception as e:
        logger.error(f"Failed to create indexes: {e}")
        raise e


# Collection accessors
def get_users_collection():
    """Get users collection"""
    return database.users


def get_vehicles_collection():
    """Get vehicles collection"""
    return database.vehicles


def get_parking_lots_collection():
    """Get parking lots collection"""
    return database.parking_lots


def get_parking_bookings_collection():
    """Get parking bookings collection"""
    return database.parking_bookings


def get_service_centers_collection():
    """Get service centers collection"""
    return database.service_centers


def get_service_appointments_collection():
    """Get service appointments collection"""
    return database.service_appointments


def get_products_collection():
    """Get products collection"""
    return database.products


def get_orders_collection():
    """Get orders collection"""
    return database.orders


def get_chat_messages_collection():
    """Get chat messages collection"""
    return database.chat_messages


def get_fastags_collection():
    """Get fastags collection"""
    return database.fastags


def get_fastag_transactions_collection():
    """Get fastag transactions collection"""
    return database.fastag_transactions


def get_challans_collection():
    """Get challans collection"""
    return database.challans


def get_notifications_collection():
    """Get notifications collection"""
    return database.notifications
