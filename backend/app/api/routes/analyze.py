from fastapi import APIRouter

from app.schemas.analyze import AnalyzeRequest, AnalyzeResponse
from app.services import analyzer

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest) -> AnalyzeResponse:
    # sync def: FastAPI runs it in a threadpool, so the blocking LLM call is fine.
    return analyzer.analyze(req)
