from typing import List, Literal

from pydantic import BaseModel, Field

Status = Literal["pass", "warn", "fail"]
Verdict = Literal["real", "suspicious", "fake"]

CHECK_IDS = ["company", "posting", "recruiter", "channel", "process"]
CHECK_LABELS = {
    "company": "Company identity",
    "posting": "Job posting integrity",
    "recruiter": "Recruiter verification",
    "channel": "Communication channel",
    "process": "Hiring process",
}


class AnalyzeRequest(BaseModel):
    description: str = Field(..., min_length=1, max_length=10000)
    title: str = Field("", max_length=200)
    company: str = Field("", max_length=200)
    recruiter_email: str = Field("", max_length=200)
    source: str = Field("", max_length=50)


class Check(BaseModel):
    id: str
    label: str
    status: Status
    note: str = ""


class Signal(BaseModel):
    type: Literal["red", "green"]
    text: str


class NextStep(BaseModel):
    title: str
    detail: str


class TrailStep(BaseModel):
    tool: str
    input: str
    finding: str


class AnalyzeResponse(BaseModel):
    verdict: Verdict
    trust_score: int = Field(..., ge=0, le=100)
    risk: Literal["low", "medium", "high"]
    checks: List[Check]
    signals: List[Signal]
    next_steps: List[NextStep]
    engine: Literal["rules+agent", "rules"]
    trail: List[TrailStep] = []  # what the agent investigated, in order
    draft_message: str = ""  # safe message the user can send the recruiter
