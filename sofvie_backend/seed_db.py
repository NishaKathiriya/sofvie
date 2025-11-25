import pandas as pd
from database import engine, SessionLocal
import models
from sqlalchemy.orm import Session
import os

CSV_PATH = os.getenv("CSV_PATH", "./data/sofvie_safety_dataset.csv")

def create_tables():
    models.Base.metadata.create_all(bind=engine)

def seed():
    create_tables()
    df = pd.read_csv(CSV_PATH)
    db: Session = SessionLocal()
    for _, row in df.iterrows():
        rec = models.Report(
            report_id = str(row.get("report_id")),
            timestamp = str(row.get("timestamp")),
            site = str(row.get("site")),
            site_type = str(row.get("site_type")),
            area = str(row.get("area")),
            latitude = float(row.get("latitude")) if not pd.isna(row.get("latitude")) else None,
            longitude = float(row.get("longitude")) if not pd.isna(row.get("longitude")) else None,
            shift = str(row.get("shift")),
            worker_id = str(row.get("worker_id")),
            role = str(row.get("role")),
            hazard_type = str(row.get("hazard_type")),
            severity = int(row.get("severity")) if not pd.isna(row.get("severity")) else None,
            ppe_compliant = bool(row.get("ppe_compliant")),
            near_miss = bool(row.get("near_miss")),
            injury = bool(row.get("injury")),
            resolved = bool(row.get("resolved")),
            time_to_close_hours = float(row.get("time_to_close_hours")) if row.get("time_to_close_hours")!="" and not pd.isna(row.get("time_to_close_hours")) else None,
            risk_score = int(row.get("risk_score")) if not pd.isna(row.get("risk_score")) else 0,
            equipment_id = str(row.get("equipment_id")),
            temperature_c = float(row.get("temperature_c")) if not pd.isna(row.get("temperature_c")) else None,
            visibility_m = float(row.get("visibility_m")) if not pd.isna(row.get("visibility_m")) else None
        )
        db.add(rec)
    db.commit()
    db.close()
    print("Seed complete. Records:", db.query(models.Report).count())

if __name__ == "__main__":
    seed()