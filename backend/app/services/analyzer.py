from app.schemas.analyze import (CHECK_IDS, CHECK_LABELS, AnalyzeRequest, AnalyzeResponse,
                                 Check, NextStep, Signal, TrailStep)
from app.services import openrouter, rules, tools

_RANK = {"pass": 0, "warn": 1, "fail": 2}

STATIC_STEPS = {
    "fake": [("Do not apply or respond", "Engaging further risks financial loss or identity theft."),
             ("Report the posting", "Flag it on the platform where you found it."),
             ("Warn others", "Share this result to protect fellow job seekers.")],
    "suspicious": [("Verify via official channels", "Call the company using numbers from its official website."),
                   ("Check the recruiter on LinkedIn", "Confirm they work at the company."),
                   ("Never pay or share ID", "Do not send money or documents until identity is confirmed.")],
    "real": [("Apply via the official careers page", "Go to the company's own website, not a forwarded link."),
             ("Research the company", "Check the company's site and reviews."),
             ("Guard sensitive documents", "Do not share ID or bank details early.")],
}


def _verdict(score: int) -> str:
    return "real" if score >= 75 else "suspicious" if score >= 45 else "fake"


def analyze(req: AnalyzeRequest, use_agent: bool = True) -> AnalyzeResponse:
    r = rules.evaluate(req)

    # Deterministic first step: investigate the recruiter's domain (also works with no LLM).
    trail = []
    evidence = ""
    email = req.recruiter_email.strip().lower()
    domain = email.rsplit("@", 1)[1] if "@" in email else ""
    if domain and domain not in rules.FREE_EMAIL:
        info, finding = tools.check_domain(domain)
        rules.apply_domain_info(r, info)
        trail.append(TrailStep(tool="check_domain", input=domain, finding=finding))
        evidence = finding

    agent = openrouter.run_agent(req, evidence) if use_agent else None
    llm = None
    if agent:
        llm, agent_trail = agent
        trail += agent_trail

    score = max(0, min(100, r.score))  # domain penalties are applied after rules' own clamp
    checks = dict(r.checks)
    signals = [Signal(type=t, text=x) for t, x in r.signals]
    steps = None
    if llm:
        score = max(0, min(100, score + max(-40, min(10, llm.risk_adjustment))))
        for cid, st in llm.checks.items():  # LLM may escalate, never relax
            if cid in checks and _RANK[st] > _RANK[checks[cid][0]]:
                checks[cid] = (st, "Flagged by AI review")
        seen = {s.text for s in signals}
        signals += [s for s in llm.signals if s.text not in seen]
        steps = llm.next_steps

    # Safety floor: rules-detected payment/ID/overpayment can't be argued away by the LLM.
    if r.hard >= 2:
        score = min(score, 44)
    elif r.hard == 1:
        score = min(score, 74)

    verdict = _verdict(score)
    steps = steps or [NextStep(title=t, detail=d) for t, d in STATIC_STEPS[verdict]]
    return AnalyzeResponse(
        verdict=verdict,
        trust_score=score,
        risk={"real": "low", "suspicious": "medium", "fake": "high"}[verdict],
        checks=[Check(id=c, label=CHECK_LABELS[c], status=checks[c][0], note=checks[c][1])
                for c in CHECK_IDS],
        signals=signals[:8],
        next_steps=steps,
        engine="rules+agent" if llm else "rules",
        trail=trail,
        draft_message=llm.draft_message if llm else "",
    )
