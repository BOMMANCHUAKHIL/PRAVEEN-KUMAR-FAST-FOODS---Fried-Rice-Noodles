from pydantic import BaseModel
from typing import Optional, List

class ProductVariantCreate(BaseModel):
    weight: str
    price: float
    inStock: bool = True

class ProductCreate(BaseModel):
    name: str
    description: str
    category: str
    image_url: Optional[str] = None
    variants: List[ProductVariantCreate]
    is_available: bool = True

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
    city: str = "Bengaluru"
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
