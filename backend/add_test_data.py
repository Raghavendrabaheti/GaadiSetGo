"""
Test script to add sample parking lots to the database
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from bson import ObjectId

# MongoDB connection
MONGO_URL = "mongodb://localhost:27017"
DATABASE_NAME = "gaadisetgo"


async def add_sample_parking_lots():
    """Add sample parking lots to the database"""

    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DATABASE_NAME]
    parking_lots_collection = db.parking_lots

    # Sample parking lots data
    sample_lots = [
        {
            "name": "City Center Mall",
            "location": "Connaught Place, New Delhi",
            "address": "Connaught Place, New Delhi, 110001",
            "total_capacity": 200,
            "available_capacity": 180,
            "price_per_hour": 20.0,
            "features": ["CCTV", "24/7 Security", "EV Charging"],
            "coordinates": {
                "type": "Point",
                "coordinates": [77.2167, 28.6315]  # [longitude, latitude]
            },
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "name": "Metro Station Hub",
            "location": "Rajiv Chowk Metro, New Delhi",
            "address": "Rajiv Chowk Metro Station, New Delhi, 110001",
            "total_capacity": 150,
            "available_capacity": 120,
            "price_per_hour": 15.0,
            "features": ["Metro Access", "Covered Parking"],
            "coordinates": {
                "type": "Point",
                "coordinates": [77.2197, 28.6328]  # [longitude, latitude]
            },
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "name": "Business District",
            "location": "Cyber City, Gurgaon",
            "address": "Cyber City, Sector 24, Gurgaon, 122002",
            "total_capacity": 300,
            "available_capacity": 250,
            "price_per_hour": 25.0,
            "features": ["Premium Location", "Valet Service", "Car Wash"],
            "coordinates": {
                "type": "Point",
                "coordinates": [77.0877, 28.4958]  # [longitude, latitude]
            },
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "name": "Airport Terminal",
            "location": "IGI Airport, New Delhi",
            "address": "Terminal 3, IGI Airport, New Delhi, 110037",
            "total_capacity": 500,
            "available_capacity": 400,
            "price_per_hour": 30.0,
            "features": ["Airport Parking", "24/7 Security", "Shuttle Service"],
            "coordinates": {
                "type": "Point",
                "coordinates": [77.0999, 28.5562]  # [longitude, latitude]
            },
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "name": "Shopping Complex",
            "location": "Select City Walk, Saket",
            "address": "Select City Walk, Saket, New Delhi, 110017",
            "total_capacity": 400,
            "available_capacity": 350,
            "price_per_hour": 18.0,
            "features": ["Shopping Mall", "Food Court Access", "Free WiFi"],
            "coordinates": {
                "type": "Point",
                "coordinates": [77.2066, 28.5245]  # [longitude, latitude]
            },
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
    ]

    try:
        # Check if parking lots already exist
        existing_count = await parking_lots_collection.count_documents({})
        print(f"Found {existing_count} existing parking lots")

        if existing_count == 0:
            # Insert sample data
            result = await parking_lots_collection.insert_many(sample_lots)
            print(
                f"✅ Successfully added {len(result.inserted_ids)} parking lots")

            # Print the inserted IDs
            for i, lot_id in enumerate(result.inserted_ids):
                print(f"   - {sample_lots[i]['name']}: {lot_id}")
        else:
            print("⚠️  Parking lots already exist. Skipping insertion.")

        # Show current parking lots
        lots = await parking_lots_collection.find({}).to_list(length=None)
        print(f"\n📊 Current parking lots in database: {len(lots)}")
        for lot in lots:
            print(
                f"   - {lot['name']} ({lot['total_capacity']} spots, ₹{lot['price_per_hour']}/hour)")

    except Exception as e:
        print(f"❌ Error adding parking lots: {e}")
    finally:
        client.close()


async def add_sample_vehicles():
    """Add sample vehicles for testing"""

    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DATABASE_NAME]
    vehicles_collection = db.vehicles
    users_collection = db.users

    try:
        # First, let's find or create a test user
        test_user_email = "test@example.com"
        test_user = await users_collection.find_one({"email": test_user_email})

        if not test_user:
            # Create a test user
            test_user_data = {
                "email": test_user_email,
                "full_name": "Test User",
                "phone_number": "+919876543210",
                "password_hash": "test_password_hash",
                "is_verified": True,
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            }
            result = await users_collection.insert_one(test_user_data)
            test_user_id = result.inserted_id
            print(f"✅ Created test user: {test_user_email}")
        else:
            test_user_id = test_user["_id"]
            print(f"✅ Found existing test user: {test_user_email}")

        # Sample vehicles data
        sample_vehicles = [
            {
                "user_id": test_user_id,
                "vehicle_number": "DL-01-AB-1234",
                "vehicle_type": "car",
                "brand": "Maruti",
                "model": "Swift",
                "color": "White",
                "is_active": True,
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            },
            {
                "user_id": test_user_id,
                "vehicle_number": "DL-02-CD-5678",
                "vehicle_type": "car",
                "brand": "Honda",
                "model": "City",
                "color": "Silver",
                "is_active": True,
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            },
            {
                "user_id": test_user_id,
                "vehicle_number": "DL-03-EF-9012",
                "vehicle_type": "motorcycle",
                "brand": "Hero",
                "model": "Splendor",
                "color": "Black",
                "is_active": True,
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            }
        ]

        # Check if vehicles already exist for this user
        existing_count = await vehicles_collection.count_documents({"user_id": test_user_id})
        print(f"Found {existing_count} existing vehicles for test user")

        if existing_count == 0:
            # Insert sample vehicles
            result = await vehicles_collection.insert_many(sample_vehicles)
            print(f"✅ Successfully added {len(result.inserted_ids)} vehicles")

            # Print the inserted vehicles
            for i, vehicle_id in enumerate(result.inserted_ids):
                vehicle = sample_vehicles[i]
                print(
                    f"   - {vehicle['vehicle_number']}: {vehicle['brand']} {vehicle['model']} ({vehicle_id})")
        else:
            print("⚠️  Vehicles already exist for test user. Skipping insertion.")

        # Show current vehicles
        vehicles = await vehicles_collection.find({"user_id": test_user_id}).to_list(length=None)
        print(f"\n📊 Current vehicles for test user: {len(vehicles)}")
        for vehicle in vehicles:
            print(
                f"   - {vehicle['vehicle_number']}: {vehicle['brand']} {vehicle['model']} ({vehicle['color']})")

    except Exception as e:
        print(f"❌ Error adding vehicles: {e}")
    finally:
        client.close()


async def main():
    """Run all test data creation functions"""
    print("🚀 Adding sample data to database...\n")

    print("1. Adding parking lots...")
    await add_sample_parking_lots()

    print("\n2. Adding sample vehicles...")
    await add_sample_vehicles()

    print("\n✅ Sample data setup complete!")


if __name__ == "__main__":
    asyncio.run(main())
