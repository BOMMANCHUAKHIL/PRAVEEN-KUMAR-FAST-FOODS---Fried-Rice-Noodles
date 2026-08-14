from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from ..database import products_collection
from ..auth import get_current_admin
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/products", tags=["products"])

class ProductVariant(BaseModel):
    weight: str
    price: float
    inStock: bool = True

class ProductCreate(BaseModel):
    name: str
    description: str
    category: str
    image_url: Optional[str] = None
    variants: List[ProductVariant]
    is_available: bool = True

def product_helper(product):
    return {
        "id": str(product.get("_id", "")),
        "name": product.get("name", ""),
        "description": product.get("description", ""),
        "category": product.get("category", ""),
        "image": product.get("image", ""),
        "variants": product.get("variants", []),
        "isAvailable": product.get("isAvailable", True),
        "isFeatured": product.get("isFeatured", False),
        "tags": product.get("tags", []),
        "createdAt": product.get("createdAt", datetime.utcnow().isoformat()),
    }

@router.get("")
async def get_products():
    return [product_helper(p) for p in await products_collection.find_products()]


@router.get("/{product_id}")
async def get_product(product_id: str):
    """Get a single product by ID"""
    try:
        print(f"🔍 Looking for product with ID: {product_id}")

        # Try to find by _id first
        product = await products_collection.find_product(product_id)

        # If not found, try by id field
        if not product:
            for p in products_collection.products:
                if str(p.get("id", "")) == product_id:
                    product = p
                    break

        if not product:
            print(f"❌ Product {product_id} not found")
            raise HTTPException(404, f"Product {product_id} not found")

        return product_helper(product)
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error fetching product: {e}")
        raise HTTPException(500, f"Error: {str(e)}")

@router.post("/")
async def create_product(product: ProductCreate, admin: dict = Depends(get_current_admin)):
    new_product = product.dict()
    new_product["createdAt"] = datetime.utcnow().isoformat()
    result = await products_collection.insert_product(new_product)
    return {"message": "Product created", "id": str(result.get("_id", ""))}