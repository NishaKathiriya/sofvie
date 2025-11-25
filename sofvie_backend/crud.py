from sqlalchemy.orm import Session
import models, schemas
from sqlalchemy import func

def create_report(db: Session, report: schemas.ReportCreate):
    db_report = models.Report(**report.dict())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

def get_reports(db: Session, site: str = None, start_date: str = None, end_date: str = None):
    q = db.query(models.Report).order_by(models.Report.timestamp.desc())
    if site:
        q = q.filter(models.Report.site == site)
    if start_date:
        q = q.filter(models.Report.timestamp >= start_date)
    if end_date:
        q = q.filter(models.Report.timestamp <= end_date)
    return q.limit(1000).all()

def update_status(db: Session, report_id: str, status: str):
    rpt = db.query(models.Report).filter(models.Report.report_id == report_id).first()
    if not rpt:
        return None
    if status.lower() in ["resolved","closed"]:
        rpt.resolved = True
    db.commit()
    return rpt

def get_kpis(db: Session):
    total = db.query(func.count(models.Report.id)).scalar() or 0
    incidents = db.query(func.count(models.Report.id)).filter(models.Report.injury == True).scalar() or 0
    near_misses = db.query(func.count(models.Report.id)).filter(models.Report.near_miss == True).scalar() or 0
    avg_risk = db.query(func.avg(models.Report.risk_score)).scalar() or 0
    return {
        "total_reports": total,
        "incidents": incidents,
        "near_misses": near_misses,
        "avg_risk": float(avg_risk)
    }