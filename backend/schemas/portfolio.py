from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from models.portfolio import AssetType


class PortfolioBase(BaseModel):
    asset_name: str
    asset_type: AssetType
    quantity: float
    purchase_price: float
    current_price: Optional[float] = None
    currency: str = "USD"
    notes: Optional[str] = None


class PortfolioCreate(PortfolioBase):
    pass


class PortfolioUpdate(BaseModel):
    asset_name: Optional[str] = None
    asset_type: Optional[AssetType] = None
    quantity: Optional[float] = None
    purchase_price: Optional[float] = None
    current_price: Optional[float] = None
    currency: Optional[str] = None
    notes: Optional[str] = None


class PortfolioResponse(PortfolioBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
