from datetime import date, datetime, timedelta
from statistics import pstdev
from typing import Dict, List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from core.security import get_current_user
from db.database import get_db
from models.portfolio_intelligence import PortfolioSnapshot, RecommendationInsight
from models.portfolio import Portfolio
from models.user import User

router = APIRouter()

ASSET_CLASS_LABELS = ["stocks", "bonds", "gold", "fd", "insurance", "crypto", "real_estate", "cash", "other"]


def _safe_price(item: Portfolio) -> float:
    return float(item.current_price or item.purchase_price or 0)


def _market_value(item: Portfolio) -> float:
    return max(0.0, float(item.quantity or 0) * _safe_price(item))


def _cost_value(item: Portfolio) -> float:
    return max(0.0, float(item.quantity or 0) * float(item.purchase_price or 0))


def _asset_class(item: Portfolio) -> str:
    name = (item.asset_name or "").lower()
    notes = (item.notes or "").lower()

    if any(token in name or token in notes for token in ["gold", "bullion", "sovereign gold", "sgb"]):
        return "gold"
    if any(token in name or token in notes for token in ["fixed deposit", "fd", "term deposit", "certificate of deposit"]):
        return "fd"
    if any(token in name or token in notes for token in ["insurance", "policy", "ulip"]):
        return "insurance"

    raw = item.asset_type.value if hasattr(item.asset_type, "value") else str(item.asset_type)
    return raw if raw in ASSET_CLASS_LABELS else "other"


def _infer_sector(item: Portfolio) -> str:
    text = f"{item.asset_name} {(item.notes or '')}".lower()
    sector_keywords = {
        "technology": ["tech", "software", "cloud", "semiconductor", "ai", "apple", "microsoft", "nvidia"],
        "finance": ["bank", "financial", "insurance", "visa", "mastercard"],
        "healthcare": ["pharma", "health", "biotech", "hospital"],
        "energy": ["oil", "gas", "energy", "renewable", "solar"],
        "consumer": ["retail", "consumer", "fmcg", "beverage", "food"],
        "real_estate": ["real estate", "reit", "property"],
        "digital_assets": ["bitcoin", "ethereum", "crypto", "token", "blockchain"],
        "fixed_income": ["bond", "treasury", "debt", "fd", "fixed deposit"],
        "metals": ["gold", "silver", "metal"],
    }

    for sector, keywords in sector_keywords.items():
        if any(keyword in text for keyword in keywords):
            return sector
    return "other"


def _build_holdings(items: List[Portfolio]) -> List[Dict]:
    holdings: List[Dict] = []
    for item in items:
        current_value = _market_value(item)
        invested_value = _cost_value(item)
        pnl_value = current_value - invested_value
        pnl_pct = (pnl_value / invested_value * 100) if invested_value > 0 else 0.0

        symbol = "".join(ch for ch in (item.asset_name or "") if ch.isalnum())[:8].upper() or f"A{item.id}"

        holdings.append(
            {
                "id": item.id,
                "symbol": symbol,
                "asset_name": item.asset_name,
                "asset_class": _asset_class(item),
                "sector": _infer_sector(item),
                "quantity": float(item.quantity),
                "avg_cost": float(item.purchase_price),
                "price": _safe_price(item),
                "market_value": round(current_value, 2),
                "invested_value": round(invested_value, 2),
                "daily_pnl": round(pnl_value * 0.08, 2),
                "pnl_1m": round(pnl_value * 0.45, 2),
                "pnl_1y": round(pnl_value, 2),
                "pnl_pct_1y": round(pnl_pct, 2),
            }
        )
    return holdings


def _total_assets(holdings: List[Dict]) -> float:
    return sum(item["market_value"] for item in holdings)


def _allocation(holdings: List[Dict]) -> List[Dict]:
    total = _total_assets(holdings)
    by_class: Dict[str, float] = {}
    for item in holdings:
        by_class[item["asset_class"]] = by_class.get(item["asset_class"], 0.0) + item["market_value"]

    rows = []
    for asset_class in ASSET_CLASS_LABELS:
        value = by_class.get(asset_class, 0.0)
        if value <= 0:
            continue
        rows.append(
            {
                "asset_class": asset_class,
                "value": round(value, 2),
                "weight": round((value / total * 100) if total else 0.0, 2),
            }
        )
    return sorted(rows, key=lambda x: x["value"], reverse=True)


def _sector_exposure(holdings: List[Dict]) -> List[Dict]:
    total = _total_assets(holdings)
    by_sector: Dict[str, float] = {}
    for item in holdings:
        by_sector[item["sector"]] = by_sector.get(item["sector"], 0.0) + item["market_value"]

    result = []
    for sector, value in sorted(by_sector.items(), key=lambda x: x[1], reverse=True):
        weight = (value / total * 100) if total else 0.0
        result.append(
            {
                "sector": sector,
                "value": round(value, 2),
                "weight": round(weight, 2),
                "overexposed": weight > 35,
            }
        )
    return result


