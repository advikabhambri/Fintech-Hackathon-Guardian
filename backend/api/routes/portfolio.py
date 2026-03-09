from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from schemas.portfolio import PortfolioCreate, PortfolioUpdate, PortfolioResponse
from models.portfolio import Portfolio, AssetType
from models.user import User
from core.security import get_current_user

router = APIRouter()


@router.post("/", response_model=PortfolioResponse, status_code=status.HTTP_201_CREATED)
async def create_portfolio_item(
    item: PortfolioCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_item = Portfolio(**item.model_dump(), user_id=current_user.id)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


@router.get("/", response_model=List[PortfolioResponse])
async def get_portfolio(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    items = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).all()
    return items


@router.get("/{item_id}", response_model=PortfolioResponse)
async def get_portfolio_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Portfolio).filter(
        Portfolio.id == item_id,
        Portfolio.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio item not found"
        )
    
    return item


@router.put("/{item_id}", response_model=PortfolioResponse)
async def update_portfolio_item(
    item_id: int,
    item_update: PortfolioUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Portfolio).filter(
        Portfolio.id == item_id,
        Portfolio.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio item not found"
        )
    
    for key, value in item_update.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_portfolio_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Portfolio).filter(
        Portfolio.id == item_id,
        Portfolio.user_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio item not found"
        )
    
    db.delete(item)
    db.commit()
    return None


@router.post("/seed-demo", response_model=List[PortfolioResponse])
async def seed_demo_portfolio(
    replace_existing: bool = True,
    profile: str = "balanced",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if replace_existing:
        db.query(Portfolio).filter(Portfolio.user_id == current_user.id).delete()
        db.commit()

    normalized_profile = profile.strip().lower()
    if normalized_profile not in {"conservative", "balanced", "aggressive"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid profile. Use conservative, balanced, or aggressive."
        )

    conservative_assets = [
        {
            "asset_name": "US Treasury 10Y",
            "asset_type": AssetType.BONDS,
            "quantity": 220,
            "purchase_price": 98.40,
            "current_price": 101.15,
            "currency": "USD",
            "notes": "Capital preservation core"
        },
        {
            "asset_name": "Investment Grade Bond ETF",
            "asset_type": AssetType.ETF,
            "quantity": 160,
            "purchase_price": 109.2,
            "current_price": 112.8,
            "currency": "USD",
            "notes": "Stable income"
        },
        {
            "asset_name": "Dividend Aristocrats ETF",
            "asset_type": AssetType.ETF,
            "quantity": 58,
            "purchase_price": 76.5,
            "current_price": 84.1,
            "currency": "USD",
            "notes": "Low volatility equities"
        },
        {
            "asset_name": "US High Yield Savings",
            "asset_type": AssetType.CASH,
            "quantity": 1,
            "purchase_price": 42000,
            "current_price": 42000,
            "currency": "USD",
            "notes": "Emergency + opportunity fund"
        },
        {
            "asset_name": "Gold Trust ETF",
            "asset_type": AssetType.OTHER,
            "quantity": 45,
            "purchase_price": 172.6,
            "current_price": 186.3,
            "currency": "USD",
            "notes": "Inflation hedge"
        }
    ]

    balanced_assets = [
        {
            "asset_name": "Apple Inc.",
            "asset_type": AssetType.STOCKS,
            "quantity": 32,
            "purchase_price": 150.25,
            "current_price": 189.40,
            "currency": "USD",
            "notes": "Core tech holding"
        },
        {
            "asset_name": "NVIDIA",
            "asset_type": AssetType.STOCKS,
            "quantity": 18,
            "purchase_price": 452.10,
            "current_price": 876.50,
            "currency": "USD",
            "notes": "AI growth allocation"
        },
        {
            "asset_name": "Vanguard S&P 500 ETF",
            "asset_type": AssetType.ETF,
            "quantity": 24,
            "purchase_price": 387.70,
            "current_price": 468.20,
            "currency": "USD",
            "notes": "Index diversification"
        },
        {
            "asset_name": "US Treasury 10Y",
            "asset_type": AssetType.BONDS,
            "quantity": 120,
            "purchase_price": 98.40,
            "current_price": 101.15,
            "currency": "USD",
            "notes": "Stability buffer"
        },
        {
            "asset_name": "Bitcoin",
            "asset_type": AssetType.CRYPTO,
            "quantity": 0.75,
            "purchase_price": 41250,
            "current_price": 65800,
            "currency": "USD",
            "notes": "Long-term digital reserve"
        },
        {
            "asset_name": "Ethereum",
            "asset_type": AssetType.CRYPTO,
            "quantity": 4.5,
            "purchase_price": 2150,
            "current_price": 3450,
            "currency": "USD",
            "notes": "Smart-contract exposure"
        },
        {
            "asset_name": "US High Yield Savings",
            "asset_type": AssetType.CASH,
            "quantity": 1,
            "purchase_price": 18000,
            "current_price": 18000,
            "currency": "USD",
            "notes": "Emergency fund"
        },
        {
            "asset_name": "Real Estate REIT Basket",
            "asset_type": AssetType.REAL_ESTATE,
            "quantity": 40,
            "purchase_price": 72.5,
            "current_price": 79.3,
            "currency": "USD",
            "notes": "Income + real asset exposure"
        }
    ]

    aggressive_assets = [
        {
            "asset_name": "NVIDIA",
            "asset_type": AssetType.STOCKS,
            "quantity": 42,
            "purchase_price": 452.10,
            "current_price": 876.50,
            "currency": "USD",
            "notes": "High-growth AI thesis"
        },
        {
            "asset_name": "Tesla",
            "asset_type": AssetType.STOCKS,
            "quantity": 55,
            "purchase_price": 181.8,
            "current_price": 248.9,
            "currency": "USD",
            "notes": "High-beta growth"
        },
        {
            "asset_name": "ARK Innovation ETF",
            "asset_type": AssetType.ETF,
            "quantity": 95,
            "purchase_price": 48.2,
            "current_price": 63.7,
            "currency": "USD",
            "notes": "Disruptive innovation basket"
        },
        {
            "asset_name": "Bitcoin",
            "asset_type": AssetType.CRYPTO,
            "quantity": 1.8,
            "purchase_price": 41250,
            "current_price": 65800,
            "currency": "USD",
            "notes": "Primary crypto allocation"
        },
        {
            "asset_name": "Ethereum",
            "asset_type": AssetType.CRYPTO,
            "quantity": 14,
            "purchase_price": 2150,
            "current_price": 3450,
            "currency": "USD",
            "notes": "Ecosystem growth exposure"
        },
        {
            "asset_name": "Solana",
            "asset_type": AssetType.CRYPTO,
            "quantity": 120,
            "purchase_price": 92.4,
            "current_price": 146.8,
            "currency": "USD",
            "notes": "High-risk satellite position"
        },
        {
            "asset_name": "Cash Reserve",
            "asset_type": AssetType.CASH,
            "quantity": 1,
            "purchase_price": 8500,
            "current_price": 8500,
            "currency": "USD",
            "notes": "Limited liquidity buffer"
        }
    ]

    sample_assets_map = {
        "conservative": conservative_assets,
        "balanced": balanced_assets,
        "aggressive": aggressive_assets,
    }

    sample_assets = sample_assets_map[normalized_profile]

    created_items = []
    for asset in sample_assets:
        item = Portfolio(**asset, user_id=current_user.id)
        db.add(item)
        created_items.append(item)

    db.commit()

    for item in created_items:
        db.refresh(item)

    return created_items
