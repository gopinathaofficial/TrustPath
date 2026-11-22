"""Deterministic fraud rules. Pure functions, no I/O."""
import re
from dataclasses import dataclass, field
from difflib import SequenceMatcher
from typing import Dict, List, Tuple

from app.schemas.analyze import AnalyzeRequest

FREE_EMAIL = {"gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "proton.me",
              "protonmail.com", "rediffmail.com", "yahoo.in", "icloud.com"}
BRANDS = ["google", "amazon", "microsoft", "stripe", "apple", "ibm", "infosys", "tcs",
          "wipro", "accenture", "flipkart", "netflix", "linkedin", "meta", "paypal"]

# (check, regex, penalty, status, signal, hard)
TEXT_RULES: List[Tuple[str, str, int, str, str, bool]] = [
    ("process", r"registration fee|training fee|security deposit|refundable deposit|processing fee|pay (for )?(the )?(equipment|kit|laptop|training|registration)|wire transfer|western union|gift card|crypto|bitcoin|pay rs|pay inr|pay \$",
     40, "fail", "Upfront payment or fee requested", True),
    ("process", r"aadhaar|aadhar|\bpan\b|\bssn\b|social security|passport (copy|scan|number)|bank (account|details)",
     30, "fail", "Asks for ID or bank details before any interview", True),
    ("process", r"overpay|cheque will be sent|check will be sent|reimburse you|send back the (balance|difference)",
     30, "fail", "Overpayment / reimbursement scheme language", True),
    ("channel", r"whatsapp|telegram|signal app|text us on",
     25, "fail", "Asks you to move to WhatsApp/Telegram", False),
    ("posting", r"urgent|immediate joining|limited slots|apply today only|hurry",
     10, "warn", "Urgency language pressures you to act fast", False),
    ("posting", r"no experience.{0,60}(earn|salary|pay)|earn.{0,30}(per day|a day|daily|per week|weekly).{0,40}(home|online)|work from home.{0,20}earn",
     15, "warn", "Too-good-to-be-true pay claims", False),
]


@dataclass
class RuleResult:
    score: int = 100
    hard: int = 0
    checks: Dict[str, Tuple[str, str]] = field(default_factory=dict)  # id -> (status, note)
    signals: List[Tuple[str, str]] = field(default_factory=list)  # (red|green, text)


_RANK = {"pass": 0, "warn": 1, "fail": 2}


def _flag(r: RuleResult, check: str, status: str, note: str, penalty: int, hard: bool = False):
    r.score -= penalty
    r.hard += hard
    if _RANK[status] > _RANK[r.checks[check][0]]:
        r.checks[check] = (status, note)
    r.signals.append(("red", note))


def _norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", s.lower())


def _lookalike(domain: str, company: str) -> bool:
    parts = domain.split(".")
    label = _norm(parts[-2] if len(parts) >= 2 else domain)
    names = set(BRANDS) | ({_norm(company)} if len(_norm(company)) >= 3 else set())
    for n in names:
        if label == n:
            return False  # exact brand domain
    for n in names:
        if n in label or SequenceMatcher(None, label, n).ratio() >= 0.8:
            return True
    return False


def evaluate(req: AnalyzeRequest) -> RuleResult:
    r = RuleResult(checks={c: ("pass", "") for c in
                           ["company", "posting", "recruiter", "channel", "process"]})
    text = f"{req.title} {req.description}".lower()

    for check, rx, pen, status, note, hard in TEXT_RULES:
        if re.search(rx, text):
            _flag(r, check, status, note, pen, hard)

    src = req.source.strip().lower()
    if src in ("whatsapp", "telegram"):
        _flag(r, "channel", "fail", f"Posting came via {req.source}, not a hiring platform", 30)
    elif src == "email":
        _flag(r, "channel", "warn", "Unsolicited email source is a common scam channel", 15)

    email = req.recruiter_email.strip().lower()
    if "@" in email:
        domain = email.rsplit("@", 1)[1]
        if domain in FREE_EMAIL:
            _flag(r, "recruiter", "warn", "Recruiter uses a free personal email domain", 20)
        elif _lookalike(domain, req.company):
            _flag(r, "recruiter", "fail", f"Recruiter domain '{domain}' imitates a known company", 35)
    elif not email:
        r.checks["recruiter"] = ("warn", "No recruiter contact given to verify")

    if not req.company.strip():
        _flag(r, "company", "warn", "No company name given; cannot be verified", 10)
    else:
        r.checks["company"] = ("pass", "Based on posting text only; not checked against a registry")

    if len(req.description.strip()) < 200:
        _flag(r, "posting", "warn", "Posting is very short or vague", 10)

    if not r.signals:
        r.signals.append(("green", "No fraud patterns found in the posting text"))
    r.score = max(0, min(100, r.score))
    return r


def apply_domain_info(r: RuleResult, info: dict) -> None:
    """Fold a check_domain result for the recruiter's domain into the rules result."""
    age = info.get("age_days")
    if info.get("resolves") is False:
        _flag(r, "recruiter", "fail", "Recruiter email domain does not resolve", 25)
    elif age is not None and age < 180:
        _flag(r, "recruiter", "fail", f"Recruiter domain was registered only {age} days ago", 25)
    elif age is not None and age > 730:
        r.signals.append(("green", f"Recruiter domain is established ({age // 365}+ years old)"))
