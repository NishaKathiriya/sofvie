from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
import models, crud, schemas, database

app = FastAPI(title="Sofvie Safety API (Prototype)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
def health():
    return {"status":"ok"}

@app.post("/reports", response_model=schemas.Report)
def create_report(report: schemas.ReportCreate, db: Session = Depends(get_db)):
    return crud.create_report(db, report)

@app.get("/reports", response_model=List[schemas.Report])
def list_reports(site: Optional[str] = None, start_date: Optional[str] = None, end_date: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.get_reports(db, site=site, start_date=start_date, end_date=end_date)

@app.patch("/reports/{report_id}/status")
def update_status(report_id: str, status: dict, db: Session = Depends(get_db)):
    rpt = crud.update_status(db, report_id, status.get("status"))
    if not rpt:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"ok": True}

@app.get("/metrics/kpis")
def kpis(db: Session = Depends(get_db)):
    return crud.get_kpis(db)

@app.get("/risk")
def risk(site: str, date: str = None, shift: str = None):
    # Prototype deterministic heuristic risk calculation
    base = 30
    if shift and shift.lower() == "night":
        base += 10
    return {"risk_score": base}