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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if replace_existing:
        db.query(Portfolio).filter(Portfolio.user_id == current_user.id).delete()
        db.commit()

    sample_assets = [
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

    created_items = []
    for asset in sample_assets:
        item = Portfolio(**asset, user_id=current_user.id)
        db.add(item)
        created_items.append(item)

    db.commit()

    for item in created_items:
        db.refresh(item)

    return created_items
