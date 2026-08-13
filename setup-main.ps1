# setup-main.ps1
Write-Host "Creating backend main files..." -ForegroundColor Green

# main.py
@"
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from .config import settings
from .database import customers_collection
from .auth import verify_password, create_access_token, get_password_hash
from .routes import products, orders, auth, loyalty

app = FastAPI(title="Ahaa emi Ruchi API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != settings.ADMIN_EMAIL or not verify_password(form_data.password, get_password_hash(settings.ADMIN_PASSWORD)):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": form_data.username, "role": "admin"})
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_admin(token: str = Depends(oauth2_scheme)):
    from jose import JWTError, jwt
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        if role != "admin" or email != settings.ADMIN_EMAIL:
            raise HTTPException(status_code=403, detail="Not admin")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    return email

async def get_current_customer(token: str = Depends(oauth2_scheme)):
    from jose import JWTError, jwt
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        phone = payload.get("sub")
        role = payload.get("role")
        if role != "customer":
            raise HTTPException(status_code=403, detail="Not a customer")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    customer = await customers_collection.find_one({"phone": phone})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    customer["_id"] = str(customer["_id"])
    return customer

app.include_router(products.router)
app.include_router(orders.router)
app.include_router(auth.router)
app.include_router(loyalty.router)

@app.get("/")
async def root():
    return {"message": "Ahaa emi Ruchi API"}
"@ | Out-File -FilePath "backend/app/main.py" -Encoding utf8

# routes/products.py
@"
from fastapi import APIRouter, HTTPException, Depends

from ..database import products_collection
from ..schemas import ProductCreate, ProductUpdate
from ..auth import get_current_admin

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/")
async def get_products(available_only: bool = True):
    query = {"is_available": True} if available_only else {}
    cursor = products_collection.find(query)
    products = await cursor.to_list(length=100)
    for p in products:
        p["_id"] = str(p["_id"])
    return products

@router.get("/{product_id}")
async def get_product(product_id: str):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(400, "Invalid product id")
    product = await products_collection.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(404, "Product not found")
    product["_id"] = str(product["_id"])
    return product

@router.post("/", dependencies=[Depends(get_current_admin)])
async def create_product(product: ProductCreate):
    new_product = product.dict()
    result = await products_collection.insert_one(new_product)
    return {"id": str(result.inserted_id), "message": "Product created"}

@router.put("/{product_id}", dependencies=[Depends(get_current_admin)])
async def update_product(product_id: str, update_data: ProductUpdate):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(400, "Invalid id")
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    if not update_dict:
        raise HTTPException(400, "No fields to update")
    result = await products_collection.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": update_dict}
    )
    if result.modified_count == 0:
        raise HTTPException(404, "Product not found or no changes")
    return {"message": "Product updated"}

@router.delete("/{product_id}", dependencies=[Depends(get_current_admin)])
async def delete_product(product_id: str):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(400, "Invalid id")
    result = await products_collection.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "Product not found")
    return {"message": "Product deleted"}
"@ | Out-File -FilePath "backend/app/routes/products.py" -Encoding utf8

# routes/orders.py
@"
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks

from datetime import datetime
import random, string
from ..database import orders_collection, products_collection
from ..schemas import OrderCreate, OrderStatusUpdate, LiveVideoUpdate
from ..auth import get_current_admin, get_current_customer
from ..utils.whatsapp import send_order_notification
from ..utils.delivery import is_within_radius
from .loyalty import add_loyalty_points

router = APIRouter(prefix="/api/orders", tags=["orders"])

def generate_order_number():
    return "ORD-" + ''.join(random.choices(string.digits, k=8))

