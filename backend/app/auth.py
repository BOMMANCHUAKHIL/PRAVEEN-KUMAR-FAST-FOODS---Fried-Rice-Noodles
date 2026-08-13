from datetime import datetime, timedelta
from fastapi import HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from .config import settings
from .database import customers_collection
import hashlib, base64

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    salt = settings.SECRET_KEY[:16].encode()
    hash_obj = hashlib.pbkdf2_hmac('sha256', plain_password.encode(), salt, 100000)
    return base64.b64encode(hash_obj).decode() == hashed_password

def get_password_hash(password: str) -> str:
    salt = settings.SECRET_KEY[:16].encode()
    hash_obj = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)
    return base64.b64encode(hash_obj).decode()

def create_access_token(data: dict, expires_delta: timedelta = None):
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=30))
    return jwt.encode({**data, "exp": expire}, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

async def get_current_admin(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("role") != "admin":
            raise HTTPException(403, "Not admin")
        return payload.get("sub")
    except JWTError:
        raise HTTPException(401, "Invalid token")

async def get_current_customer(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        phone = payload.get("sub")
        customer = await customers_collection.find_customer_by_phone(phone)
        if not customer:
            raise HTTPException(404, "Customer not found")
        return customer
    except JWTError:
        raise HTTPException(401, "Invalid token")