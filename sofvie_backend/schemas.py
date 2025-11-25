from pydantic import BaseModel
from typing import Optional

class ReportCreate(BaseModel):
    report_id: Optional[str]
    timestamp: str
    site: str
    site_type: Optional[str]
    area: str
    latitude: float
    longitude: float
    shift: str
    worker_id: str
    role: str
    hazard_type: str
    severity: int
    ppe_compliant: bool
    near_miss: bool
    injury: bool
    resolved: bool
    time_to_close_hours: Optional[float] = None
    risk_score: int
    equipment_id: Optional[str] = ""
    temperature_c: Optional[float] = None
    visibility_m: Optional[float] = None

class Report(ReportCreate):
    id: int
    class Config:
        orm_mode = True