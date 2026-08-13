import os
from twilio.rest import Client
from ..config import settings

def send_order_notification(order_number, items, total, address, payment_method, live_video_requested):
    if not settings.TWILIO_ACCOUNT_SID:
        print(f"[WHATSAPP] New order {order_number}: total â‚¹{total}")
        return
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    msg = f"ðŸ†• New Order #{order_number}\\n"
    msg += "Items:\\n"
    for it in items:
        msg += f"  - {it['product_name']} ({it['variant']}) x{it['quantity']} = â‚¹{it['total']}\\n"
    msg += f"Total: â‚¹{total}\\n"
    addr = address
    msg += f"Address: {addr['address_line']}, {addr['landmark'] or ''}, {addr['city']}, {addr['pincode']}\\n"
    msg += f"Payment: {payment_method}\\n"
    msg += f"Live Video Requested: {'âœ…' if live_video_requested else 'âŒ'}\\n"
    for number in settings.owner_whatsapp_list:
        try:
            client.messages.create(
                body=msg,
                from_=settings.TWILIO_WHATSAPP_FROM,
                to=f"whatsapp:{number}"
            )
        except Exception as e:
            print(f"Failed to send to {number}: {e}")
