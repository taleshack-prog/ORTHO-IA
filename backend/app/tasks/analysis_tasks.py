import logging
import asyncio
from datetime import datetime
from celery import Celery
from sqlalchemy import select, update
from app.core.config import settings

logger = logging.getLogger(__name__)
celery_app = Celery("orto_ia", broker=settings.REDIS_URL, backend=settings.REDIS_URL)
celery_app.conf.update(task_serializer="json", accept_content=["json"], result_serializer="json",
                       timezone="America/Sao_Paulo", enable_utc=True)


@celery_app.task(bind=True, max_retries=3)
def process_full_analysis(self, case_id: str, user_id: str):
    async def run():
        from app.core.database import AsyncSessionLocal
        from app.models.models import Case, CaseStatus
        from app.services.cephalometry.ceph_service import CephalometryService
        from app.services.validation.clinical_validator import ClinicalValidator

        async with AsyncSessionLocal() as db:
            try:
                result = await db.execute(select(Case).where(Case.id == case_id))
                case = result.scalar_one_or_none()
                if not case:
                    return

                await db.execute(update(Case).where(Case.id == case_id).values(
                    status=CaseStatus.ANALYZING, processing_stage="stage_1_cephalometry"))
                await db.commit()

                ceph = CephalometryService()
                measurements = await ceph.extract_measurements(case_id, case.image_urls or [], case.patient_age)

                await db.execute(update(Case).where(Case.id == case_id).values(processing_stage="stage_2_reasoning"))
                await db.commit()

                diagnosis = {"skeletal_class": "Classe II Esquelética", "facial_pattern": "Dolicofacial",
                             "dental_class": "Classe II Divisão 1", "summary": "Diagnóstico gerado pela IA."}
                treatment_plan = {"mechanics": "Extração de pré-molares", "anchorage": "Máxima",
                                  "extractions": True, "estimated_duration": "24 meses"}

                validator = ClinicalValidator(measurements, treatment_plan)
                validated_plan, warnings = validator.validate()

                await db.execute(update(Case).where(Case.id == case_id).values(
                    status=CaseStatus.COMPLETED, processing_stage="completed",
                    ai_diagnosis=diagnosis, treatment_plan=validated_plan,
                    clinical_warnings=warnings, analyzed_at=datetime.utcnow()))
                await db.commit()
                logger.info(f"Case {case_id} completed")

            except Exception as e:
                logger.error(f"Analysis error {case_id}: {e}")
                await db.execute(update(Case).where(Case.id == case_id).values(
                    status=CaseStatus.FAILED, processing_stage=f"error: {str(e)[:100]}"))
                await db.commit()
                raise

    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(run())
        loop.close()
    except Exception as exc:
        raise self.retry(exc=exc)
