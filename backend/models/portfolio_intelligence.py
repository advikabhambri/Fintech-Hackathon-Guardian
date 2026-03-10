from datetime import date, datetime

from sqlalchemy import JSON, Column, Date, DateTime, Float, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship

from db.database import Base


class PortfolioSnapshot(Base):
    __tablename__ = "portfolio_snapshots"
    __table_args__ = (UniqueConstraint("user_id", "snapshot_date", name="uq_user_snapshot_date"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    snapshot_date = Column(Date, nullable=False, index=True, default=date.today)
    total_portfolio = Column(Float, nullable=False, default=0.0)
    total_assets = Column(Float, nullable=False, default=0.0)
    total_liabilities = Column(Float, nullable=False, default=0.0)
    net_worth = Column(Float, nullable=False, default=0.0)
    monthly_change = Column(Float, nullable=False, default=0.0)
    allocation = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="portfolio_snapshots")


class RecommendationInsight(Base):
    __tablename__ = "recommendation_insights"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    risk_profile = Column(String, nullable=False, default="moderate")
    reason = Column(String, nullable=False)
    action = Column(String, nullable=False)
    explainability = Column(String, nullable=False)
    confidence = Column(Float, nullable=False, default=0.0)
    expected_risk_impact = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    user = relationship("User", back_populates="recommendation_insights")