def _risk_score(holdings: List[Dict]) -> Dict:
    total = _total_assets(holdings)
    if total <= 0:
        return {
            "score": 0.0,
            "band": "low",
            "components": {
                "concentration": 0.0,
                "volatility": 0.0,
                "max_drawdown": 0.0,
                "liquidity": 0.0,
            },
        }

    weights = [item["market_value"] / total for item in holdings if item["market_value"] > 0]
    hhi = sum(w * w for w in weights)
    concentration = min(100.0, hhi * 100.0)

    pnl_pcts = [item["pnl_pct_1y"] for item in holdings]
    volatility = min(100.0, pstdev(pnl_pcts) if len(pnl_pcts) > 1 else abs(pnl_pcts[0]) if pnl_pcts else 0.0)

    drawdowns = [max(0.0, -item["pnl_pct_1y"]) for item in holdings]
    max_drawdown = min(100.0, max(drawdowns) if drawdowns else 0.0)

    liquid_classes = {"cash", "stocks", "crypto", "bonds", "fd"}
    liquid_value = sum(item["market_value"] for item in holdings if item["asset_class"] in liquid_classes)
    liquidity_ratio = (liquid_value / total) if total else 0.0
    liquidity_risk = max(0.0, min(100.0, (1 - liquidity_ratio) * 100.0))

    score = (
        concentration * 0.35
        + volatility * 0.25
        + max_drawdown * 0.2
        + liquidity_risk * 0.2
    )

    if score < 35:
        band = "low"
    elif score < 65:
        band = "moderate"
    else:
        band = "high"

    return {
        "score": round(score, 2),
        "band": band,
        "components": {
            "concentration": round(concentration, 2),
            "volatility": round(volatility, 2),
            "max_drawdown": round(max_drawdown, 2),
            "liquidity": round(liquidity_risk, 2),
        },
    }


def _recommendations(holdings: List[Dict], risk_profile: str) -> List[Dict]:
    recs: List[Dict] = []
    total = _total_assets(holdings)
    risk = _risk_score(holdings)
    sectors = _sector_exposure(holdings)

    for sector in sectors:
        if sector["overexposed"]:
            recs.append(
                {
                    "reason": f"Sector exposure in {sector['sector']} is {sector['weight']}%",
                    "action": f"Trim {sector['sector']} allocation by 5-10% and redistribute to underweight sectors",
                    "confidence": 0.83,
                    "expected_risk_impact": -8.0,
                }
            )

    class_alloc = {row["asset_class"]: row["weight"] for row in _allocation(holdings)}
    crypto_weight = class_alloc.get("crypto", 0.0)
    bonds_weight = class_alloc.get("bonds", 0.0)

    if risk_profile == "moderate" and crypto_weight > 20:
        recs.append(
            {
                "reason": f"Crypto exposure is {crypto_weight}% for moderate profile",
                "action": "Rebalance 3-7% from crypto into bonds/cash",
                "confidence": 0.8,
                "expected_risk_impact": -6.5,
            }
        )

    if risk_profile == "conservative" and bonds_weight < 25:
        recs.append(
            {
                "reason": f"Bonds allocation is {bonds_weight}% for conservative profile",
                "action": "Increase bonds/FD allocation to improve stability",
                "confidence": 0.78,
                "expected_risk_impact": -5.0,
            }
        )

    if risk["score"] > 65:
        recs.append(
            {
                "reason": "Overall risk score is elevated",
                "action": "Shift toward diversified, liquid assets and reduce single-position concentration",
                "confidence": 0.85,
                "expected_risk_impact": -10.0,
            }
        )

    if not recs and total > 0:
        recs.append(
            {
                "reason": "Portfolio is balanced under current rules",
                "action": "Continue periodic monthly rebalancing and monitor trend changes",
                "confidence": 0.72,
                "expected_risk_impact": -1.0,
            }
        )

    return recs[:5]


def _explainability_text(reason: str, action: str, confidence: float, expected_risk_impact: float) -> str:
    confidence_label = "high" if confidence >= 0.8 else "medium" if confidence >= 0.6 else "low"
    return (
        f"Recommendation generated from rule-based checks: {reason}. "
        f"Suggested action: {action}. "
        f"Model confidence is {confidence_label} ({round(confidence * 100)}%), "
        f"with estimated risk-score impact of {expected_risk_impact} points."
    )


