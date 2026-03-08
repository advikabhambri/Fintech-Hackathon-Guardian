from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from db.database import get_db
from schemas.wellness import WellnessScoreResponse, FinancialHealthScore
from models.user import User
from models.portfolio import Portfolio
from models.goal import Goal
from core.security import get_current_user
from services.wellness_calculator import WellnessScoreCalculator

router = APIRouter()


@router.get("/", response_model=WellnessScoreResponse)
async def get_wellness_score(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    GET /wellness-score
    
    Calculates a comprehensive Financial Health Score based on:
    
    1. **Diversification (30%)**: 
       - Number of asset classes
       - Distribution across types
       - Concentration risk (HHI)
    
    2. **Liquidity (25%)**:
       - Emergency fund coverage
       - Liquid vs illiquid assets
       - Quick access to capital
    
    3. **Behavioral Resilience (25%)**:
       - Portfolio stability
       - Holding periods
       - Goal alignment
       - Emotional trading patterns
    
    4. **Risk Management (20%)**:
       - Debt-to-asset ratio
       - Volatility exposure
       - Risk-adjusted returns
    
    Returns a score from 0-100 with letter grade (A+ to F) and 
    personalized recommendations for improvement.
    """
    
    # Fetch user's portfolio
    portfolio_items = db.query(Portfolio).filter(
        Portfolio.user_id == current_user.id
    ).all()
    
    # Fetch user's goals
    goals = db.query(Goal).filter(
        Goal.user_id == current_user.id
    ).all()
    
    # Check data availability
    data_quality = {
        "has_portfolio": len(portfolio_items) > 0,
        "has_goals": len(goals) > 0,
        "has_traditional_sync": False,  # Would be true if sync data exists
        "has_crypto_sync": False  # Would be true if sync data exists
    }
    
    # Minimum data requirement check
    if not portfolio_items:
        return WellnessScoreResponse(
            success=False,
            financial_health=None,
            message="Insufficient data to calculate wellness score. Please add portfolio items first.",
            data_quality=data_quality
        )
    
    try:
        # Calculate wellness score
        financial_health = WellnessScoreCalculator.calculate_wellness_score(
            portfolio_items=portfolio_items,
            goals=goals if goals else None,
            traditional_accounts=None,  # Could be populated from sync data
            traditional_assets=None,  # Could be populated from sync data
            crypto_assets=None  # Could be populated from sync data
        )
        
        return WellnessScoreResponse(
            success=True,
            financial_health=financial_health,
            message=f"Financial Health Score: {financial_health.overall_score:.1f}/100 (Grade: {financial_health.grade})",
            data_quality=data_quality
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calculating wellness score: {str(e)}"
        )


@router.get("/detailed", response_model=WellnessScoreResponse)
async def get_detailed_wellness_score(
    include_sync_data: bool = False,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    GET /wellness-score/detailed
    
    Returns detailed wellness score with optional integration of synced data
    from Plaid and crypto exchanges.
    
    Query Parameters:
    - include_sync_data: If true, attempts to include synced traditional and crypto data
    """
    
    # Fetch user's portfolio
    portfolio_items = db.query(Portfolio).filter(
        Portfolio.user_id == current_user.id
    ).all()
    
    # Fetch user's goals
    goals = db.query(Goal).filter(
        Goal.user_id == current_user.id
    ).all()
    
    # In production, if include_sync_data is true, fetch from sync cache/database
    traditional_accounts = None
    traditional_assets = None
    crypto_assets = None
    
    # Data quality tracking
    data_quality = {
        "has_portfolio": len(portfolio_items) > 0,
        "has_goals": len(goals) > 0,
        "has_traditional_sync": traditional_accounts is not None,
        "has_crypto_sync": crypto_assets is not None
    }
    
    if not portfolio_items:
        # Return demo wellness score for users without portfolio data
        from schemas.wellness import (
            DiversificationMetrics, LiquidityMetrics, 
            BehavioralResilienceMetrics, RiskMetrics
        )
        from datetime import datetime
        
        demo_health = FinancialHealthScore(
            overall_score=78.5,
            grade="B+",
            diversification=DiversificationMetrics(
                asset_class_count=6,
                asset_type_distribution={
                    "stocks": 45.0,
                    "bonds": 20.0,
                    "crypto": 15.0,
                    "real_estate": 12.0,
                    "cash": 8.0
                },
                concentration_risk=22.5,
                herfindahl_index=0.23,
                diversification_score=82.0
            ),
            liquidity=LiquidityMetrics(
                liquid_assets=95000.0,
                semi_liquid_assets=425000.0,
                illiquid_assets=342500.0,
                liquidity_ratio=0.28,
                emergency_fund_coverage=8.5,
                liquidity_score=75.0
            ),
            behavioral_resilience=BehavioralResilienceMetrics(
                portfolio_volatility=12.4,
                average_holding_period=285.0,
                rebalancing_frequency=4,
                panic_sell_indicators=1,
                goal_alignment_score=85.0,
                resilience_score=78.0
            ),
            risk_metrics=RiskMetrics(
                overall_risk_level="moderate",
                volatility_score=68.0,
                debt_to_asset_ratio=0.15,
                risk_adjusted_return=1.42
            ),
            recommendations=[
                "Consider increasing emergency fund to cover 12 months of expenses",
                "Your crypto allocation (15%) is within healthy limits for growth-oriented portfolios",
                "Portfolio shows good diversification across 6+ asset classes",
                "Review and rebalance quarterly to maintain target allocations"
            ],
            strengths=[
                "Strong diversification across multiple asset classes",
                "Healthy liquid asset reserves",
                "Low debt-to-asset ratio indicates financial stability"
            ],
            weaknesses=[
                "Emergency fund could be expanded for additional security",
                "Some concentration risk in top holdings"
            ],
            calculated_at=datetime.utcnow()
        )
        
        return WellnessScoreResponse(
            success=True,
            financial_health=demo_health,
            message="Showing demo wellness score. Connect accounts or add portfolio items for personalized analysis.",
            data_quality=data_quality
        )
    
    try:
        # Calculate comprehensive wellness score
        financial_health = WellnessScoreCalculator.calculate_wellness_score(
            portfolio_items=portfolio_items,
            goals=goals if goals else None,
            traditional_accounts=traditional_accounts,
            traditional_assets=traditional_assets,
            crypto_assets=crypto_assets
        )
        
        # Generate detailed message
        message_parts = [
            f"Financial Health Score: {financial_health.overall_score:.1f}/100",
            f"Grade: {financial_health.grade}",
            f"Diversification: {financial_health.diversification.diversification_score:.1f}",
            f"Liquidity: {financial_health.liquidity.liquidity_score:.1f}",
            f"Resilience: {financial_health.behavioral_resilience.resilience_score:.1f}"
        ]
        
        return WellnessScoreResponse(
            success=True,
            financial_health=financial_health,
            message=" | ".join(message_parts),
            data_quality=data_quality
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calculating detailed wellness score: {str(e)}"
        )


@router.get("/metrics/diversification")
async def get_diversification_only(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    GET /wellness-score/metrics/diversification
    
    Returns only diversification metrics for quick analysis.
    """
    portfolio_items = db.query(Portfolio).filter(
        Portfolio.user_id == current_user.id
    ).all()
    
    if not portfolio_items:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No portfolio data found"
        )
    
    diversification = WellnessScoreCalculator.calculate_diversification_score(
        portfolio_items
    )
    
    return diversification


@router.get("/metrics/liquidity")
async def get_liquidity_only(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    GET /wellness-score/metrics/liquidity
    
    Returns only liquidity metrics for quick analysis.
    """
    portfolio_items = db.query(Portfolio).filter(
        Portfolio.user_id == current_user.id
    ).all()
    
    if not portfolio_items:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No portfolio data found"
        )
    
    liquidity = WellnessScoreCalculator.calculate_liquidity_score(
        portfolio_items
    )
    
    return liquidity


@router.get("/recommendations")
async def get_recommendations_only(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    GET /wellness-score/recommendations
    
    Returns only personalized recommendations based on current portfolio.
    """
    portfolio_items = db.query(Portfolio).filter(
        Portfolio.user_id == current_user.id
    ).all()
    
    goals = db.query(Goal).filter(
        Goal.user_id == current_user.id
    ).all()
    
    if not portfolio_items:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No portfolio data found"
        )
    
    financial_health = WellnessScoreCalculator.calculate_wellness_score(
        portfolio_items=portfolio_items,
        goals=goals if goals else None
    )
    
    return {
        "recommendations": financial_health.recommendations,
        "strengths": financial_health.strengths,
        "weaknesses": financial_health.weaknesses
    }
