from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from db.database import Base


class AssetType(str, enum.Enum):
    STOCKS = "stocks"
    BONDS = "bonds"
    CRYPTO = "crypto"
    REAL_ESTATE = "real_estate"
    CASH = "cash"
    MUTUAL_FUNDS = "mutual_funds"
    ETF = "etf"
    OTHER = "other"


class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    asset_name = Column(String, nullable=False)
    asset_type = Column(Enum(AssetType), nullable=False)
    quantity = Column(Float, nullable=False)
    purchase_price = Column(Float, nullable=False)
    current_price = Column(Float)
    currency = Column(String, default="USD")
    notes = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="portfolios")
