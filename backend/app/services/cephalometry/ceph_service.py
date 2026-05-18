import logging
from typing import Optional
logger = logging.getLogger(__name__)

NORMS = {"sna": 82.0, "snb": 80.0, "anb": 2.0, "fma": 25.0, "impa": 90.0, "fmia": 65.0,
         "u1_na_angle": 22.0, "u1_na_mm": 4.0, "l1_nb_angle": 25.0, "l1_nb_mm": 4.0,
         "wits": 0.0, "co_a": 92.0, "co_gn": 121.0, "facial_axis": 90.0, "convexity": 2.0,
         "overjet": 3.0, "overbite": 2.0}

class CephalometryService:
    async def extract_measurements(self, case_id: str, image_urls: list, patient_age: Optional[int] = None) -> dict:
        logger.info(f"Extracting measurements for case {case_id}")
        return {**NORMS, "sna": 84.0, "snb": 78.0, "anb": 6.0, "fma": 30.0, "impa": 95.0,
                "wits": 4.0, "overjet": 6.0}
