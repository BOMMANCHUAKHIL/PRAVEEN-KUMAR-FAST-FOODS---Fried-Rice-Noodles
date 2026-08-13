import random
import requests  # ✅ Make sure this is imported
from datetime import datetime, timedelta
import json
from ..config import settings

# Global OTP store (in-memory)
otp_store = {}


def generate_otp(phone: str) -> str:
    """Generate a 4-digit OTP"""
    otp = str(random.randint(1000, 9999))
    expires = datetime.utcnow() + timedelta(minutes=5)
    otp_store[phone] = {"otp": otp, "expires": expires.timestamp()}

    print(f"🔐 [GENERATE] OTP for {phone}: {otp}")
    return otp


def verify_otp(phone: str, otp: str) -> bool:
    """Verify OTP"""
    print(f"🔍 [VERIFY] Checking phone: {phone}, otp: {otp}")

    if phone not in otp_store:
        print(f"❌ [VERIFY] No OTP found for phone: {phone}")
        return False

    stored = otp_store[phone]
    print(f"📊 [VERIFY] Stored data: {stored}")

    if stored["otp"] != otp:
        print(f"❌ [VERIFY] OTP mismatch: stored={stored['otp']}, received={otp}")
        return False

    current_time = datetime.utcnow().timestamp()
    if current_time > stored["expires"]:
        print(f"❌ [VERIFY] OTP expired for {phone}")
        del otp_store[phone]
        return False

    del otp_store[phone]
    print(f"✅ [VERIFY] OTP verified successfully for {phone}")
    return True


def send_otp_sms(phone: str, otp: str):
    """Send OTP via Fast2SMS"""
    try:
        api_key = settings.FAST2SMS_API_KEY

        if not api_key:
            print(f"❌ No FAST2SMS_API_KEY found in environment")
            print(f"📱 [OTP] {phone} -> {otp} (SMS not sent)")
            return False

        # Clean phone to 10 digits
        clean_phone = phone.replace("+", "").replace(" ", "").strip()
        if clean_phone.startswith("91"):
            clean_phone = clean_phone[2:]
        if len(clean_phone) > 10:
            clean_phone = clean_phone[-10:]

        print(f"📤 Sending OTP to: {clean_phone}")
        print(f"📱 OTP: {otp}")
        print(f"🔑 API Key: {api_key[:10]}...")

        # ✅ Fast2SMS API endpoint
        url = "https://www.fast2sms.com/dev/bulkV2"

        payload = {
            "route": "otp",
            "variables_values": otp,
            "numbers": clean_phone,
            "flash": 0,
        }

        headers = {
            "authorization": api_key,
            "Content-Type": "application/json"
        }

        print(f"📤 Sending request to Fast2SMS...")

        response = requests.post(url, json=payload, headers=headers, timeout=10)

        # ✅ Print the actual response from Fast2SMS
        result = response.json()
        print(f"📥 Fast2SMS Response Status: {response.status_code}")
        print(f"📥 Fast2SMS Response: {result}")

        if result.get("return"):
            print(f"✅ SMS sent to {phone} successfully")
            return True
        else:
            print(f"❌ Fast2SMS Error: {result.get('message')}")
            return False

    except Exception as e:
        print(f"❌ Error sending OTP: {e}")
        return False
