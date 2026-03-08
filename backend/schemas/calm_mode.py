from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Literal


class CalmModeSettingsBase(BaseModel):
    is_enabled: bool = True
    impulse_threshold: int = Field(default=300, ge=60, le=1800)
    volatility_alert_level: float = Field(default=60.0, ge=0, le=100)
    risk_tolerance_level: float = Field(default=70.0, ge=0, le=100)
    show_reality_checks: bool = True


class CalmModeSettingsCreate(CalmModeSettingsBase):
    pass


class CalmModeSettingsUpdate(BaseModel):
    is_enabled: Optional[bool] = None
    impulse_threshold: Optional[int] = Field(None, ge=60, le=1800)
    volatility_alert_level: Optional[float] = Field(None, ge=0, le=100)
    risk_tolerance_level: Optional[float] = Field(None, ge=0, le=100)
    show_reality_checks: Optional[bool] = None


class CalmModeSettings(CalmModeSettingsBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


class TradingActionBase(BaseModel):
    action_type: Literal["buy", "sell", "trade"]
    asset_name: str
    amount: float
    emotional_score: Optional[float] = None


class TradingActionCreate(TradingActionBase):
    pass


class TradingAction(TradingActionBase):
    id: int
    user_id: int
    timestamp: datetime

    class Config:
        from_attributes = True


class TradingActionAnalysis(BaseModel):
    recent_count: int
    emotional_state: Literal["calm", "cautious", "emotional", "panicked"]
    should_block: bool
    warning_message: Optional[str] = None
    actions: list[TradingAction]


class PortfolioRiskMetrics(BaseModel):
    overall_risk: float
    volatility_level: Literal["low", "medium", "high", "extreme"]
    diversification_score: float
    emotional_trading_indicator: float
    recommendation: str
