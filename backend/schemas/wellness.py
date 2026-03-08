from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime


class DiversificationMetrics(BaseModel):
    asset_class_count: int = Field(..., description="Number of different asset classes")
    asset_type_distribution: Dict[str, float] = Field(..., description="Percentage distribution by type")
    concentration_risk: float = Field(..., ge=0, le=100, description="Risk score from concentration (0-100)")
    herfindahl_index: float = Field(..., ge=0, le=1, description="Market concentration index")
    diversification_score: float = Field(..., ge=0, le=100, description="Overall diversification score (0-100)")


class LiquidityMetrics(BaseModel):
    liquid_assets: float = Field(..., description="Cash and cash equivalents")
    semi_liquid_assets: float = Field(..., description="Assets convertible within 1-7 days")
    illiquid_assets: float = Field(..., description="Long-term investments")
    liquidity_ratio: float = Field(..., ge=0, description="Liquid assets / Total assets")
    emergency_fund_coverage: float = Field(..., description="Months of expenses covered")
    liquidity_score: float = Field(..., ge=0, le=100, description="Liquidity health score (0-100)")


class BehavioralResilienceMetrics(BaseModel):
    portfolio_volatility: float = Field(..., description="30-day volatility measure")
    average_holding_period: float = Field(..., description="Average days holding assets")
    rebalancing_frequency: int = Field(..., description="Number of portfolio adjustments")
    panic_sell_indicators: int = Field(..., description="Count of emotional trading patterns")
    goal_alignment_score: float = Field(..., ge=0, le=100, description="How well portfolio matches goals")
    resilience_score: float = Field(..., ge=0, le=100, description="Behavioral stability score (0-100)")


class RiskMetrics(BaseModel):
    overall_risk_level: str = Field(..., description="conservative, moderate, aggressive")
    volatility_score: float = Field(..., ge=0, le=100)
    debt_to_asset_ratio: float = Field(..., ge=0)
    risk_adjusted_return: float = Field(..., description="Sharpe-like ratio")


class FinancialHealthScore(BaseModel):
    overall_score: float = Field(..., ge=0, le=100, description="Overall financial health (0-100)")
    grade: str = Field(..., description="A+, A, B+, B, C+, C, D, F")
    diversification: DiversificationMetrics
    liquidity: LiquidityMetrics
    behavioral_resilience: BehavioralResilienceMetrics
    risk_metrics: RiskMetrics
    recommendations: List[str] = Field(default_factory=list)
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    calculated_at: datetime = Field(default_factory=datetime.utcnow)


class WellnessScoreResponse(BaseModel):
    success: bool
    financial_health: Optional[FinancialHealthScore] = None
    message: str
    data_quality: Dict[str, bool] = Field(
        default_factory=dict,
        description="Indicates which data sources were available for calculation"
    )


class ScoreHistory(BaseModel):
    date: datetime
    score: float
    grade: str


class WellnessTrend(BaseModel):
    current_score: float
    previous_score: Optional[float] = None
    change_percentage: Optional[float] = None
    trend_direction: str  # improving, declining, stable
    history: List[ScoreHistory] = []