@router.post("/")
async def place_order(order_data: OrderCreate, background_tasks: BackgroundTasks, customer: dict = Depends(get_current_customer)):
    if order_data.delivery_address.lat and order_data.delivery_address.lng:
        if not is_within_radius(order_data.delivery_address.lat, order_data.delivery_address.lng, 10):
            raise HTTPException(400, "Delivery outside 10km radius")
    items = []
    total = 0.0
    for item in order_data.items:
        product = await products_collection.find_one({"_id": ObjectId(item.product_id)})
        if not product:
            raise HTTPException(404, f"Product {item.product_id} not found")
        variant = next((v for v in product["variants"] if v["weight"] == item.variant), None)
        if not variant:
            raise HTTPException(400, f"Variant {item.variant} not available")
        unit_price = variant["price"]
        item_total = unit_price * item.quantity
        items.append({
            "product_id": item.product_id,
            "product_name": product["name"],
            "variant": item.variant,
            "quantity": item.quantity,
            "unit_price": unit_price,
            "total": item_total
        })
        total += item_total

    order_number = generate_order_number()
    new_order = {
        "order_number": order_number,
        "customer_id": customer["_id"],
        "items": items,
        "total_amount": total,
        "delivery_address": order_data.delivery_address.dict(),
        "payment_method": order_data.payment_method,
        "payment_status": "pending" if order_data.payment_method == "online" else "pending",
        "status": "placed",
        "live_video_requested": order_data.live_video_requested,
        "live_video_url": None,
        "whatsapp_sent": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    result = await orders_collection.insert_one(new_order)
    order_id = str(result.inserted_id)

    await add_loyalty_points(customer["_id"], total)

    background_tasks.add_task(
        send_order_notification,
        order_number,
        items,
        total,
        order_data.delivery_address.dict(),
        order_data.payment_method,
        order_data.live_video_requested
    )
    return {"order_id": order_id, "order_number": order_number, "total": total}

@router.get("/{order_id}")
async def get_order(order_id: str):
    if not ObjectId.is_valid(order_id):
        raise HTTPException(400, "Invalid order id")
    order = await orders_collection.find_one({"_id": ObjectId(order_id)})
    if not order:
        raise HTTPException(404, "Order not found")
    order["_id"] = str(order["_id"])
    return order

@router.put("/{order_id}/status", dependencies=[Depends(get_current_admin)])
async def update_order_status(order_id: str, status_update: OrderStatusUpdate):
    if not ObjectId.is_valid(order_id):
        raise HTTPException(400, "Invalid id")
    result = await orders_collection.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": status_update.status, "updated_at": datetime.utcnow()}}
    )
    if result.modified_count == 0:
        raise HTTPException(404, "Order not found")
    return {"message": "Status updated"}

@router.put("/{order_id}/live-video", dependencies=[Depends(get_current_admin)])
async def add_live_video(order_id: str, video: LiveVideoUpdate):
    if not ObjectId.is_valid(order_id):
        raise HTTPException(400, "Invalid id")
    result = await orders_collection.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"live_video_url": video.live_video_url, "updated_at": datetime.utcnow()}}
    )
    if result.modified_count == 0:
        raise HTTPException(404, "Order not found")
    return {"message": "Live video link added"}
"@ | Out-File -FilePath "backend/app/routes/orders.py" -Encoding utf8

# routes/auth.py
@"
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

import random, string
from datetime import datetime
from ..database import customers_collection
from ..utils.otp import generate_otp, send_otp_sms, verify_otp
from ..auth import create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

class PhoneRequest(BaseModel):
    phone: str

class OTPVerifyRequest(BaseModel):
    phone: str
    otp: str

@router.post("/send-otp")
async def send_otp(req: PhoneRequest):
    if len(req.phone) < 10:
        raise HTTPException(400, "Invalid phone number")
    otp = generate_otp(req.phone)
    send_otp_sms(req.phone, otp)
    return {"message": "OTP sent", "otp": otp}

