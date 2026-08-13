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

    customers = await customers_collection.find_customers()
    referrer = None
    for c in customers:
        if c.get("referral_code") == req.referral_code:
            referrer = c
            break

    if not referrer:
        raise HTTPException(404, "Referral code not found")

    if customer.get("referred_by"):
        raise HTTPException(400, "You already used a referral code")

    await customers_collection.update_customer(customer["_id"], {
        "referred_by": req.referral_code,
        "updated_at": datetime.utcnow().isoformat()
    })

    await customers_collection.update_customer(referrer["_id"], {
        "loyalty_points": referrer.get("loyalty_points", 0) + 50,
        "updated_at": datetime.utcnow().isoformat()
    })

    return {"message": "Referral applied! You get 50 bonus points."}


@router.post("/redeem")
async def redeem_points(req: PointsRedeem, customer: dict = Depends(get_current_customer)):
    if req.points <= 0:
        raise HTTPException(400, "Points must be positive")
    if customer["loyalty_points"] < req.points:
        raise HTTPException(400, "Insufficient points")

    await customers_collection.update_customer(customer["_id"], {
        "loyalty_points": customer["loyalty_points"] - req.points,
        "updated_at": datetime.utcnow().isoformat()
    })

    return {"message": f"Redeemed {req.points} points", "remaining_points": customer["loyalty_points"] - req.points}