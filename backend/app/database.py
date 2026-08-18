import os
from datetime import datetime

from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId

# Load .env
load_dotenv()

# Get MongoDB connection string
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise RuntimeError("❌ MONGO_URI is not configured in .env")

print("🔗 MongoDB URI found")

try:
    # Connect to MongoDB Atlas
    client = MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=30000,
        connectTimeoutMS=20000,
        socketTimeoutMS=20000,
    )

    # Test connection
    client.admin.command("ping")

    print("✅ Connected to MongoDB Atlas successfully!")

except Exception as e:
    print(f"❌ Failed to connect to MongoDB: {e}")
    raise


# =========================================================
# DATABASE
# =========================================================

db = client["pk_fast_foods"]

print(f"✅ Database selected: {db.name}")


# =========================================================
# COLLECTIONS
# =========================================================

products_collection = db["products"]
orders_collection = db["orders"]
customers_collection = db["customers"]

print("✅ Collections ready:")
print("   - products")
print("   - orders")
print("   - customers")


# =========================================================
# PRODUCT FUNCTIONS
# =========================================================

async def find_products():
    return list(products_collection.find({}))


async def find_product(product_id):
    try:
        return products_collection.find_one({
            "_id": ObjectId(product_id)
        })
    except Exception:
        return products_collection.find_one({
            "id": product_id
        })


async def insert_product(data):
    data["createdAt"] = datetime.utcnow().isoformat()
    data["updated_at"] = datetime.utcnow().isoformat()

    result = products_collection.insert_one(data)

    return {
        "_id": str(result.inserted_id),
        **data
    }


async def update_product(product_id, data):
    data["updated_at"] = datetime.utcnow().isoformat()

    try:
        result = products_collection.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": data}
        )
    except Exception:
        result = products_collection.update_one(
            {"id": product_id},
            {"$set": data}
        )

    if result.modified_count > 0:
        return await find_product(product_id)

    return None


async def delete_product(product_id):
    try:
        result = products_collection.delete_one({
            "_id": ObjectId(product_id)
        })
    except Exception:
        result = products_collection.delete_one({
            "id": product_id
        })

    return result.deleted_count > 0


# =========================================================
# ORDER FUNCTIONS
# =========================================================

async def find_orders():
    return list(orders_collection.find({}))


async def find_order(order_id):
    try:
        return orders_collection.find_one({
            "_id": ObjectId(order_id)
        })
    except Exception:
        return orders_collection.find_one({
            "order_number": order_id
        })


async def insert_order(data):
    data["created_at"] = datetime.utcnow().isoformat()
    data["updated_at"] = datetime.utcnow().isoformat()

    result = orders_collection.insert_one(data)

    return {
        "_id": str(result.inserted_id),
        **data
    }


async def update_order(order_id, data):
    data["updated_at"] = datetime.utcnow().isoformat()

    try:
        orders_collection.update_one(
            {"_id": ObjectId(order_id)},
            {"$set": data}
        )
    except Exception:
        orders_collection.update_one(
            {"order_number": order_id},
            {"$set": data}
        )

    return await find_order(order_id)


# =========================================================
# CUSTOMER FUNCTIONS
# =========================================================

async def find_customer_by_phone(phone):
    return customers_collection.find_one({
        "phone": phone
    })


async def insert_customer(data):
    data["created_at"] = datetime.utcnow().isoformat()
    data["updated_at"] = datetime.utcnow().isoformat()

    result = customers_collection.insert_one(data)

    return {
        "_id": str(result.inserted_id),
        **data
    }


print("✅ MongoDB Database is ready!")