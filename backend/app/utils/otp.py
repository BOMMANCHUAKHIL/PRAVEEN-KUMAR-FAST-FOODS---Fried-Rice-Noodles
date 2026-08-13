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
    try:
        api_key = settings.FAST2SMS_API_KEY

        if not api_key:
            print(f"❌ No API Key found")
            return False

        # Clean phone to 10 digits
        clean_phone = phone.replace("+", "").replace(" ", "").strip()
        if clean_phone.startswith("91"):
            clean_phone = clean_phone[2:]
        if len(clean_phone) > 10:
            clean_phone = clean_phone[-10:]

        # ✅ Use the correct URL and route
        url = "https://www.fast2sms.com/dev/bulkV2"

        payload = {
            "route": "otp",  # ✅ Use "otp" for OTP
            "variables_values": otp,
            "numbers": clean_phone,
            "flash": 0,
        }

        headers = {
            "authorization": api_key,
            "Content-Type": "application/json"
        }

        print(f"📤 Phone: {clean_phone}")
        print(f"📱 [SMS] {phone} -> {otp}")

        response = requests.post(url, json=payload, headers=headers, timeout=10)

        # ✅ Print the actual response from Fast2SMS
        result = response.json()
        print(f"📥 Fast2SMS Response: {result}")

        if result.get("return"):
            print(f"✅ SMS sent successfully")
            return True
        else:
            print(f"❌ Fast2SMS Error: {result.get('message')}")
            return False

    except Exception as e:
        print(f"❌ Error: {e}")
        return False