# Decision Shortlists: Dedicated Requisition Pipeline

## 1. What Decision Shortlist Means
The Decision Shortlist represents candidates moving specifically through your company's dedicated hiring pipeline for a particular requisition:
```
COMPANY REQUISITION
        ↓
COMPANY APPLICANTS (CandidateApplication)
        ↓
DETERMINISTIC STAGE 1 & 2 SCREENING
        ↓
CONFLICT-FREE EVALUATOR ASSIGNMENT
        ↓
60-MIN LIVE CODING & ARCHITECTURE LOOP
        ↓
INDEPENDENT QA SCORECARD CALIBRATION
        ↓
ALGORITHMIC TOP-N RANKING
        ↓
DECISION SHORTLIST CONSOLE
        ↓
SIDE-BY-SIDE CANDIDATE COMPARISON
        ↓
FINAL COMPANY INTERVIEW
        ↓
OFFER / REJECT
```

## 2. The Strict Zero-Fabrication Deficit Rule
Traditional staffing agencies inflate candidate shortlists with unqualified filler candidates to meet quota promises. THAMILARASAN GLOBAL adheres to absolute transparency:

- If a company requests **10 Senior Engineers**, but only **7** pass all hard requirements and achieve QA-approved evaluation scores ($\ge 75$):
  - `targetCount`: 10
  - `qualifiedCount`: 7
  - `isDeficit`: true
  - The UI displays: **"Deficit Notice: Only 7 candidates currently meet all required criteria."**
  - **Thresholds are NEVER lowered.**
  - **Unqualified candidates are NEVER injected.**
  - **The platform NEVER fabricates candidates.**

## 3. Side-by-Side Candidate Comparison
Hiring managers can select up to 3 candidates from the shortlist to view in a synchronized matrix:
- **Technical Rubrics (1-10)**: Problem Solving, System Design, Concurrency, Clean Code, Communication.
- **Operational Fit**: Verified years of experience, notice period in days, expected compensation in USD.
- **Evidence Dossier**: Specific observed strengths, potential watch items, and principal evaluator commentary.
