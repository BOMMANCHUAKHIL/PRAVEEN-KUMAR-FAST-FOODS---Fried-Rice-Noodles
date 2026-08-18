from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    SECRET_KEY: str = "dev_secret_key_change_this"
    ADMIN_EMAIL: str = "admin@pkfastfood.com"
    ADMIN_PASSWORD: str = "pkfastfood@123"
    FAST2SMS_API_KEY: Optional[str] = None
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = "../.env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
# ✅ Debug: Print to confirm values are loaded
print(f"🔑 ADMIN_EMAIL from settings: {settings.ADMIN_EMAIL}")
print(f"🔑 ADMIN_PASSWORD: {settings.ADMIN_PASSWORD[:3]}...")