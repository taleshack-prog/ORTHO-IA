from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.api.v1.auth import get_current_user
from app.models.models import User, Signature

router = APIRouter()

class HistoricalCase(BaseModel):
    patient_age: int
    patient_sex: str
    facial_pattern: str
    skeletal_class: str
    extractions: bool
    mechanics: str
    anchorage: str
    treatment_duration_months: int

class TrainRequest(BaseModel):
    historical_cases: list[HistoricalCase]

@router.post("/train")
async def train_signature(data: TrainRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if len(data.historical_cases) < 5:
        raise HTTPException(400, "Mínimo de 5 casos históricos necessários")
    result = await db.execute(select(Signature).where(Signature.user_id == current_user.id))
    sig = result.scalar_one_or_none()
    extraction_rate = sum(1 for c in data.historical_cases if c.extractions) / len(data.historical_cases)
    mechanics_count = {}
    for c in data.historical_cases:
        mechanics_count[c.mechanics] = mechanics_count.get(c.mechanics, 0) + 1
    preferred_mechanics = max(mechanics_count, key=mechanics_count.get)
    metadata = {"extraction_rate": extraction_rate, "preferred_mechanics": preferred_mechanics,
                "cases_count": len(data.historical_cases), "confidence": min(len(data.historical_cases) / 20, 1.0)}
    if sig:
        sig.signature_metadata = metadata
        sig.cases_count = len(data.historical_cases)
        sig.confidence_score = metadata["confidence"]
    else:
        import uuid
        sig = Signature(id=str(uuid.uuid4()), user_id=current_user.id,
                        signature_metadata=metadata, cases_count=len(data.historical_cases),
                        confidence_score=metadata["confidence"])
        db.add(sig)
    await db.commit()
    return {"message": "Assinatura treinada", "confidence": metadata["confidence"], "cases_count": len(data.historical_cases)}

@router.get("/status")
async def signature_status(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Signature).where(Signature.user_id == current_user.id))
    sig = result.scalar_one_or_none()
    if not sig:
        return {"status": "not_trained", "confidence": 0, "cases_count": 0}
    return {"status": "trained", "confidence": sig.confidence_score, "cases_count": sig.cases_count,
            "metadata": sig.signature_metadata}
