# TrustPath AI

Job fraud detection. Paste a job posting and get a **Real / Suspicious / Fake** verdict with a confidence score and next steps.

> 1 in 7 online job postings is fraudulent.

## Five checks

1. **Company identity**: domain intelligence, business registration, official website corroboration.
2. **Job posting integrity**: unrealistic salary, vague duties, urgent language, disguised payment requests.
3. **Recruiter verification**: recruiter vs. LinkedIn, company directories, career-page listings.
4. **Communication channel**: off-platform chats, Gmail/Yahoo contacts, WhatsApp-only hiring, suspicious links.
5. **Hiring process**: upfront fees, equipment deposits, overpayment schemes, early requests for sensitive documents.

## Problems covered

| ID | Problem | Approach |
|----|---------|----------|
| PS-01 | Fake company creation | Existence verification, domain intelligence, source corroboration |
| PS-02 | Genuine company impersonation | Compare official domains, recruiter identity, contacts, career listings |
| PS-03 | Lookalike websites and domains | Domain similarity, WHOIS age, SSL validation, typosquatting detection |
| PS-04 | Payment and deposit scams | NLP scan for payment language and urgency triggers |
| PS-05 | Off-platform communication | Channel analysis, cross-platform recruiter matching |
| PS-06 | Overpayment and data theft | Hiring-sequence analysis, sensitive-data request detection |

## Frontend prototype

`index.html` is a single-file UI (Home, Detect, About pages). Open it in a browser; no build step.

The analysis is currently a **mock**: it flags keywords (e.g. `whatsapp`, `telegram`, `deposit`, `training fee`) and off-platform sources, then picks a random confidence in a band. The 97.4% accuracy and <10s figures shown in the UI are placeholders, not measured results.
