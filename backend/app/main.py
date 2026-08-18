import os

from dotenv import load_dotenv

# =========================================================
# LOAD ENVIRONMENT VARIABLES FIRST
# =========================================================

load_dotenv()

print("🔍 Current Working Directory:", os.getcwd())
print("✅ .env loaded")


# =========================================================
# FASTAPI IMPORTS
# =========================================================

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm


# =========================================================
# APPLICATION IMPORTS
# =========================================================

from .config import settings
from .auth import (
    verify_password,
    create_access_token,
    get_password_hash,
)
from .routes import products, orders, auth


# =========================================================
# CREATE APP
# =========================================================

app = FastAPI(
    title="PRAVEEN KUMAR FAST FOODS API"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# ADMIN LOGIN
# =========================================================

@app.post("/token")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends()
):

    print(f"🔍 Login attempt: {form_data.username}")

    # Check email
    if form_data.username != settings.ADMIN_EMAIL:

        print(
            f"❌ Email mismatch: "
            f"{form_data.username} != {settings.ADMIN_EMAIL}"
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # Check password
    hashed = get_password_hash(
        settings.ADMIN_PASSWORD
    )

    is_valid = verify_password(
        form_data.password,
        hashed
    )

    print(f"🔍 Password valid: {is_valid}")

    if not is_valid:

        print(
            f"❌ Password invalid for "
            f"{form_data.username}"
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    print(
        f"✅ Login successful for "
        f"{form_data.username}"
    )

    access_token = create_access_token(
        data={
            "sub": form_data.username,
            "role": "admin"
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# =========================================================
# ROUTERS
# =========================================================

app.include_router(products.router)
app.include_router(orders.router)
app.include_router(auth.router)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
async def root():

    return {
        "message":
        "PRAVEEN KUMAR FAST FOODS API is Running"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
async def health_check():

    return {
        "status": "healthy"
    }