# backend/seed.py
import asyncio
from app.database import db

products_data = [
    {
        "name": "Veg Fried Rice",
        "description": "Classic fried rice with fresh vegetables, spring onions, and aromatic Chinese spices.",
        "category": "fried-rice",
        "image": "",
        "variants": [
            {"weight": "Regular", "price": 100, "inStock": True},
            {"weight": "Large", "price": 160, "inStock": True}
        ],
        "isAvailable": True,
        "isFeatured": True,
        "tags": ["Veg", "Popular"],
    },
    {
        "name": "Gobbi Fried Rice",
        "description": "Delicious fried rice with crispy gobi (cauliflower) and fresh vegetables.",
        "category": "fried-rice",
        "image": "",
        "variants": [
            {"weight": "Regular", "price": 120, "inStock": True},
            {"weight": "Large", "price": 180, "inStock": True}
        ],
        "isAvailable": True,
        "isFeatured": True,
        "tags": ["Veg", "Special"],
    },
    {
        "name": "Chicken Fried Rice",
        "description": "Tender chicken pieces tossed with eggs, vegetables, and flavorful Chinese sauces.",
        "category": "fried-rice",
        "image": "",
        "variants": [
            {"weight": "Regular", "price": 150, "inStock": True},
            {"weight": "Large", "price": 220, "inStock": True}
        ],
        "isAvailable": True,
        "isFeatured": True,
        "tags": ["Non-Veg", "Bestseller"],
    },
    {
        "name": "Egg Fried Rice",
        "description": "Fluffy rice stir-fried with scrambled eggs, spring onions, and soy sauce.",
        "category": "fried-rice",
        "image": "",
        "variants": [
            {"weight": "Regular", "price": 110, "inStock": True},
            {"weight": "Large", "price": 170, "inStock": True}
        ],
        "isAvailable": True,
        "isFeatured": False,
        "tags": ["Egg", "Popular"],
    },
    {
        "name": "Flashman Fried Rice",
        "description": "Special flashman style fried rice with mixed vegetables and secret spices.",
        "category": "fried-rice",
        "image": "",
        "variants": [
            {"weight": "Regular", "price": 100, "inStock": True},
            {"weight": "Large", "price": 160, "inStock": True}
        ],
        "isAvailable": True,
        "isFeatured": False,
        "tags": ["Veg", "Special"],
    },
    {
        "name": "Veg Noodles",
        "description": "Stir-fried noodles with fresh vegetables, spring onions, and Chinese sauces.",
        "category": "noodles",
        "image": "",
        "variants": [
            {"weight": "Regular", "price": 100, "inStock": True},
            {"weight": "Large", "price": 160, "inStock": True}
        ],
        "isAvailable": True,
        "isFeatured": True,
        "tags": ["Veg", "Popular"],
    },
    {
        "name": "Chicken Noodles",
        "description": "Noodles with tender chicken pieces, vegetables, and aromatic spices.",
        "category": "noodles",
        "image": "",
        "variants": [
            {"weight": "Regular", "price": 150, "inStock": True},
            {"weight": "Large", "price": 220, "inStock": True}
        ],
        "isAvailable": True,
        "isFeatured": True,
        "tags": ["Non-Veg", "Bestseller"],
    },
    {
        "name": "Leg Piece",
        "description": "Crispy fried chicken leg piece with special masala coating.",
        "category": "starters",
        "image": "",
        "variants": [
            {"weight": "1 Pc", "price": 40, "inStock": True},
            {"weight": "2 Pcs", "price": 70, "inStock": True},
            {"weight": "4 Pcs", "price": 130, "inStock": True}
        ],
        "isAvailable": True,
        "isFeatured": True,
        "tags": ["Non-Veg", "Crispy"],
    },
    {
        "name": "Chicken Wings",
        "description": "Crispy fried chicken wings tossed in spicy sauce.",
        "category": "starters",
        "image": "",
        "variants": [
            {"weight": "3 Pcs", "price": 50, "inStock": True},
            {"weight": "6 Pcs", "price": 90, "inStock": True},
            {"weight": "12 Pcs", "price": 170, "inStock": True}
        ],
        "isAvailable": True,
        "isFeatured": True,
        "tags": ["Non-Veg", "Popular"],
    },
    {
        "name": "Gobbi Manchuriya",
        "description": "Crispy fried gobi (cauliflower) tossed in spicy, tangy Manchurian sauce.",
        "category": "starters",
        "image": "",
        "variants": [
            {"weight": "Regular", "price": 150, "inStock": True},
            {"weight": "Large", "price": 220, "inStock": True}
        ],
        "isAvailable": True,
        "isFeatured": True,
        "tags": ["Veg", "Bestseller"],
    },
    {
        "name": "Chicken Manchuriya",
        "description": "Crispy chicken balls tossed in spicy, tangy Manchurian sauce.",
        "category": "starters",
        "image": "",
        "variants": [
            {"weight": "Regular", "price": 150, "inStock": True},
            {"weight": "Large", "price": 220, "inStock": True}
        ],
        "isAvailable": True,
        "isFeatured": True,
        "tags": ["Non-Veg", "Bestseller"],
    }
]


async def seed_products():
    # Clear existing products
    db.products = []
    db._id_counter = 1
    print("🧹 Cleared existing products and reset ID counter")

    # Insert new products
    for product in products_data:
        result = await db.insert_product(product)
        print(f"✅ Added: {product['name']} (ID: {result.get('_id')})")

    print(f"\n📦 Total products: {len(db.products)}")
    print("✅ Seeding complete!")


if __name__ == "__main__":
    asyncio.run(seed_products())