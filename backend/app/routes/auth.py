from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import random, string
from datetime import datetime
from ..database import customers_collection
from ..auth import create_access_token, get_password_hash, verify_password
from ..utils.otp import generate_otp, send_otp_sms, verify_otp

router = APIRouter(prefix="/api/auth", tags=["auth"])


# ===== PASSWORD LOGIN SCHEMAS =====
class LoginRequest(BaseModel):
    phone: str
    password: str


class RegisterRequest(BaseModel):
    phone: str
    password: str
    name: str = ""
    email: str = ""


# ===== OTP SCHEMAS (Keep existing) =====
class PhoneRequest(BaseModel):
    phone: str


class OTPVerifyRequest(BaseModel):
    phone: str
    otp: str


# =============================================
# NEW: PASSWORD-BASED LOGIN (NO OTP REQUIRED)
# =============================================

@router.post("/login")
async def login_with_password(req: LoginRequest):
    """Login with phone number and password"""
    if len(req.phone) < 10:
        raise HTTPException(400, "Invalid phone number")

    # Find customer
    customer = await customers_collection.find_customer_by_phone(req.phone)
    if not customer:
        raise HTTPException(404, "User not found. Please register first.")

    # Verify password
    if not verify_password(req.password, customer.get("password", "")):
        raise HTTPException(401, "Invalid password")

    # Create JWT token
    token = create_access_token(data={"sub": req.phone, "role": "customer"})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(customer.get("_id", "")),
            "phone": customer["phone"],
            "name": customer.get("name", ""),
            "email": customer.get("email", ""),
            "loyaltyPoints": customer.get("loyalty_points", 0),
            "referralCode": customer.get("referral_code", "")
        }
    }


@router.post("/register")
async def register(req: RegisterRequest):
    """Register a new user with phone and password"""
    if len(req.phone) < 10:
        raise HTTPException(400, "Invalid phone number")

    if len(req.password) < 6:
        raise HTTPException(400, "Password must be at least 6 characters")

    # Check if user already exists
    existing = await customers_collection.find_customer_by_phone(req.phone)
    if existing:
        raise HTTPException(400, "User already exists. Please login.")

    # Create new customer
    ref_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    hashed_password = get_password_hash(req.password)

    new_customer = {
        "phone": req.phone,
        "name": req.name,
        "email": req.email,
        "password": hashed_password,
        "loyalty_points": 0,
        "referral_code": ref_code,
        "referred_by": None,
        "created_at": datetime.utcnow().isoformat()
    }

    customer = await customers_collection.insert_customer(new_customer)

    # Create JWT token
    token = create_access_token(data={"sub": req.phone, "role": "customer"})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(customer.get("_id", "")),
            "phone": customer["phone"],
            "name": customer.get("name", ""),
            "email": customer.get("email", ""),
            "loyaltyPoints": customer.get("loyalty_points", 0),
            "referralCode": customer.get("referral_code", "")
        }
    }


# =============================================
# Keep your existing OTP routes
# =============================================

@router.post("/send-otp")
async def send_otp(req: PhoneRequest):
    if len(req.phone) < 10:
        raise HTTPException(400, "Invalid phone number")
    otp = generate_otp(req.phone)
    send_otp_sms(req.phone, otp)
    return {"message": "OTP sent", "otp": otp}


@router.post("/verify-otp")
async def verify_otp_endpoint(req: OTPVerifyRequest):
    # ... your existing verify_otp logic ...
    if not verify_otp(req.phone, req.otp):
        raise HTTPException(400, "Invalid or expired OTP")

    customer = await customers_collection.find_customer_by_phone(req.phone)
    if not customer:
        ref_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        customer = await customers_collection.insert_customer({
            "phone": req.phone,
            "name": "",
            "email": "",
            "password": None,
            "loyalty_points": 0,
            "referral_code": ref_code,
            "created_at": datetime.utcnow().isoformat()
        })

    token = create_access_token(data={"sub": req.phone, "role": "customer"})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(customer.get("_id", "")),
            "phone": customer["phone"],
            "name": customer.get("name", ""),
            "email": customer.get("email", ""),
            "loyaltyPoints": customer.get("loyalty_points", 0),
            "referralCode": customer.get("referral_code", "")
        }
    }