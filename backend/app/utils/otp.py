import random
from datetime import datetime, timedelta
import json

# Global OTP store (in-memory)
otp_store = {}


def generate_otp(phone: str) -> str:
    """Generate a 4-digit OTP"""
    otp = str(random.randint(1000, 9999))
    expires = datetime.utcnow() + timedelta(minutes=5)
    otp_store[phone] = {"otp": otp, "expires": expires.timestamp()}

    print(f"🔐 [GENERATE] OTP for {phone}: {otp}")
    print(f"📚 [GENERATE] Store contents: {json.dumps(otp_store, indent=2)}")
    return otp


def verify_otp(phone: str, otp: str) -> bool:
    """Verify OTP"""
    print(f"🔍 [VERIFY] Checking phone: {phone}, otp: {otp}")
    print(f"📚 [VERIFY] Store contents: {json.dumps(otp_store, indent=2)}")

    # Check if phone exists in store
    if phone not in otp_store:
        print(f"❌ [VERIFY] No OTP found for phone: {phone}")
        return False

    stored = otp_store[phone]
    print(f"📊 [VERIFY] Stored data: {stored}")

    # Check OTP match
    if stored["otp"] != otp:
        print(f"❌ [VERIFY] OTP mismatch: stored={stored['otp']}, received={otp}")
        return False

    # Check expiry
    current_time = datetime.utcnow().timestamp()
    if current_time > stored["expires"]:
        print(f"❌ [VERIFY] OTP expired for {phone}")
        del otp_store[phone]
        return False

    # Success - remove OTP
    del otp_store[phone]
    print(f"✅ [VERIFY] OTP verified successfully for {phone}")
    return True


def send_otp_sms(phone: str, otp: str):
    """Send OTP via SMS (console fallback)"""
    print(f"📱 [SMS] {phone} -> {otp}")
    return True