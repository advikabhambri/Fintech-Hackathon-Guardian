from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from db.database import Base


class GoalType(str, enum.Enum):
    RETIREMENT = "retirement"
    EMERGENCY_FUND = "emergency_fund"
    HOUSE = "house"
    EDUCATION = "education"
    VACATION = "vacation"
    DEBT_PAYOFF = "debt_payoff"
    OTHER = "other"


class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    goal_type = Column(Enum(GoalType), nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0)
    target_date = Column(DateTime)
    is_completed = Column(Boolean, default=False)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="goals")
