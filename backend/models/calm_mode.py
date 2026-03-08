from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from db.database import Base
from datetime import datetime
import enum


class TradingActionType(str, enum.Enum):
    buy = "buy"
    sell = "sell"
    trade = "trade"


class AlertType(str, enum.Enum):
    impulse = "impulse"
    volatility = "volatility"
    risk = "risk"
    timing = "timing"


class AlertSeverity(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class CalmModeSettings(Base):
    """User's calm mode configuration"""
    __tablename__ = "calm_mode_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    is_enabled = Column(Boolean, default=True)
    impulse_threshold = Column(Integer, default=300)  # seconds
    volatility_alert_level = Column(Float, default=60.0)
    risk_tolerance_level = Column(Float, default=70.0)
    show_reality_checks = Column(Boolean, default=True)

    user = relationship("User", back_populates="calm_mode_settings")
    trading_actions = relationship("TradingAction", back_populates="settings")


class TradingAction(Base):
    """Record of user trading actions"""
    __tablename__ = "trading_actions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    settings_id = Column(Integer, ForeignKey("calm_mode_settings.id"), nullable=True)
    action_type = Column(SQLEnum(TradingActionType), nullable=False)
    asset_name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    emotional_score = Column(Float, nullable=True)  # 0-100
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="trading_actions")
    settings = relationship("CalmModeSettings", back_populates="trading_actions")
