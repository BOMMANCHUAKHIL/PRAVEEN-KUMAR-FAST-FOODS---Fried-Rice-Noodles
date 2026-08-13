from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    SECRET_KEY: str = "dev_secret_key_change_this"
    ADMIN_EMAIL: str = "admin@ahaa.com"
    ADMIN_PASSWORD: str = "SecurePass123"
    FAST2SMS_API_KEY: Optional[str] = None
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()