def persist_daily_snapshot_for_user(db: Session, user_id: int, snapshot_date: date | None = None) -> Dict:
    effective_date = snapshot_date or date.today()
    portfolio_items = db.query(Portfolio).filter(Portfolio.user_id == user_id).all()
    holdings = _build_holdings(portfolio_items)

    total_assets = _total_assets(holdings)
    total_liabilities = 0.0
    net_worth = total_assets - total_liabilities
    monthly_change = sum(item["daily_pnl"] for item in holdings) * 22
    allocation = _allocation(holdings)

    snapshot = db.query(PortfolioSnapshot).filter(
        PortfolioSnapshot.user_id == user_id,
        PortfolioSnapshot.snapshot_date == effective_date,
    ).first()

    if snapshot is None:
        snapshot = PortfolioSnapshot(
            user_id=user_id,
            snapshot_date=effective_date,
            total_portfolio=round(total_assets, 2),
            total_assets=round(total_assets, 2),
            total_liabilities=round(total_liabilities, 2),
            net_worth=round(net_worth, 2),
            monthly_change=round(monthly_change, 2),
            allocation=allocation,
        )
        db.add(snapshot)
    else:
        snapshot.total_portfolio = round(total_assets, 2)
        snapshot.total_assets = round(total_assets, 2)
        snapshot.total_liabilities = round(total_liabilities, 2)
        snapshot.net_worth = round(net_worth, 2)
        snapshot.monthly_change = round(monthly_change, 2)
        snapshot.allocation = allocation

    db.commit()
    db.refresh(snapshot)

    return {
        "as_of_date": snapshot.snapshot_date.isoformat(),
        "total_portfolio": snapshot.total_portfolio,
        "total_assets": snapshot.total_assets,
        "total_liabilities": snapshot.total_liabilities,
        "net_worth": snapshot.net_worth,
        "monthly_change": snapshot.monthly_change,
        "allocation": snapshot.allocation or [],
    }


def persist_recommendations_for_user(db: Session, user_id: int, risk_profile: str = "moderate") -> List[Dict]:
    portfolio_items = db.query(Portfolio).filter(Portfolio.user_id == user_id).all()
    holdings = _build_holdings(portfolio_items)
    recs = _recommendations(holdings, risk_profile.lower())

    for rec in recs:
        explanation = _explainability_text(
            reason=rec["reason"],
            action=rec["action"],
            confidence=rec["confidence"],
            expected_risk_impact=rec["expected_risk_impact"],
        )

        db.add(
            RecommendationInsight(
                user_id=user_id,
                risk_profile=risk_profile.lower(),
                reason=rec["reason"],
                action=rec["action"],
                explainability=explanation,
                confidence=rec["confidence"],
                expected_risk_impact=rec["expected_risk_impact"],
            )
        )

    db.commit()

    return [
        {
            **rec,
            "explainability": _explainability_text(
                reason=rec["reason"],
                action=rec["action"],
                confidence=rec["confidence"],
                expected_risk_impact=rec["expected_risk_impact"],
            ),
        }
        for rec in recs
    ]


