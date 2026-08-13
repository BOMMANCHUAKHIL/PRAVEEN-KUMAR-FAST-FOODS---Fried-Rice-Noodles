from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException

from ..auth import get_current_admin
from ..database import db

router = APIRouter(
    prefix="/api/admin",
    tags=["admin"]
)


# ============================================================
# Helpers
# ============================================================

def serialize_product(product):
    return {
        "id": str(product.get("_id", "")),
        "name": product.get("name", ""),
        "description": product.get("description", ""),
        "category": product.get("category", ""),
        "image": product.get("image", ""),
        "variants": product.get("variants", []),
        "isAvailable": product.get("isAvailable", True),
        "isFeatured": product.get("isFeatured", False),
        "tags": product.get("tags", []),
        "createdAt": product.get(
            "createdAt",
            datetime.utcnow().isoformat()
        ),
        "updatedAt": product.get(
            "updatedAt",
            datetime.utcnow().isoformat()
        ),
    }


def serialize_customer(customer):
    return {
        "id": str(customer.get("_id", "")),
        "phone": customer.get("phone", ""),
        "name": customer.get("name", ""),
        "email": customer.get("email", ""),
        "loyaltyPoints": customer.get("loyalty_points", 0),
        "referralCode": customer.get("referral_code", ""),
        "totalOrders": customer.get("total_orders", 0),
        "totalSpent": customer.get("total_spent", 0),
        "createdAt": customer.get(
            "created_at",
            datetime.utcnow().isoformat()
        ),
    }


def serialize_order(order):
    customer_id = order.get("customer_id")

    customer = next(
        (
            c
            for c in db.customers
            if str(c.get("_id")) == str(customer_id)
        ),
        None,
    )

    return {
        "id": str(order.get("_id", "")),
        "orderNumber": order.get("order_number", ""),
        "customer": {
            "id": str(customer.get("_id", "")) if customer else "",
            "name": customer.get("name", "") if customer else "",
            "phone": customer.get("phone", "") if customer else "",
        },
        "items": order.get("items", []),
        "totalAmount": order.get("total_amount", 0),
        "status": order.get("status", ""),
        "paymentMethod": order.get("payment_method", ""),
        "paymentStatus": order.get("payment_status", ""),
        "createdAt": order.get(
            "created_at",
            datetime.utcnow().isoformat()
        ),
    }


# ============================================================
# Dashboard
# ============================================================

@router.get("/stats")
async def get_dashboard_stats(
    admin: str = Depends(get_current_admin)
):
    total_orders = len(db.orders)
    total_products = len(db.products)
    total_customers = len(db.customers)

    total_revenue = sum(
        float(order.get("total_amount", 0))
        for order in db.orders
        if order.get("payment_status") == "paid"
    )

    pending_statuses = {
        "placed",
        "confirmed",
        "preparing",
        "out_for_delivery",
    }

    pending_orders = sum(
        1
        for order in db.orders
        if order.get("status") in pending_statuses
    )

    today = date.today()

    today_orders = 0

    for order in db.orders:
        created_at = order.get("created_at")

        if not created_at:
            continue

        try:
            created_date = datetime.fromisoformat(
                created_at.replace("Z", "")
            ).date()

            if created_date == today:
                today_orders += 1

        except (ValueError, TypeError):
            continue

    return {
        "totalOrders": total_orders,
        "totalRevenue": total_revenue,
        "totalCustomers": total_customers,
        "totalProducts": total_products,
        "pendingOrders": pending_orders,
        "todayOrders": today_orders,
        "revenueChange": 0,
        "ordersChange": 0,
    }


# ============================================================
# Recent Orders
# ============================================================

@router.get("/orders/recent")
async def get_recent_orders(
    admin: str = Depends(get_current_admin)
):
    orders = sorted(
        db.orders,
        key=lambda order: order.get("created_at", ""),
        reverse=True,
    )

    return [
        serialize_order(order)
        for order in orders[:10]
    ]


