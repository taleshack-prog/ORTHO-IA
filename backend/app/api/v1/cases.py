import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.models import User, Case, CaseStatus, Patient
from app.services.storage.s3_service import S3Service

router = APIRouter()

class CaseCreate(BaseModel):
    patient_id: str
    chief_complaint: Optional[str] = None
    anamnesis: Optional[str] = None

@router.post("/", status_code=201)
async def create_case(data: CaseCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Patient).where(Patient.id == data.patient_id, Patient.orthodontist_id == current_user.id))
    patient = result.scalar_one_or_none()
    if not patient:
        raise HTTPException(404, "Paciente não encontrado")
    case = Case(id=str(uuid.uuid4()), patient_id=data.patient_id, orthodontist_id=current_user.id,
                chief_complaint=data.chief_complaint, anamnesis=data.anamnesis,
                patient_sex=patient.sex)
    db.add(case)
    await db.commit()
    await db.refresh(case)
    return {"id": case.id, "status": case.status, "patient_name": patient.full_name}

@router.post("/{case_id}/images")
async def upload_images(case_id: str, files: list[UploadFile] = File(...),
                        current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Case).where(Case.id == case_id, Case.orthodontist_id == current_user.id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(404, "Caso não encontrado")
    s3 = S3Service()
    urls = []
    for f in files:
        content = await f.read()
        url = await s3.upload_bytes(content, f"cases/{case_id}/{uuid.uuid4()}_{f.filename}", f.content_type or "image/jpeg")
        urls.append(url)
    case.image_urls = (case.image_urls or []) + urls
    await db.commit()
    return {"uploaded": len(urls), "image_urls": case.image_urls}

@router.get("/")
async def list_cases(patient_id: Optional[str] = Query(None), status: Optional[str] = Query(None),
                     page: int = 1, limit: int = 20, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    q = select(Case, Patient).join(Patient, Case.patient_id == Patient.id).where(Case.orthodontist_id == current_user.id)
    if patient_id:
        q = q.where(Case.patient_id == patient_id)
    total = (await db.execute(select(func.count()).select_from(select(Case).where(Case.orthodontist_id == current_user.id).subquery()))).scalar_one()
    rows = (await db.execute(q.offset((page-1)*limit).limit(limit).order_by(Case.created_at.desc()))).all()
    return {"total": total, "cases": [{"id": c.id, "patient_name": p.full_name, "status": c.status, "processing_stage": c.processing_stage,
            "ai_diagnosis": c.ai_diagnosis, "pdf_report_url": c.pdf_report_url, "created_at": c.created_at.isoformat(),
            "analyzed_at": c.analyzed_at.isoformat() if c.analyzed_at else None} for c, p in rows]}

@router.get("/{case_id}")
async def get_case(case_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Case, Patient).join(Patient, Case.patient_id == Patient.id)
                               .where(Case.id == case_id, Case.orthodontist_id == current_user.id))
    row = result.one_or_none()
    if not row:
        raise HTTPException(404, "Caso não encontrado")
    c, p = row
    return {"id": c.id, "patient_id": c.patient_id, "patient_name": p.full_name, "status": c.status,
            "processing_stage": c.processing_stage, "chief_complaint": c.chief_complaint,
            "ai_diagnosis": c.ai_diagnosis, "treatment_plan": c.treatment_plan,
            "clinical_warnings": c.clinical_warnings, "pdf_report_url": c.pdf_report_url,
            "image_urls": c.image_urls or [], "created_at": c.created_at.isoformat(),
            "analyzed_at": c.analyzed_at.isoformat() if c.analyzed_at else None}
