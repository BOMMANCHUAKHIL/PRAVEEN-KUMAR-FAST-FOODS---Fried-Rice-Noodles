from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from .config import settings
from .auth import verify_password, create_access_token, get_password_hash
from .routes import products, orders, auth

app = FastAPI(title="PRAVEEN KUMAR FAST FOODS API")

# ✅ CORS - Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ✅ Allow ALL origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != settings.ADMIN_EMAIL or not verify_password(
        form_data.password, get_password_hash(settings.ADMIN_PASSWORD)
    ):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    return {"access_token": create_access_token(data={"sub": form_data.username, "role": "admin"}), "token_type": "bearer"}

# Register all routers
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(auth.router)

@app.get("/")
async def root():
    return {"message": "PRAVEEN KUMAR FAST FOODS API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}