# ============================================================
# Orders
# ============================================================

@router.get("/orders")
async def get_orders(
    admin: str = Depends(get_current_admin)
):
    orders = sorted(
        db.orders,
        key=lambda order: order.get("created_at", ""),
        reverse=True,
    )

    return [
        serialize_order(order)
        for order in orders
    ]


@router.get("/orders/{order_id}")
async def get_order(
    order_id: str,
    admin: str = Depends(get_current_admin)
):
    order = await db.find_order(order_id)

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return serialize_order(order)


@router.put("/orders/{order_id}/status")
async def update_order_status(
    order_id: str,
    data: dict,
    admin: str = Depends(get_current_admin)
):
    status_value = data.get("status")

    if not status_value:
        raise HTTPException(
            status_code=400,
            detail="Status is required"
        )

    result = await db.update_order(
        order_id,
        {
            "status": status_value,
            "updated_at": datetime.utcnow().isoformat(),
        },
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return {
        "message": "Order status updated"
    }


@router.put("/orders/{order_id}/payment")
async def update_order_payment(
    order_id: str,
    data: dict,
    admin: str = Depends(get_current_admin)
):
    payment_status = data.get("status")

    if not payment_status:
        raise HTTPException(
            status_code=400,
            detail="Payment status is required"
        )

    result = await db.update_order(
        order_id,
        {
            "payment_status": payment_status,
            "updated_at": datetime.utcnow().isoformat(),
        },
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return {
        "message": "Payment status updated"
    }


# ============================================================
# Customers
# ============================================================

@router.get("/customers")
async def get_customers(
    admin: str = Depends(get_current_admin)
):
    return [
        serialize_customer(customer)
        for customer in db.customers
    ]


@router.get("/customers/{customer_id}")
async def get_customer(
    customer_id: str,
    admin: str = Depends(get_current_admin)
):
    customer = await db.find_customer(customer_id)

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return serialize_customer(customer)


# ============================================================
# Categories
# ============================================================

@router.get("/categories")
async def get_categories(
    admin: str = Depends(get_current_admin)
):
    categories = {}

    for product in db.products:
        category_name = product.get("category", "").strip()

        if not category_name:
            continue

        if category_name not in categories:
            categories[category_name] = {
                "id": category_name.lower().replace(" ", "-"),
                "name": category_name,
                "icon": "",
                "description": "",
                "productCount": 0,
            }

        categories[category_name]["productCount"] += 1

    return list(categories.values())


# ============================================================
# Settings
# ============================================================

@router.get("/settings")
async def get_settings(
    admin: str = Depends(get_current_admin)
):
    return {
        "businessName": "Ahaa emi Ruchi",
        "city": "Bengaluru",
        "deliveryRadius": 10,
        "currency": "INR",
    }


@router.put("/settings")
async def update_settings(
    data: dict,
    admin: str = Depends(get_current_admin)
):
    # Temporary implementation.
    # Settings should eventually be stored in MongoDB.
    return {
        "message": "Settings received",
        "settings": data,
    }


# ============================================================
# Coupons
# ============================================================

@router.get("/coupons")
async def get_coupons(
    admin: str = Depends(get_current_admin)
):
    # Coupon persistence will be added with the database.
    return []


@router.post("/coupons")
async def create_coupon(
    data: dict,
    admin: str = Depends(get_current_admin)
):
    raise HTTPException(
        status_code=501,
        detail="Coupon storage is not implemented yet"
    )


@router.put("/coupons/{coupon_id}")
async def update_coupon(
    coupon_id: str,
    data: dict,
    admin: str = Depends(get_current_admin)
):
    raise HTTPException(
        status_code=501,
        detail="Coupon storage is not implemented yet"
    )


@router.delete("/coupons/{coupon_id}")
async def delete_coupon(
    coupon_id: str,
    admin: str = Depends(get_current_admin)
):
    raise HTTPException(
        status_code=501,
        detail="Coupon storage is not implemented yet"
    )