from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from .config import settings
from .auth import verify_password, create_access_token, get_password_hash
from .routes import products, orders, auth

app = FastAPI(title="PRAVEEN KUMAR FAST FOODS API")

# ✅ CORS Configuration - This must be FIRST
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, OPTIONS)
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],  # Expose all headers
)

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != settings.ADMIN_EMAIL or not verify_password(
        form_data.password, get_password_hash(settings.ADMIN_PASSWORD)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": form_data.username, "role": "admin"})
    return {"access_token": access_token, "token_type": "bearer"}

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