from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from models.goal import GoalType


class GoalBase(BaseModel):
    title: str
    goal_type: GoalType
    target_amount: float
    current_amount: float = 0
    target_date: Optional[datetime] = None
    description: Optional[str] = None


class GoalCreate(GoalBase):
    pass


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    goal_type: Optional[GoalType] = None
    target_amount: Optional[float] = None
    current_amount: Optional[float] = None
    target_date: Optional[datetime] = None
    is_completed: Optional[bool] = None
    description: Optional[str] = None


class GoalResponse(GoalBase):
    id: int
    user_id: int
    is_completed: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
