from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from db.database import get_db
from models.portfolio import Portfolio
from models.goal import Goal
from models.user import User
from core.security import get_current_user

router = APIRouter()


@router.get("/dashboard")
async def get_dashboard_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Portfolio analytics
    portfolio_items = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).all()
    
    total_invested = sum(item.purchase_price * item.quantity for item in portfolio_items)
    total_current_value = sum(
        (item.current_price or item.purchase_price) * item.quantity 
        for item in portfolio_items
    )
    
    profit_loss = total_current_value - total_invested
    profit_loss_percentage = (profit_loss / total_invested * 100) if total_invested > 0 else 0
    
    # Asset distribution
    asset_distribution = {}
    for item in portfolio_items:
        asset_type = item.asset_type.value
        current_value = (item.current_price or item.purchase_price) * item.quantity
        asset_distribution[asset_type] = asset_distribution.get(asset_type, 0) + current_value
    
    # Goals analytics
    goals = db.query(Goal).filter(Goal.user_id == current_user.id).all()
    total_goals = len(goals)
    completed_goals = len([g for g in goals if g.is_completed])
    
    goals_progress = []
    for goal in goals:
        progress_percentage = (goal.current_amount / goal.target_amount * 100) if goal.target_amount > 0 else 0
        goals_progress.append({
            "id": goal.id,
            "title": goal.title,
            "progress": round(progress_percentage, 2),
            "current_amount": goal.current_amount,
            "target_amount": goal.target_amount
        })
    
    return {
        "portfolio": {
            "total_invested": round(total_invested, 2),
            "total_current_value": round(total_current_value, 2),
            "profit_loss": round(profit_loss, 2),
            "profit_loss_percentage": round(profit_loss_percentage, 2),
            "asset_distribution": asset_distribution,
            "total_items": len(portfolio_items)
        },
        "goals": {
            "total_goals": total_goals,
            "completed_goals": completed_goals,
            "in_progress": total_goals - completed_goals,
            "goals_progress": goals_progress
        }
    }


@router.get("/portfolio-summary")
async def get_portfolio_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio_items = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).all()
    
    summary = {
        "by_asset_type": {},
        "total_value": 0,
        "best_performers": [],
        "worst_performers": []
    }
    
    performers = []
    
    for item in portfolio_items:
        current_value = (item.current_price or item.purchase_price) * item.quantity
        invested = item.purchase_price * item.quantity
        gain_loss = current_value - invested
        gain_loss_pct = (gain_loss / invested * 100) if invested > 0 else 0
        
        # Asset type aggregation
        asset_type = item.asset_type.value
        if asset_type not in summary["by_asset_type"]:
            summary["by_asset_type"][asset_type] = {
                "count": 0,
                "total_value": 0,
                "total_invested": 0
            }
        
        summary["by_asset_type"][asset_type]["count"] += 1
        summary["by_asset_type"][asset_type]["total_value"] += current_value
        summary["by_asset_type"][asset_type]["total_invested"] += invested
        summary["total_value"] += current_value
        
        # Track performers
        performers.append({
            "asset_name": item.asset_name,
            "gain_loss": round(gain_loss, 2),
            "gain_loss_pct": round(gain_loss_pct, 2)
        })
    
    # Sort performers
    performers.sort(key=lambda x: x["gain_loss_pct"], reverse=True)
    summary["best_performers"] = performers[:5]
    summary["worst_performers"] = performers[-5:][::-1]
    
    return summary
