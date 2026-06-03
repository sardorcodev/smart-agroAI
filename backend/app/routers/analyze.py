import logging

from fastapi import APIRouter, HTTPException

from ..schemas import FarmData
from ..services.analysis import analyze_farm_data


logger = logging.getLogger("smartagro")
router = APIRouter()


@router.post("/api/analyze")
async def analyze_farm(data: FarmData):
    try:
        return analyze_farm_data(data)
    except Exception as exc:
        logger.exception("Unexpected analyze error: %s", exc)
        raise HTTPException(status_code=500, detail="Analysis failed due to an internal error")