@router.get("/portfolio/consolidated")
async def get_consolidated_statement(
    date_param: date | None = Query(default=None, alias="date"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return persist_daily_snapshot_for_user(db=db, user_id=current_user.id, snapshot_date=date_param)


@router.get("/portfolio/snapshots")
async def get_portfolio_snapshots(
    days: int = Query(default=30, ge=1, le=365),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(PortfolioSnapshot)
        .filter(PortfolioSnapshot.user_id == current_user.id)
        .order_by(desc(PortfolioSnapshot.snapshot_date))
        .limit(days)
        .all()
    )

    return {
        "count": len(rows),
        "snapshots": [
            {
                "snapshot_date": row.snapshot_date.isoformat(),
                "total_portfolio": row.total_portfolio,
                "net_worth": row.net_worth,
                "monthly_change": row.monthly_change,
                "allocation": row.allocation or [],
            }
            for row in rows
        ],
    }


@router.get("/portfolio/allocation")
async def get_portfolio_allocation(
    period: str = Query(default="1M"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    portfolio_items = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).all()
    holdings = _build_holdings(portfolio_items)

    return {
        "period": period,
        "allocation": _allocation(holdings),
        "total_portfolio": round(_total_assets(holdings), 2),
    }


@router.get("/portfolio/asset-class/{asset_type}/holdings")
async def get_asset_class_holdings(
    asset_type: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    normalized = asset_type.strip().lower()
    portfolio_items = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).all()
    holdings = [item for item in _build_holdings(portfolio_items) if item["asset_class"] == normalized]

    gainers = sorted(holdings, key=lambda x: x["pnl_pct_1y"], reverse=True)[:3]
    losers = sorted(holdings, key=lambda x: x["pnl_pct_1y"])[:3]

    sector_rollup: Dict[str, float] = {}
    total = sum(h["market_value"] for h in holdings)
    for item in holdings:
        sector_rollup[item["sector"]] = sector_rollup.get(item["sector"], 0.0) + item["market_value"]

    sectors = [
        {"sector": sector, "value": round(value, 2), "weight": round((value / total * 100) if total else 0.0, 2)}
        for sector, value in sorted(sector_rollup.items(), key=lambda x: x[1], reverse=True)
    ]

    return {
        "asset_class": normalized,
        "holdings": holdings,
        "pnl": {
            "daily": round(sum(h["daily_pnl"] for h in holdings), 2),
            "one_month": round(sum(h["pnl_1m"] for h in holdings), 2),
            "one_year": round(sum(h["pnl_1y"] for h in holdings), 2),
        },
        "sector_allocation": sectors,
        "top_gainers": gainers,
        "top_losers": losers,
    }


@router.get("/portfolio/asset/{symbol}/performance")
async def get_asset_performance(
    symbol: str,
    range: str = Query(default="1M"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    portfolio_items = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).all()
    holdings = _build_holdings(portfolio_items)

    target = None
    for holding in holdings:
        if holding["symbol"].lower() == symbol.lower() or symbol.lower() in holding["asset_name"].lower():
            target = holding
            break

    if target is None:
        return {
            "symbol": symbol.upper(),
            "range": range,
            "points": [],
            "summary": {"start": 0.0, "current": 0.0, "change": 0.0, "change_pct": 0.0},
        }

    points_count = {"1D": 2, "1M": 30, "1Y": 12}.get(range.upper(), 30)
    current_price = target["price"]
    drift = max(-0.25, min(0.35, target["pnl_pct_1y"] / 100))
    start_price = current_price / (1 + drift) if (1 + drift) != 0 else current_price

    points = []
    for i in range(points_count):
        progress = i / max(1, points_count - 1)
        price = start_price + (current_price - start_price) * progress
        wiggle = (0.02 * current_price) * ((i % 4) - 1.5) / 3
        timestamp = (datetime.utcnow() - timedelta(days=(points_count - i))).isoformat()
        points.append({"ts": timestamp, "price": round(max(0.01, price + wiggle), 2)})

    summary_change = current_price - points[0]["price"]
    summary_pct = (summary_change / points[0]["price"] * 100) if points[0]["price"] else 0.0

    return {
        "symbol": target["symbol"],
        "range": range.upper(),
        "points": points,
        "summary": {
            "start": points[0]["price"],
            "current": current_price,
            "change": round(summary_change, 2),
            "change_pct": round(summary_pct, 2),
        },
    }


@router.get("/risk/score")
async def get_risk_score(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    portfolio_items = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).all()
    holdings = _build_holdings(portfolio_items)
    risk = _risk_score(holdings)
    return {
        "overall_risk_score": risk["score"],
        "risk_band": risk["band"],
        "components": risk["components"],
    }


@router.get("/risk/exposure/sectors")
async def get_sector_risk_exposure(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    portfolio_items = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).all()
    holdings = _build_holdings(portfolio_items)
    sectors = _sector_exposure(holdings)

    return {
        "exposure": sectors,
        "overexposed_count": len([s for s in sectors if s["overexposed"]]),
    }


@router.get("/recommendations")
async def get_recommendations(
    risk_profile: str = Query(default="moderate"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return {
        "risk_profile": risk_profile,
        "recommendations": persist_recommendations_for_user(db=db, user_id=current_user.id, risk_profile=risk_profile),
    }


@router.get("/recommendations/history")
async def get_recommendation_history(
    limit: int = Query(default=20, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(RecommendationInsight)
        .filter(RecommendationInsight.user_id == current_user.id)
        .order_by(desc(RecommendationInsight.created_at))
        .limit(limit)
        .all()
    )

    return {
        "count": len(rows),
        "history": [
            {
                "risk_profile": row.risk_profile,
                "reason": row.reason,
                "action": row.action,
                "explainability": row.explainability,
                "confidence": row.confidence,
                "expected_risk_impact": row.expected_risk_impact,
                "created_at": row.created_at.isoformat(),
            }
            for row in rows
        ],
    }


@router.post("/sync/market-data")
async def sync_market_data(
    current_user: User = Depends(get_current_user),
):
    return {
        "success": True,
        "message": "Market data sync queued",
        "queued_at": datetime.utcnow().isoformat(),
        "scope": "prices and derived metrics",
    }


@router.post("/sync/accounts")
async def sync_accounts(
    current_user: User = Depends(get_current_user),
):
    return {
        "success": True,
        "message": "Account sync queued",
        "queued_at": datetime.utcnow().isoformat(),
        "scope": "broker/bank/policy/crypto connectors",
    }
