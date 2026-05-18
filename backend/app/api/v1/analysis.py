from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.models import Case, CaseStatus, User
from app.tasks.analysis_tasks import process_full_analysis

router = APIRouter()

@router.post("/cases/{case_id}/analyze")
async def analyze_case(case_id: str, background_tasks: BackgroundTasks,
                       current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Case).where(Case.id == case_id, Case.orthodontist_id == current_user.id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(404, "Caso não encontrado")
    if case.status == CaseStatus.ANALYZING:
        raise HTTPException(400, "Análise já em andamento")
    background_tasks.add_task(process_full_analysis, case_id, str(current_user.id))
    return {"message": "Análise iniciada", "case_id": case_id}

@router.get("/cases/{case_id}/status")
async def get_status(case_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Case).where(Case.id == case_id, Case.orthodontist_id == current_user.id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(404, "Caso não encontrado")
    return {"case_id": case_id, "status": case.status, "stage": case.processing_stage}

@router.post("/cases/{case_id}/feedback")
async def feedback(case_id: str, rating: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Case).where(Case.id == case_id, Case.orthodontist_id == current_user.id))
    if not result.scalar_one_or_none():
        raise HTTPException(404, "Caso não encontrado")
    return {"message": "Feedback registrado", "rating": rating}
