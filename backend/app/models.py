from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class ProductVariant(BaseModel):
    weight: str
    price: float
    in_stock: bool = True

class Product(BaseModel):
    id: str = Field(alias="_id")
    name: str
    description: str
    category: str
    image_url: Optional[str] = None
    variants: List[ProductVariant]
    is_available: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class OrderItem(BaseModel):
    product_id: str
    product_name: str
    variant: str
    quantity: int
    unit_price: float
    total: float

class DeliveryAddress(BaseModel):
    full_name: str
    phone: str
    address_line: str
    landmark: Optional[str] = None
    city: str = "Bengaluru"
    pincode: str
    lat: Optional[float] = None
    lng: Optional[float] = None

class Order(BaseModel):
    id: str = Field(alias="_id")
    order_number: str
    customer_id: Optional[str] = None
    items: List[OrderItem]
    total_amount: float
    delivery_address: DeliveryAddress
    payment_method: str
    payment_status: str = "pending"
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    status: str = "placed"
    live_video_requested: bool = False
    live_video_url: Optional[str] = None
    whatsapp_sent: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Customer(BaseModel):
    id: str = Field(alias="_id")
    phone: str
    name: Optional[str] = None
    email: Optional[str] = None
    loyalty_points: int = 0
    referral_code: str
    referred_by: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
