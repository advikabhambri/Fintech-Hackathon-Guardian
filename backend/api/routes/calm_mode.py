from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

from db.database import get_db
from core.security import get_current_user
from models.user import User
from models.calm_mode import CalmModeSettings as CalmModeSettingsModel, TradingAction as TradingActionModel
from schemas.calm_mode import (
    CalmModeSettings,
    CalmModeSettingsCreate,
    CalmModeSettingsUpdate,
    TradingAction,
    TradingActionCreate,
    TradingActionAnalysis,
    PortfolioRiskMetrics,
)

router = APIRouter(prefix="/api/calm-mode", tags=["calm-mode"])


@router.get("/settings", response_model=CalmModeSettings)
def get_calm_mode_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user's calm mode settings"""
    settings = db.query(CalmModeSettingsModel).filter(
        CalmModeSettingsModel.user_id == current_user.id
    ).first()

    if not settings:
        # Create default settings
        settings = CalmModeSettingsModel(user_id=current_user.id)
        db.add(settings)
        db.commit()
        db.refresh(settings)

    return settings


@router.put("/settings", response_model=CalmModeSettings)
def update_calm_mode_settings(
    settings_update: CalmModeSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update user's calm mode settings"""
    settings = db.query(CalmModeSettingsModel).filter(
        CalmModeSettingsModel.user_id == current_user.id
    ).first()

    if not settings:
        # Create if doesn't exist
        settings = CalmModeSettingsModel(user_id=current_user.id)
        db.add(settings)

    # Update fields
    update_data = settings_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(settings, field, value)

    db.commit()
    db.refresh(settings)
    return settings


@router.post("/actions", response_model=TradingAction)
def record_trading_action(
    action: TradingActionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Record a trading action"""
    settings = db.query(CalmModeSettingsModel).filter(
        CalmModeSettingsModel.user_id == current_user.id
    ).first()

    db_action = TradingActionModel(
        user_id=current_user.id,
        settings_id=settings.id if settings else None,
        **action.dict()
    )
    db.add(db_action)
    db.commit()
    db.refresh(db_action)
    return db_action


@router.get("/actions", response_model=List[TradingAction])
def get_trading_actions(
    limit: int = 20,
    hours: int = 24,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get recent trading actions"""
    cutoff_time = datetime.utcnow() - timedelta(hours=hours)
    
    actions = db.query(TradingActionModel).filter(
        TradingActionModel.user_id == current_user.id,
        TradingActionModel.timestamp >= cutoff_time
    ).order_by(TradingActionModel.timestamp.desc()).limit(limit).all()

    return actions


@router.get("/analysis", response_model=TradingActionAnalysis)
def analyze_trading_behavior(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Analyze user's trading behavior for emotional state"""
    settings = db.query(CalmModeSettingsModel).filter(
        CalmModeSettingsModel.user_id == current_user.id
    ).first()

    # Get actions from the last hour
    one_hour_ago = datetime.utcnow() - timedelta(hours=1)
    recent_actions = db.query(TradingActionModel).filter(
        TradingActionModel.user_id == current_user.id,
        TradingActionModel.timestamp >= one_hour_ago
    ).order_by(TradingActionModel.timestamp.desc()).all()

    action_count = len(recent_actions)

    # Calculate emotional trading indicator
    emotional_scores = [a.emotional_score for a in recent_actions if a.emotional_score]
    avg_emotional_score = sum(emotional_scores) / len(emotional_scores) if emotional_scores else 0

    # Determine emotional state
    if action_count > 10 or avg_emotional_score > 70:
        emotional_state = "panicked"
    elif action_count > 5 or avg_emotional_score > 50:
        emotional_state = "emotional"
    elif action_count > 2 or avg_emotional_score > 30:
        emotional_state = "cautious"
    else:
        emotional_state = "calm"

    # Determine if should block
    should_block = False
    warning_message = None

    if settings and settings.is_enabled:
        threshold_minutes = settings.impulse_threshold / 60
        cutoff = datetime.utcnow() - timedelta(seconds=settings.impulse_threshold)
        actions_in_threshold = [a for a in recent_actions if a.timestamp >= cutoff]

        if len(actions_in_threshold) >= 5:
            should_block = True
            warning_message = f"You've made {len(actions_in_threshold)} trades in the last {threshold_minutes:.0f} minutes. Please wait before trading again."
        elif emotional_state in ["panicked", "emotional"]:
            should_block = True
            warning_message = "Your trading pattern suggests emotional decision-making. Take a 15-minute break."

    return TradingActionAnalysis(
        recent_count=action_count,
        emotional_state=emotional_state,
        should_block=should_block,
        warning_message=warning_message,
        actions=recent_actions,
    )


@router.get("/risk-metrics", response_model=PortfolioRiskMetrics)
def get_portfolio_risk_metrics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current portfolio risk metrics"""
    # Import wellness calculator to access the wellness score
    from services.wellness_calculator import WellnessCalculator
    from models.portfolio import Portfolio
    from models.goal import Goal

    portfolios = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).all()
    goals = db.query(Goal).filter(Goal.user_id == current_user.id).all()

    calculator = WellnessCalculator(portfolios, [], goals)
    wellness = calculator.calculate_comprehensive_score()

    # Calculate risk metrics
    volatility_score = wellness.risk_metrics.volatility_score
    diversification_score = wellness.diversification.diversification_score

    overall_risk = round(
        volatility_score * 0.4 +
        (100 - diversification_score) * 0.3 +
        (100 - wellness.liquidity.liquidity_score) * 0.3
    )

    if overall_risk < 30:
        volatility_level = "low"
        recommendation = "Your portfolio risk is well-managed. Continue your balanced approach."
    elif overall_risk < 60:
        volatility_level = "medium"
        recommendation = "Portfolio risk is moderate. Monitor your positions regularly."
    elif overall_risk < 80:
        volatility_level = "high"
        recommendation = "Elevated risk detected. Consider rebalancing to reduce exposure."
    else:
        volatility_level = "extreme"
        recommendation = "Critical risk level! Immediate portfolio review recommended."

    # Calculate emotional trading indicator from recent actions
    one_hour_ago = datetime.utcnow() - timedelta(hours=1)
    recent_actions = db.query(TradingActionModel).filter(
        TradingActionModel.user_id == current_user.id,
        TradingActionModel.timestamp >= one_hour_ago
    ).count()

    emotional_indicator = min(100, recent_actions * 10)

    return PortfolioRiskMetrics(
        overall_risk=overall_risk,
        volatility_level=volatility_level,
        diversification_score=diversification_score,
        emotional_trading_indicator=emotional_indicator,
        recommendation=recommendation,
    )
