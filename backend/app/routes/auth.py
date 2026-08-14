from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import random, string
from datetime import datetime
from ..database import customers_collection
from ..auth import create_access_token
from ..utils.otp import generate_otp, send_otp_sms, verify_otp  # ✅ Make sure verify_otp is imported

router = APIRouter(prefix="/api/auth", tags=["auth"])


class PhoneRequest(BaseModel):
    phone: str


class OTPVerifyRequest(BaseModel):
    phone: str
    otp: str

@router.post("/send-otp")
async def send_otp(req: PhoneRequest):
    if len(req.phone) < 10:
        raise HTTPException(
            status_code=400,
            detail="Invalid phone number"
        )

    print(f"📞 [SEND-OTP] Request received for {req.phone}")

    otp = generate_otp(req.phone)

    print(f"🔐 [SEND-OTP] Generated OTP: {otp}")
    print("📤 [SEND-OTP] Calling Fast2SMS...")

    sms_sent = send_otp_sms(req.phone, otp)

    print(f"📨 [SEND-OTP] Fast2SMS result: {sms_sent}")

    if not sms_sent:
        print("❌ [SEND-OTP] SMS FAILED")

        raise HTTPException(
            status_code=500,
            detail="Failed to send OTP"
        )

    print("✅ [SEND-OTP] SMS SENT")

    return {
        "message": "OTP sent successfully"
    }


@router.post("/verify-otp")
async def verify_otp(req: OTPVerifyRequest):
    if not verify_otp(req.phone, req.otp):  # ✅ Use the imported verify_otp function
        raise HTTPException(400, "Invalid or expired OTP")

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