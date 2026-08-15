from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from ..database import products_collection
from ..auth import get_current_admin
from ..schemas import ProductCreate
from typing import List, Optional

router = APIRouter(tags=["products"])

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
        "updatedAt": product.get("updated_at", datetime.utcnow().isoformat()),
    }

@router.get("/api/products")
async def get_products():
    return [product_helper(p) for p in await products_collection.find_products()]

@router.get("/api/products/{product_id}")
async def get_product(product_id: str):
    product = await products_collection.find_product(product_id)
    if not product:
        raise HTTPException(404, f"Product {product_id} not found")
    return product_helper(product)

@router.post("/api/products")
async def create_product(product: ProductCreate, admin: dict = Depends(get_current_admin)):
    new_product = product.dict()
    new_product["createdAt"] = datetime.utcnow().isoformat()
    new_product["updated_at"] = datetime.utcnow().isoformat()
    result = await products_collection.insert_product(new_product)
    return {"message": "Product created", "id": str(result.get("_id", ""))}

@router.put("/api/products/{product_id}")
async def update_product(
    product_id: str,
    product_update: ProductCreate,
    admin: dict = Depends(get_current_admin)
):
    existing_product = await products_collection.find_product(product_id)
    if not existing_product:
        raise HTTPException(404, f"Product {product_id} not found")

    update_data = product_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow().isoformat()

    updated_product = await products_collection.update_product(product_id, update_data)
    if not updated_product:
        raise HTTPException(500, "Failed to update product")

    return {
        "message": "Product updated successfully",
        "product": product_helper(updated_product)
    }

@router.delete("/api/products/{product_id}")
async def delete_product(product_id: str, admin: dict = Depends(get_current_admin)):
    deleted = await products_collection.delete_product(product_id)
    if not deleted:
        raise HTTPException(404, f"Product {product_id} not found")
    return {"message": "Product deleted successfully"}