from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.models import User, Signature
import uuid

router = APIRouter()

class HistoricalCase(BaseModel):
    patient_age: int
    patient_sex: str
    facial_pattern: str
    skeletal_class: str
    dental_class: str
    extractions: bool
    extracted_teeth: Optional[str] = ""
    mechanics: str
    anchorage: str
    appliance_type: Optional[str] = ""
    treatment_duration_months: int
    notes: Optional[str] = ""
    has_initial_docs: Optional[bool] = False
    has_final_docs: Optional[bool] = False

class TrainRequest(BaseModel):
    historical_cases: list[HistoricalCase]

@router.post("/train")
async def train_signature(data: TrainRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    cases = data.historical_cases
    if not cases:
        from fastapi import HTTPException
        raise HTTPException(400, "Adicione pelo menos 1 caso para treinar a assinatura")
    
    result = await db.execute(select(Signature).where(Signature.user_id == current_user.id))
    sig = result.scalar_one_or_none()
    
    extraction_rate = sum(1 for c in cases if c.extractions) / len(cases)
    mechanics_count: dict = {}
    anchorage_count: dict = {}
    pattern_count: dict = {}
    
    for c in cases:
        if c.mechanics: mechanics_count[c.mechanics] = mechanics_count.get(c.mechanics, 0) + 1
        if c.anchorage: anchorage_count[c.anchorage] = anchorage_count.get(c.anchorage, 0) + 1
        if c.facial_pattern: pattern_count[c.facial_pattern] = pattern_count.get(c.facial_pattern, 0) + 1
    
    preferred_mechanics = max(mechanics_count, key=mechanics_count.get) if mechanics_count else ""
    preferred_anchorage = max(anchorage_count, key=anchorage_count.get) if anchorage_count else ""
    dominant_pattern = max(pattern_count, key=pattern_count.get) if pattern_count else ""
    avg_duration = sum(c.treatment_duration_months for c in cases) / len(cases)
    confidence = min(len(cases) / 10, 1.0)
    
    metadata = {
        "extraction_rate": round(extraction_rate, 2),
        "preferred_mechanics": preferred_mechanics,
        "preferred_anchorage": preferred_anchorage,
        "dominant_facial_pattern": dominant_pattern,
        "avg_treatment_duration_months": round(avg_duration, 1),
        "cases_count": len(cases),
        "confidence": round(confidence, 2),
    }
    
    if sig:
        sig.signature_metadata = metadata
        sig.cases_count = len(cases)
        sig.confidence_score = confidence
    else:
        sig = Signature(id=str(uuid.uuid4()), user_id=current_user.id,
                        signature_metadata=metadata, cases_count=len(cases), confidence_score=confidence)
        db.add(sig)
    
    await db.commit()
    return {"message": "Assinatura treinada com sucesso", "confidence": confidence, "cases_count": len(cases), "metadata": metadata}

@router.get("/status")
async def signature_status(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Signature).where(Signature.user_id == current_user.id))
    sig = result.scalar_one_or_none()
    if not sig:
        return {"status": "not_trained", "confidence": 0, "cases_count": 0}
    return {"status": "trained", "confidence": sig.confidence_score, "cases_count": sig.cases_count, "metadata": sig.signature_metadata}
