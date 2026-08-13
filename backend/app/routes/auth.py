from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import random, string
from datetime import datetime
from ..database import customers_collection
from ..auth import create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

otp_store = {}


class PhoneRequest(BaseModel):
    phone: str


class OTPVerifyRequest(BaseModel):
    phone: str
    otp: str


@router.post("/send-otp")
async def send_otp(req: PhoneRequest):
    if len(req.phone) < 10:
        raise HTTPException(400, "Invalid phone number")
    otp = str(random.randint(1000, 9999))
    otp_store[req.phone] = {"otp": otp, "expires": datetime.utcnow().timestamp() + 300}
    print(f"[OTP] {req.phone} -> {otp}")
    return {"message": "OTP sent", "otp": otp}


@router.post("/verify-otp")
async def verify_otp(req: OTPVerifyRequest):
    stored = otp_store.get(req.phone)
    if not stored:
        raise HTTPException(400, "OTP not found")
    if stored["otp"] != req.otp:
        raise HTTPException(400, "Invalid OTP")
    if datetime.utcnow().timestamp() > stored["expires"]:
        raise HTTPException(400, "OTP expired")
    del otp_store[req.phone]

    customer = await customers_collection.find_customer_by_phone(req.phone)
    if not customer:
        ref_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        customer = await customers_collection.insert_customer({
            "phone": req.phone,
            "name": "",
            "email": "",
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