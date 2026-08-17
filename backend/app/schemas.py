from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProductVariant(BaseModel):
    weight: str
    price: float
    inStock: bool = True  # Frontend uses camelCase

class ProductCreate(BaseModel):
    name: str
    description: str
    category: str
    image: Optional[str] = None  # Changed from image_url to image
    variants: List[ProductVariant]
    isAvailable: bool = True     # Changed from is_available
    isFeatured: bool = False     # Added missing field
    tags: List[str] = []         # Added missing field

class Product(BaseModel):
    id: str = Field(alias="_id")
    name: str
    description: str
    category: str
    image: Optional[str] = None
    variants: List[ProductVariant]
    isAvailable: bool = True
    isFeatured: bool = False
    tags: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    variants: Optional[List[ProductVariantCreate]] = None
    is_available: Optional[bool] = None

class OrderItemCreate(BaseModel):
    product_id: str
    variant: str
    quantity: int

class DeliveryAddressCreate(BaseModel):
    full_name: str
    phone: str
    address_line: str
    landmark: Optional[str] = None
    city: str = "Vidavalur"  # ✅ Updated default city
    pincode: str = "524318"  # ✅ Added default pincode
    pincode: str
    lat: Optional[float] = None
    lng: Optional[float] = None

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    delivery_address: DeliveryAddressCreate
    payment_method: str
    live_video_requested: bool = False

class OrderStatusUpdate(BaseModel):
    status: str

class LiveVideoUpdate(BaseModel):
    live_video_url: str
