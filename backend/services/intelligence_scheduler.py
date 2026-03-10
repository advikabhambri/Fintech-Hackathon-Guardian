from __future__ import annotations

from datetime import date
import importlib

from sqlalchemy.orm import Session

from db.database import SessionLocal
from models.user import User

scheduler = None


def run_daily_intelligence_job() -> dict:
    from api.routes.portfolio_intelligence import (
        persist_daily_snapshot_for_user,
        persist_recommendations_for_user,
    )

    db: Session = SessionLocal()
    processed = 0
    try:
        users = db.query(User).all()
        for user in users:
            persist_daily_snapshot_for_user(db=db, user_id=user.id, snapshot_date=date.today())
            persist_recommendations_for_user(db=db, user_id=user.id, risk_profile="moderate")
            processed += 1

        return {"success": True, "users_processed": processed}
    finally:
        db.close()


def start_intelligence_scheduler() -> bool:
    global scheduler

    try:
        background_module = importlib.import_module("apscheduler.schedulers.background")
        background_scheduler_cls = getattr(background_module, "BackgroundScheduler")
    except Exception:
        return False

    if scheduler is not None:
        return True

    scheduler = background_scheduler_cls(timezone="UTC")
    scheduler.add_job(
        run_daily_intelligence_job,
        trigger="cron",
        id="portfolio_intelligence_daily_job",
        hour=1,
        minute=0,
        replace_existing=True,
    )
    scheduler.start()
    return True


def stop_intelligence_scheduler() -> None:
    global scheduler
    if scheduler is not None:
        scheduler.shutdown(wait=False)
        scheduler = None
