from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
import random
import string

from ..database import orders_collection
from ..auth import get_current_customer


router = APIRouter(
    prefix="/api/orders",
    tags=["orders"]
)


# ============================================================
# PLACE ORDER
# Supports:
# POST /api/orders
# POST /api/orders/
# ============================================================

@router.post("")
@router.post("/")
async def place_order(
    order_data: dict,
    customer: dict = Depends(get_current_customer)
):
    """Place a new order."""

    try:
        print("========================================")
        print("📦 PLACE ORDER REQUEST")
        print("========================================")

        print(f"👤 Customer: {customer}")

        customer_id = customer.get("_id")
        customer_phone = customer.get("phone")
        customer_name = customer.get("name", "Customer")

        if not customer_phone:
            raise HTTPException(
                status_code=401,
                detail="Customer phone not found"
            )

        # ----------------------------------------------------
        # Generate order number
        # ----------------------------------------------------

        order_number = (
            "ORD-" +
            "".join(
                random.choices(
                    string.digits,
                    k=8
                )
            )
        )

        # ----------------------------------------------------
        # Get order data
        # ----------------------------------------------------

        items = order_data.get("items", [])
        total_amount = order_data.get("total_amount", 0)
        payment_method = order_data.get(
            "payment_method",
            "cod"
        )

        if not items:
            raise HTTPException(
                status_code=400,
                detail="Order must contain at least one item"
            )

        # ----------------------------------------------------
        # Create order
        # ----------------------------------------------------

        now = datetime.utcnow().isoformat()

        new_order = {
            "order_number": order_number,

            "customer_id": customer_id,
            "customer_phone": customer_phone,
            "customer_name": customer_name,

            "items": items,

            "total_amount": total_amount,

            "status": "placed",

            "payment_method": payment_method,

            "created_at": now,
            "updated_at": now
        }

        print("📦 New order:")
        print(new_order)

        # ----------------------------------------------------
        # Save to database
        # ----------------------------------------------------

        result = await orders_collection.insert_order(
            new_order
        )

        print(f"✅ New Order Placed: {order_number}")
        print(
            f"📦 Orders in DB: "
            f"{len(orders_collection.orders)}"
        )

        print("========================================")

        return {
            "message": "Order placed successfully",
            "order_id": str(
                result.get("_id", "")
            ),
            "order_number": order_number
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            f"❌ Error placing order: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=f"Error placing order: {str(e)}"
        )


# ============================================================
# GET CUSTOMER ORDERS
# ============================================================

@router.get("")
async def get_orders(
    customer: dict = Depends(get_current_customer)
):
    """Get all orders for current customer."""

    try:

        customer_id = customer.get("_id")

        all_orders = orders_collection.orders

        customer_orders = [
            order
            for order in all_orders
            if order.get("customer_id") == customer_id
        ]

        customer_orders.sort(
            key=lambda x: x.get(
                "created_at",
                ""
            ),
            reverse=True
        )

        return customer_orders

    except Exception as e:

        print(
            f"❌ Error fetching orders: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to fetch orders"
        )


# ============================================================
# GET ALL ORDERS - ADMIN
# ============================================================

@router.get("/all")
async def get_all_orders():

    try:

        all_orders = orders_collection.orders

        all_orders.sort(
            key=lambda x: x.get(
                "created_at",
                ""
            ),
            reverse=True
        )

        print(
            f"📦 Admin fetched "
            f"{len(all_orders)} orders"
        )

        return all_orders

    except Exception as e:

        print(
            f"❌ Error fetching all orders: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to fetch orders"
        )


# ============================================================
# TRACK ORDER
# IMPORTANT: Keep this BEFORE /{order_id}
# ============================================================

@router.get("/track/{order_number}")
async def track_order(
    order_number: str
):

    try:

        all_orders = orders_collection.orders

        for order in all_orders:

            if order.get(
                "order_number"
            ) == order_number:

                return order

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    except HTTPException:
        raise

    except Exception as e:

        print(
            f"❌ Error tracking order: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        )


# ============================================================
# GET SINGLE ORDER
# ============================================================

@router.get("/{order_id}")
async def get_order(
    order_id: str,
    customer: dict = Depends(get_current_customer)
):

    try:

        print(
            f"🔍 Looking for order: {order_id}"
        )

        order = await orders_collection.find_order(
            order_id
        )

        # If not found by ID,
        # search by order number
        if not order:

            for o in orders_collection.orders:

                if o.get(
                    "order_number"
                ) == order_id:

                    order = o
                    break

        if not order:

            raise HTTPException(
                status_code=404,
                detail=f"Order {order_id} not found"
            )

        # ----------------------------------------------------
        # Security check
        # ----------------------------------------------------

        if (
            order.get("customer_id")
            != customer.get("_id")
        ):

            raise HTTPException(
                status_code=403,
                detail="You don't have permission to view this order"
            )

        return order

    except HTTPException:
        raise

    except Exception as e:

        print(
            f"❌ Error fetching order: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        )


# ============================================================
# UPDATE ORDER STATUS
# ============================================================

@router.put("/{order_id}/status")
async def update_order_status(
    order_id: str,
    status_data: dict
):

    try:

        new_status = status_data.get(
            "status"
        )

        valid_statuses = [
            "placed",
            "preparing",
            "out_for_delivery",
            "delivered",
            "cancelled"
        ]

        if new_status not in valid_statuses:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Invalid status. "
                    "Must be one of: "
                    + ", ".join(valid_statuses)
                )
            )

        print(
            f"🔍 Updating order "
            f"{order_id} "
            f"to {new_status}"
        )

        order = await orders_collection.find_order(
            order_id
        )

        if not order:

            raise HTTPException(
                status_code=404,
                detail=f"Order {order_id} not found"
            )

        result = await orders_collection.update_order(
            order_id,
            {
                "status": new_status,
                "updated_at": datetime.utcnow().isoformat()
            }
        )

        if not result:

            raise HTTPException(
                status_code=404,
                detail="Order not found"
            )

        print(
            f"✅ Order {order_id} "
            f"status updated to {new_status}"
        )

        return {
            "message": (
                f"Order status updated "
                f"to {new_status}"
            )
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            f"❌ Error updating order: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        )