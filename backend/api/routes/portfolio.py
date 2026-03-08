from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from schemas.portfolio import PortfolioCreate, PortfolioUpdate, PortfolioResponse
from models.portfolio import Portfolio
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
