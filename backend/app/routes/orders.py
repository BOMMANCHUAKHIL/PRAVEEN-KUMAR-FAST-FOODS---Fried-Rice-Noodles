from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
import random, string
from ..database import orders_collection
from ..auth import get_current_customer

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.post("/")
async def place_order(order_data: dict, customer: dict = Depends(get_current_customer)):
    """Place a new order"""
    try:
        print(f"📦 Received order from customer: {customer.get('phone')}")
        print(f"📦 Customer data: {customer}")

        order_number = "ORD-" + ''.join(random.choices(string.digits, k=8))

        new_order = {
            "order_number": order_number,
            "customer_id": customer.get("_id"),
            "customer_phone": customer.get("phone"),
            "customer_name": customer.get("name", "Customer"),
            "items": order_data.get("items", []),
            "total_amount": order_data.get("total_amount", 0),
            "status": "placed",
            "payment_method": order_data.get("payment_method", "cod"),
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }

        result = await orders_collection.insert_order(new_order)

        print(f"✅ New Order Placed: {order_number}")
        print(f"📦 Orders in DB: {len(orders_collection.orders)}")

        return {
            "message": "Order placed successfully",
            "order_id": str(result.get("_id", "")),
            "order_number": order_number
        }
    except Exception as e:
        print(f"❌ Error placing order: {e}")
        raise HTTPException(500, f"Error: {str(e)}")

@router.get("")
async def get_orders(customer: dict = Depends(get_current_customer)):
    """Get all orders for the current customer"""
    try:
        customer_id = customer.get("_id")
        all_orders = orders_collection.orders
        customer_orders = [o for o in all_orders if o.get("customer_id") == customer_id]
        customer_orders.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return customer_orders
    except Exception as e:
        print(f"❌ Error fetching orders: {e}")
        return []


@router.get("/all")
async def get_all_orders():
    """Get all orders (Admin only)"""
    try:
        all_orders = orders_collection.orders
        all_orders.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        print(f"📦 Admin fetched {len(all_orders)} orders")
        return all_orders
    except Exception as e:
        print(f"❌ Error fetching all orders: {e}")
        return []


@router.get("/{order_id}")
async def get_order(order_id: str, customer: dict = Depends(get_current_customer)):
    """Get a specific order by ID or order number"""
    try:
        print(f"🔍 Looking for order with ID/number: {order_id}")

        # First try to find by _id
        order = await orders_collection.find_order(order_id)

        # If not found, try by order_number
        if not order:
            all_orders = orders_collection.orders
            for o in all_orders:
                if o.get("order_number") == order_id:
                    order = o
                    break

        if not order:
            print(f"❌ Order {order_id} not found")
            raise HTTPException(404, f"Order {order_id} not found")

        # Check permission
        if order.get("customer_id") != customer.get("_id"):
            raise HTTPException(403, "You don't have permission to view this order")

        return order
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error fetching order: {e}")
        raise HTTPException(500, f"Error: {str(e)}")
@router.put("/{order_id}/status")
async def update_order_status(order_id: str, status_data: dict):
    """Update order status (Admin only)"""
    try:
        new_status = status_data.get("status")
        valid_statuses = ["placed", "preparing", "out_for_delivery", "delivered", "cancelled"]

        if new_status not in valid_statuses:
            raise HTTPException(400, f"Invalid status. Must be one of: {', '.join(valid_statuses)}")

        print(f"🔍 Updating order {order_id} to status: {new_status}")

        # ✅ Check if order exists first
        order = await orders_collection.find_order(order_id)
        if not order:
            print(f"❌ Order {order_id} not found")
            raise HTTPException(404, f"Order {order_id} not found")

        result = await orders_collection.update_order(order_id, {
            "status": new_status,
            "updated_at": datetime.utcnow().isoformat()
        })

        if not result:
            raise HTTPException(404, "Order not found")

        print(f"✅ Order {order_id} status updated to: {new_status}")
        return {"message": f"Order status updated to {new_status}"}
    except Exception as e:
        print(f"❌ Error updating order: {e}")
        raise HTTPException(500, f"Error: {str(e)}")

@router.get("/track/{order_number}")
async def track_order(order_number: str):
    """Track an order by order number"""
    try:
        all_orders = orders_collection.orders
        for order in all_orders:
            if order.get("order_number") == order_number:
                return order
        raise HTTPException(404, "Order not found")
    except Exception as e:
        print(f"❌ Error tracking order: {e}")
        raise HTTPException(500, f"Error: {str(e)}")