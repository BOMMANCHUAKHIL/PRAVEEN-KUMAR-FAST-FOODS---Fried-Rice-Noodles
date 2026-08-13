# setup-backend.ps1
Write-Host "Creating backend directories..." -ForegroundColor Green

$dirs = @(
    "backend/app/routes",
    "backend/app/utils",
    "backend/app/static",
    "backend/app/models",
    "backend/app/schemas"
)
foreach ($d in $dirs) { New-Item -ItemType Directory -Path $d -Force | Out-Null }

Write-Host "Writing backend files..." -ForegroundColor Green

# requirements.txt
@"
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-dotenv==1.0.0
motor==3.3.2
pymongo==4.5.0
pydantic==2.4.2
pydantic-settings==2.0.3
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
httpx==0.25.1
twilio==8.10.0
"@ | Out-File -FilePath "backend/requirements.txt" -Encoding utf8

# .env
@"
MONGO_URI=mongodb://localhost:27017
DB_NAME=ahaa_emi_ruchi
SECRET_KEY=your-secret-key-change-me
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ADMIN_EMAIL=admin@ahaa.com
ADMIN_PASSWORD=SecurePass123
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=xxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
OWNER_WHATSAPP_NUMBERS=+917760373444,+918919958972
"@ | Out-File -FilePath "backend/.env" -Encoding utf8

# config.py
@"
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    MONGO_URI: str = "mongodb://localhost:27017"
    DB_NAME: str = "ahaa_emi_ruchi"
    SECRET_KEY: str = "dev_secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ADMIN_EMAIL: str = "admin@ahaa.com"
    ADMIN_PASSWORD: str = "admin123"
    RAZORPAY_KEY_ID: Optional[str] = None
    RAZORPAY_KEY_SECRET: Optional[str] = None
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_WHATSAPP_FROM: Optional[str] = None
    OWNER_WHATSAPP_NUMBERS: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    @property
    def owner_whatsapp_list(self):
        return [n.strip() for n in self.OWNER_WHATSAPP_NUMBERS.split(",") if n.strip()]

settings = Settings()
"@ | Out-File -FilePath "backend/app/config.py" -Encoding utf8

# database.py
@"
from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

client = AsyncIOMotorClient(settings.MONGO_URI)
db = client[settings.DB_NAME]

products_collection = db["products"]
orders_collection = db["orders"]
customers_collection = db["customers"]
delivery_zones_collection = db["delivery_zones"]
"@ | Out-File -FilePath "backend/app/database.py" -Encoding utf8

# models.py
@"
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
"@ | Out-File -FilePath "backend/app/models.py" -Encoding utf8

# schemas.py
@"
from pydantic import BaseModel
from typing import Optional, List

class ProductVariantCreate(BaseModel):
    weight: str
    price: float
    in_stock: bool = True

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
"@ | Out-File -FilePath "backend/app/schemas.py" -Encoding utf8

# auth.py
@"
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from .config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
"@ | Out-File -FilePath "backend/app/auth.py" -Encoding utf8

Write-Host "Backend files created!" -ForegroundColor Green
Write-Host "Run: cd backend; python -m venv venv; .\venv\Scripts\Activate.ps1; pip install -r requirements.txt" -ForegroundColor Yellow