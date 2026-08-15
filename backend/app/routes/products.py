from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from ..database import products_collection
from ..auth import get_current_admin
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(
    prefix="/api/products",
    tags=["products"]
)


class ProductVariant(BaseModel):
    weight: str
    price: float
    in_stock: bool = True


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
        "createdAt": product.get(
            "createdAt",
            datetime.utcnow().isoformat()
        ),
    }


@router.get("")
async def get_products():
    return [
        product_helper(p)
        for p in await products_collection.find_products()
    ]


@router.get("/{product_id}")
async def get_product(product_id: str):
    """Get a single product by ID"""
    try:
        print(f"🔍 Looking for product with ID: {product_id}")

        product = await products_collection.find_product(product_id)

        if not product:
            for p in products_collection.products:
                if str(p.get("id", "")) == product_id:
                    product = p
                    break

        if not product:
            print(f"❌ Product {product_id} not found")
            raise HTTPException(
                status_code=404,
                detail=f"Product {product_id} not found"
            )

        return product_helper(product)

    except HTTPException:
        raise

    except Exception as e:
        print(f"❌ Error fetching product: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        )


@router.post("")
async def create_product(
    product: ProductCreate,
    admin: dict = Depends(get_current_admin)
):
    new_product = product.dict()
    new_product["createdAt"] = datetime.utcnow().isoformat()

    result = await products_collection.insert_product(new_product)

    return {
        "message": "Product created",
        "id": str(result.get("_id", ""))
    }


@router.put("/{product_id}")
async def update_product(
        product_id: str,
        product_update: ProductCreate,
        admin: dict = Depends(get_current_admin)
):
    """Update an existing product"""
    try:
        # Check if product exists
        existing_product = await products_collection.find_product(product_id)
        if not existing_product:
            raise HTTPException(404, f"Product {product_id} not found")

        # Prepare update data - EXCLUDE 'inStock' and use 'in_stock' for database
        update_data = product_update.dict(exclude_unset=True)

        # Ensure variants use the correct field name for the database
        if "variants" in update_data:
            for variant in update_data["variants"]:
                if "inStock" in variant:
                    variant["in_stock"] = variant.pop("inStock")  # Convert to snake_case

        update_data["updated_at"] = datetime.utcnow().isoformat()

        # Perform update
        updated_product = await products_collection.update_product(product_id, update_data)

        if not updated_product:
            raise HTTPException(500, "Failed to update product")

        return {
            "message": "Product updated successfully",
            "product": product_helper(updated_product)
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error updating product: {e}")
        raise HTTPException(500, f"Error updating product: {str(e)}")
@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    admin: dict = Depends(get_current_admin)
):
    """Delete a product"""

    deleted = await products_collection.delete_product(product_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail=f"Product {product_id} not found"
        )

    return {
        "message": "Product deleted successfully"
    }