@router.post("/verify-otp")
async def verify_otp_endpoint(req: OTPVerifyRequest):
    if not verify_otp(req.phone, req.otp):
        raise HTTPException(400, "Invalid or expired OTP")
    customer = await customers_collection.find_one({"phone": req.phone})
    if not customer:
        ref_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        new_customer = {
            "phone": req.phone,
            "loyalty_points": 0,
            "referral_code": ref_code,
            "referred_by": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = await customers_collection.insert_one(new_customer)
        customer = await customers_collection.find_one({"_id": result.inserted_id})
    token = create_access_token(data={"sub": req.phone, "role": "customer"})
    return {
        "access_token": token,
        "token_type": "bearer",
        "customer_id": str(customer["_id"]),
        "phone": customer["phone"],
        "loyalty_points": customer.get("loyalty_points", 0),
        "referral_code": customer.get("referral_code")
    }
"@ | Out-File -FilePath "backend/app/routes/auth.py" -Encoding utf8

# routes/loyalty.py
@"
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from datetime import datetime
from ..database import customers_collection
from ..auth import get_current_customer

router = APIRouter(prefix="/api/loyalty", tags=["loyalty"])

class ReferralApply(BaseModel):
    referral_code: str

class PointsRedeem(BaseModel):
    points: int

@router.get("/me")
async def get_loyalty_info(customer: dict = Depends(get_current_customer)):
    return {
        "points": customer.get("loyalty_points", 0),
        "referral_code": customer.get("referral_code"),
        "referred_by": customer.get("referred_by")
    }

@router.post("/apply-referral")
async def apply_referral(req: ReferralApply, customer: dict = Depends(get_current_customer)):
    if customer["referral_code"] == req.referral_code:
        raise HTTPException(400, "Cannot use your own referral code")
    referrer = await customers_collection.find_one({"referral_code": req.referral_code})
    if not referrer:
        raise HTTPException(404, "Referral code not found")
    if customer.get("referred_by"):
        raise HTTPException(400, "You already used a referral code")
    await customers_collection.update_one(
        {"_id": customer["_id"]},
        {"$set": {"referred_by": req.referral_code, "updated_at": datetime.utcnow()}}
    )
    await customers_collection.update_one(
        {"_id": referrer["_id"]},
        {"$inc": {"loyalty_points": 50}}
    )
    return {"message": "Referral applied! You get 50 bonus points."}

@router.post("/redeem")
async def redeem_points(req: PointsRedeem, customer: dict = Depends(get_current_customer)):
    if req.points <= 0:
        raise HTTPException(400, "Points must be positive")
    if customer["loyalty_points"] < req.points:
        raise HTTPException(400, "Insufficient points")
    await customers_collection.update_one(
        {"_id": customer["_id"]},
        {"$inc": {"loyalty_points": -req.points}, "$set": {"updated_at": datetime.utcnow()}}
    )
    return {"message": f"Redeemed {req.points} points", "remaining_points": customer["loyalty_points"] - req.points}

async def add_loyalty_points(customer_id: str, order_total: float):
    points_earned = int(order_total * 0.1)
    await customers_collection.update_one(
        {"_id": ObjectId(customer_id)},
        {"$inc": {"loyalty_points": points_earned}}
    )
"@ | Out-File -FilePath "backend/app/routes/loyalty.py" -Encoding utf8

# utils files
@"
import os
from twilio.rest import Client
from ..config import settings

def send_order_notification(order_number, items, total, address, payment_method, live_video_requested):
    if not settings.TWILIO_ACCOUNT_SID:
        print(f"[WHATSAPP] New order {order_number}: total ₹{total}")
        return
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    msg = f"🆕 New Order #{order_number}\\n"
    msg += "Items:\\n"
    for it in items:
        msg += f"  - {it['product_name']} ({it['variant']}) x{it['quantity']} = ₹{it['total']}\\n"
    msg += f"Total: ₹{total}\\n"
    addr = address
    msg += f"Address: {addr['address_line']}, {addr['landmark'] or ''}, {addr['city']}, {addr['pincode']}\\n"
    msg += f"Payment: {payment_method}\\n"
    msg += f"Live Video Requested: {'✅' if live_video_requested else '❌'}\\n"
    for number in settings.owner_whatsapp_list:
        try:
            client.messages.create(
                body=msg,
                from_=settings.TWILIO_WHATSAPP_FROM,
                to=f"whatsapp:{number}"
            )
        except Exception as e:
            print(f"Failed to send to {number}: {e}")
"@ | Out-File -FilePath "backend/app/utils/whatsapp.py" -Encoding utf8

@"
import math

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def is_within_radius(lat, lng, radius_km):
    kr_puram_lat = 13.0089
    kr_puram_lng = 77.7038
    dist = haversine(kr_puram_lat, kr_puram_lng, lat, lng)
    return dist <= radius_km
"@ | Out-File -FilePath "backend/app/utils/delivery.py" -Encoding utf8

@"
import random
from datetime import datetime, timedelta

otp_store = {}

def generate_otp(phone: str) -> str:
    otp = str(random.randint(1000, 9999))
    expires = datetime.utcnow() + timedelta(minutes=5)
    otp_store[phone] = {"otp": otp, "expires": expires.timestamp()}
    return otp

def verify_otp(phone: str, otp: str) -> bool:
    record = otp_store.get(phone)
    if not record:
        return False
    if record["otp"] != otp:
        return False
    if datetime.utcnow().timestamp() > record["expires"]:
        return False
    del otp_store[phone]
    return True

def send_otp_sms(phone: str, otp: str):
    print(f"[OTP] {phone} -> {otp}")
"@ | Out-File -FilePath "backend/app/utils/otp.py" -Encoding utf8

Write-Host "Main backend files created!" -ForegroundColor Green