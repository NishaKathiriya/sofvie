from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    report_id = Column(String, unique=True, index=True)
    timestamp = Column(String, index=True)
    site = Column(String, index=True)
    site_type = Column(String)
    area = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    shift = Column(String)
    worker_id = Column(String)
    role = Column(String)
    hazard_type = Column(String)
    severity = Column(Integer)
    ppe_compliant = Column(Boolean)
    near_miss = Column(Boolean)
    injury = Column(Boolean)
    resolved = Column(Boolean)
    time_to_close_hours = Column(Float)
    risk_score = Column(Integer)
    equipment_id = Column(String)
    temperature_c = Column(Float)
    visibility_m = Column(Float)