"""
Wellness Score Calculation Service
Calculates comprehensive financial health metrics
"""

import math
from typing import List, Dict, Tuple
from datetime import datetime, timedelta
from schemas.wellness import (
    FinancialHealthScore,
    DiversificationMetrics,
    LiquidityMetrics,
    BehavioralResilienceMetrics,
    RiskMetrics
)
from schemas.sync import TraditionalAccount, TraditionalAsset, CryptoAsset
from models.portfolio import Portfolio
from models.goal import Goal


class WellnessScoreCalculator:
    """Calculates financial wellness scores based on multiple metrics"""
    
    # Weight distribution for overall score
    WEIGHTS = {
        "diversification": 0.30,
        "liquidity": 0.25,
        "behavioral_resilience": 0.25,
        "risk_management": 0.20
    }
    
    @staticmethod
    def calculate_diversification_score(
        portfolio_items: List[Portfolio],
        traditional_assets: List[TraditionalAsset] = None,
        crypto_assets: List[CryptoAsset] = None
    ) -> DiversificationMetrics:
        """
        Calculate diversification metrics
        - Asset class distribution
        - Concentration risk
        - Herfindahl-Hirschman Index
        """
        asset_distribution = {}
        total_value = 0.0
        
        # Aggregate portfolio by asset type
        for item in portfolio_items:
            asset_type = item.asset_type.value
            value = (item.current_price or item.purchase_price) * item.quantity
            asset_distribution[asset_type] = asset_distribution.get(asset_type, 0) + value
            total_value += value
        
        # Add traditional assets
        if traditional_assets:
            for asset in traditional_assets:
                asset_distribution["stocks"] = asset_distribution.get("stocks", 0) + asset.value
                total_value += asset.value
        
        # Add crypto assets
        if crypto_assets:
            crypto_total = sum(asset.value_usd for asset in crypto_assets)
            asset_distribution["crypto"] = asset_distribution.get("crypto", 0) + crypto_total
            total_value += crypto_total
        
        if total_value == 0:
            return DiversificationMetrics(
                asset_class_count=0,
                asset_type_distribution={},
                concentration_risk=100.0,
                herfindahl_index=1.0,
                diversification_score=0.0
            )
        
        # Calculate percentage distribution
        percentage_distribution = {
            k: round((v / total_value) * 100, 2) 
            for k, v in asset_distribution.items()
        }
        
        # Calculate Herfindahl-Hirschman Index (0 to 1)
        # Lower is better (more diversified)
        hhi = sum((v / total_value) ** 2 for v in asset_distribution.values())
        
        # Calculate concentration risk (0-100)
        # Higher concentration = higher risk
        max_concentration = max(percentage_distribution.values()) if percentage_distribution else 100
        concentration_risk = max_concentration
        
        # Calculate overall diversification score (0-100)
        # Higher is better
        asset_count = len(asset_distribution)
        
        # Score components
        count_score = min(asset_count / 7 * 100, 100)  # Optimal is 7+ asset classes
        hhi_score = (1 - hhi) * 100  # Convert HHI to score
        concentration_score = 100 - concentration_risk
        
        diversification_score = (count_score * 0.4 + hhi_score * 0.3 + concentration_score * 0.3)
        
        return DiversificationMetrics(
            asset_class_count=asset_count,
            asset_type_distribution=percentage_distribution,
            concentration_risk=round(concentration_risk, 2),
            herfindahl_index=round(hhi, 4),
            diversification_score=round(diversification_score, 2)
        )
    
    @staticmethod
    def calculate_liquidity_score(
        portfolio_items: List[Portfolio],
        traditional_accounts: List[TraditionalAccount] = None,
        monthly_expenses: float = 5000.0  # Default assumption
    ) -> LiquidityMetrics:
        """
        Calculate liquidity metrics
        - Liquid vs illiquid assets
        - Emergency fund coverage
        """
        liquid_assets = 0.0
        semi_liquid_assets = 0.0
        illiquid_assets = 0.0
        
        # Categorize portfolio items
        liquid_types = ["cash"]
        semi_liquid_types = ["stocks", "etf", "mutual_funds", "crypto"]
        illiquid_types = ["real_estate", "bonds", "other"]
        
        for item in portfolio_items:
            value = (item.current_price or item.purchase_price) * item.quantity
            asset_type = item.asset_type.value
            
            if asset_type in liquid_types:
                liquid_assets += value
            elif asset_type in semi_liquid_types:
                semi_liquid_assets += value
            else:
                illiquid_assets += value
        
        # Add traditional accounts
        if traditional_accounts:
            for account in traditional_accounts:
                if account.account_type in ["checking", "savings"]:
                    liquid_assets += max(account.balance, 0)
                elif account.account_type == "investment":
                    semi_liquid_assets += max(account.balance, 0)
        
        total_assets = liquid_assets + semi_liquid_assets + illiquid_assets
        
        if total_assets == 0:
            return LiquidityMetrics(
                liquid_assets=0.0,
                semi_liquid_assets=0.0,
                illiquid_assets=0.0,
                liquidity_ratio=0.0,
                emergency_fund_coverage=0.0,
                liquidity_score=0.0
            )
        
        liquidity_ratio = liquid_assets / total_assets
        emergency_fund_coverage = liquid_assets / monthly_expenses
        
        # Calculate liquidity score (0-100)
        # Optimal emergency fund: 6 months of expenses
        emergency_score = min(emergency_fund_coverage / 6 * 100, 100)
        
        # Optimal liquidity ratio: 10-20% of total assets
        ratio_score = 0
        if 0.10 <= liquidity_ratio <= 0.20:
            ratio_score = 100
        elif liquidity_ratio < 0.10:
            ratio_score = liquidity_ratio / 0.10 * 100
        else:
            ratio_score = max(100 - (liquidity_ratio - 0.20) * 200, 0)
        
        liquidity_score = (emergency_score * 0.6 + ratio_score * 0.4)
        
        return LiquidityMetrics(
            liquid_assets=round(liquid_assets, 2),
            semi_liquid_assets=round(semi_liquid_assets, 2),
            illiquid_assets=round(illiquid_assets, 2),
            liquidity_ratio=round(liquidity_ratio, 4),
            emergency_fund_coverage=round(emergency_fund_coverage, 2),
            liquidity_score=round(liquidity_score, 2)
        )
    
    @staticmethod
    def calculate_behavioral_resilience_score(
        portfolio_items: List[Portfolio],
        goals: List[Goal] = None
    ) -> BehavioralResilienceMetrics:
        """
        Calculate behavioral resilience metrics
        - Portfolio stability
        - Goal alignment
        - Trading patterns
        """
        if not portfolio_items:
            return BehavioralResilienceMetrics(
                portfolio_volatility=0.0,
                average_holding_period=0.0,
                rebalancing_frequency=0,
                panic_sell_indicators=0,
                goal_alignment_score=0.0,
                resilience_score=0.0
            )
        
        # Calculate average holding period
        now = datetime.utcnow()
        holding_periods = [
            (now - item.created_at).days 
            for item in portfolio_items
        ]
        avg_holding_period = sum(holding_periods) / len(holding_periods) if holding_periods else 0
        
        # Simulate portfolio volatility (in production, calculate from price history)
        # Lower volatility = better stability
        portfolio_volatility = sum(
            abs((item.current_price or item.purchase_price) - item.purchase_price) / 
            item.purchase_price * 100
            for item in portfolio_items
        ) / len(portfolio_items) if portfolio_items else 0
        
        # Estimate rebalancing frequency (mock)
        rebalancing_frequency = max(int(len(portfolio_items) / 5), 0)
        
        # Panic sell indicators (mock - in production, analyze transaction patterns)
        panic_sell_indicators = 0
        
        # Calculate goal alignment score
        goal_alignment_score = 0.0
        if goals:
            total_goal_amount = sum(g.target_amount for g in goals)
            total_portfolio_value = sum(
                (item.current_price or item.purchase_price) * item.quantity
                for item in portfolio_items
            )
            
            if total_goal_amount > 0:
                goal_alignment_score = min(
                    (total_portfolio_value / total_goal_amount) * 100, 
                    100
                )
        else:
            goal_alignment_score = 50  # Default if no goals set
        
        # Calculate overall resilience score
        # Longer holding period = better (up to 365 days)
        holding_score = min(avg_holding_period / 365 * 100, 100)
        
        # Lower volatility = better (penalize > 20% volatility)
        volatility_score = max(100 - (portfolio_volatility * 2), 0)
        
        # Fewer panic indicators = better
        panic_score = max(100 - (panic_sell_indicators * 20), 0)
        
        resilience_score = (
            holding_score * 0.25 + 
            volatility_score * 0.25 + 
            goal_alignment_score * 0.30 + 
            panic_score * 0.20
        )
        
        return BehavioralResilienceMetrics(
            portfolio_volatility=round(portfolio_volatility, 2),
            average_holding_period=round(avg_holding_period, 2),
            rebalancing_frequency=rebalancing_frequency,
            panic_sell_indicators=panic_sell_indicators,
            goal_alignment_score=round(goal_alignment_score, 2),
            resilience_score=round(resilience_score, 2)
        )
    
    @staticmethod
    def calculate_risk_metrics(
        portfolio_items: List[Portfolio],
        traditional_accounts: List[TraditionalAccount] = None
    ) -> RiskMetrics:
        """Calculate risk-related metrics"""
        
        total_assets = sum(
            (item.current_price or item.purchase_price) * item.quantity
            for item in portfolio_items
        )
        
        if traditional_accounts:
            total_assets += sum(
                max(acc.balance, 0) 
                for acc in traditional_accounts
            )
        
        # Calculate debt from credit cards
        debt = 0.0
        if traditional_accounts:
            debt = sum(
                abs(acc.balance) 
                for acc in traditional_accounts 
                if acc.account_type == "credit_card" and acc.balance < 0
            )
        
        debt_to_asset_ratio = debt / total_assets if total_assets > 0 else 0
        
        # Simulate volatility score (in production, use historical data)
        volatility_score = 50.0  # Moderate default
        
        # Determine risk level
        if debt_to_asset_ratio > 0.5:
            risk_level = "aggressive"
        elif debt_to_asset_ratio > 0.2:
            risk_level = "moderate"
        else:
            risk_level = "conservative"
        
        # Mock risk-adjusted return (Sharpe ratio equivalent)
        risk_adjusted_return = 1.5  # Mock positive return
        
        return RiskMetrics(
            overall_risk_level=risk_level,
            volatility_score=round(volatility_score, 2),
            debt_to_asset_ratio=round(debt_to_asset_ratio, 4),
            risk_adjusted_return=round(risk_adjusted_return, 2)
        )
    
    @staticmethod
    def calculate_grade(score: float) -> str:
        """Convert numerical score to letter grade"""
        if score >= 97:
            return "A+"
        elif score >= 93:
            return "A"
        elif score >= 90:
            return "A-"
        elif score >= 87:
            return "B+"
        elif score >= 83:
            return "B"
        elif score >= 80:
            return "B-"
        elif score >= 77:
            return "C+"
        elif score >= 73:
            return "C"
        elif score >= 70:
            return "C-"
        elif score >= 60:
            return "D"
        else:
            return "F"
    
    @staticmethod
    def generate_recommendations(
        diversification: DiversificationMetrics,
        liquidity: LiquidityMetrics,
        resilience: BehavioralResilienceMetrics,
        risk: RiskMetrics
    ) -> Tuple[List[str], List[str], List[str]]:
        """Generate personalized recommendations, strengths, and weaknesses"""
        
        recommendations = []
        strengths = []
        weaknesses = []
        
        # Diversification analysis
        if diversification.diversification_score >= 75:
            strengths.append("Well-diversified portfolio across multiple asset classes")
        elif diversification.diversification_score < 50:
            weaknesses.append("Portfolio lacks diversification")
            recommendations.append(
                f"Increase diversification by adding more asset classes "
                f"(currently {diversification.asset_class_count})"
            )
        
        if diversification.concentration_risk > 50:
            weaknesses.append("High concentration risk in single asset class")
            recommendations.append("Reduce concentration by rebalancing portfolio")
        
        # Liquidity analysis
        if liquidity.liquidity_score >= 75:
            strengths.append("Strong liquidity position with adequate emergency fund")
        elif liquidity.emergency_fund_coverage < 3:
            weaknesses.append("Insufficient emergency fund coverage")
            recommendations.append(
                f"Build emergency fund to cover at least 6 months of expenses "
                f"(currently {liquidity.emergency_fund_coverage:.1f} months)"
            )
        
        # Behavioral resilience analysis
        if resilience.resilience_score >= 75:
            strengths.append("Disciplined investment approach with strong goal alignment")
        
        if resilience.goal_alignment_score < 60:
            weaknesses.append("Portfolio not well-aligned with financial goals")
            recommendations.append("Review and adjust portfolio to better match your goals")
        
        if resilience.average_holding_period < 90:
            weaknesses.append("High portfolio turnover may indicate emotional trading")
            recommendations.append("Consider a longer-term investment strategy")
        
        # Risk analysis
        if risk.debt_to_asset_ratio > 0.3:
            weaknesses.append("High debt-to-asset ratio")
            recommendations.append("Focus on debt reduction to improve financial health")
        elif risk.debt_to_asset_ratio < 0.1:
            strengths.append("Low debt burden with healthy debt-to-asset ratio")
        
        # General recommendations
        if not recommendations:
            recommendations.append("Maintain your current financial strategy and continue monitoring")
        
        return recommendations, strengths, weaknesses
    
    @staticmethod
    def calculate_wellness_score(
        portfolio_items: List[Portfolio],
        goals: List[Goal] = None,
        traditional_accounts: List[TraditionalAccount] = None,
        traditional_assets: List[TraditionalAsset] = None,
        crypto_assets: List[CryptoAsset] = None
    ) -> FinancialHealthScore:
        """
        Calculate comprehensive financial wellness score
        """
        # Calculate individual metrics
        diversification = WellnessScoreCalculator.calculate_diversification_score(
            portfolio_items, traditional_assets, crypto_assets
        )
        
        liquidity = WellnessScoreCalculator.calculate_liquidity_score(
            portfolio_items, traditional_accounts
        )
        
        resilience = WellnessScoreCalculator.calculate_behavioral_resilience_score(
            portfolio_items, goals
        )
        
        risk_metrics = WellnessScoreCalculator.calculate_risk_metrics(
            portfolio_items, traditional_accounts
        )
        
        # Calculate weighted overall score
        overall_score = (
            diversification.diversification_score * WellnessScoreCalculator.WEIGHTS["diversification"] +
            liquidity.liquidity_score * WellnessScoreCalculator.WEIGHTS["liquidity"] +
            resilience.resilience_score * WellnessScoreCalculator.WEIGHTS["behavioral_resilience"] +
            (100 - risk_metrics.volatility_score) * WellnessScoreCalculator.WEIGHTS["risk_management"]
        )
        
        grade = WellnessScoreCalculator.calculate_grade(overall_score)
        
        recommendations, strengths, weaknesses = WellnessScoreCalculator.generate_recommendations(
            diversification, liquidity, resilience, risk_metrics
        )
        
        return FinancialHealthScore(
            overall_score=round(overall_score, 2),
            grade=grade,
            diversification=diversification,
            liquidity=liquidity,
            behavioral_resilience=resilience,
            risk_metrics=risk_metrics,
            recommendations=recommendations,
            strengths=strengths,
            weaknesses=weaknesses
        )
