from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, extract
from datetime import datetime
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.models import User, Case, CaseStatus, Patient

router = APIRouter()

@router.get("/")
async def list_reports(page: int = 1, limit: int = 20, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    q = (select(Case, Patient).join(Patient, Case.patient_id == Patient.id)
         .where(Case.orthodontist_id == current_user.id, Case.status == CaseStatus.COMPLETED, Case.pdf_report_url.isnot(None))
         .order_by(Case.analyzed_at.desc()))
    total = (await db.execute(select(func.count()).select_from(
        select(Case).where(Case.orthodontist_id == current_user.id, Case.status == CaseStatus.COMPLETED).subquery()))).scalar_one()
    rows = (await db.execute(q.offset((page-1)*limit).limit(limit))).all()
    return {"total": total, "reports": [{"case_id": c.id, "patient_name": p.full_name, "patient_age": c.patient_age,
            "analyzed_at": c.analyzed_at.isoformat() if c.analyzed_at else "", "pdf_url": c.pdf_report_url,
            "skeletal_class": (c.ai_diagnosis or {}).get("skeletal_class"),
            "warnings_count": len(c.clinical_warnings or [])} for c, p in rows]}

@router.get("/stats")
async def stats(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    now = datetime.utcnow()
    total = (await db.execute(select(func.count()).where(Case.orthodontist_id == current_user.id))).scalar_one()
    month = (await db.execute(select(func.count()).where(Case.orthodontist_id == current_user.id,
             extract("month", Case.created_at) == now.month, extract("year", Case.created_at) == now.year))).scalar_one()
    completed = (await db.execute(select(func.count()).where(Case.orthodontist_id == current_user.id, Case.status == CaseStatus.COMPLETED))).scalar_one()
    return {"total_cases": total, "cases_this_month": month, "reports_generated": completed,
            "completion_rate": round(completed / total * 100, 1) if total > 0 else 0}

@router.get("/{case_id}/download")
async def download(case_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Case).where(Case.id == case_id, Case.orthodontist_id == current_user.id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(404, "Caso não encontrado")
    if not case.pdf_report_url:
        raise HTTPException(404, "Laudo não gerado")
    return {"download_url": case.pdf_report_url}
