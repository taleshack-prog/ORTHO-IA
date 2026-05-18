import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.models import User, Patient

router = APIRouter()

class PatientCreate(BaseModel):
    full_name: str
    birth_date: Optional[str] = None
    sex: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    chief_complaint: Optional[str] = None
    medical_history: Optional[str] = None

@router.post("/", status_code=201)
async def create_patient(data: PatientCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    patient = Patient(id=str(uuid.uuid4()), orthodontist_id=current_user.id, **data.model_dump())
    db.add(patient)
    await db.commit()
    await db.refresh(patient)
    return {"id": patient.id, "full_name": patient.full_name}

@router.get("/")
async def list_patients(search: Optional[str] = Query(None), page: int = 1, limit: int = 20,
                        current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    q = select(Patient).where(Patient.orthodontist_id == current_user.id)
    if search:
        q = q.where(Patient.full_name.ilike(f"%{search}%"))
    total = (await db.execute(select(func.count()).select_from(q.subquery()))).scalar_one()
    rows = (await db.execute(q.offset((page-1)*limit).limit(limit).order_by(Patient.created_at.desc()))).scalars().all()
    return {"total": total, "patients": [{"id": p.id, "full_name": p.full_name, "sex": p.sex, "phone": p.phone, "chief_complaint": p.chief_complaint} for p in rows]}

@router.get("/{patient_id}")
async def get_patient(patient_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Patient).where(Patient.id == patient_id, Patient.orthodontist_id == current_user.id))
    patient = result.scalar_one_or_none()
    if not patient:
        raise HTTPException(404, "Paciente não encontrado")
    return {"id": patient.id, "full_name": patient.full_name, "sex": patient.sex, "phone": patient.phone, "email": patient.email, "chief_complaint": patient.chief_complaint}
