# Company Web Application End-to-End Data Flow

---

## 1. Complete User Journey Lifecycle

```
[Public Company Landing Page /company]
       │
       ▼
[Register Company /company/register] ──► MongoDB Atlas: CompanyModel + UserModel (COMPANY_ADMIN)
       │
       ▼
[6-Step Onboarding Wizard /company/onboarding] ──► Persists steps 1-6 in CompanyModel
       │
       ▼
[Live Hiring Dashboard /company/dashboard] ◄── GET /api/company/dashboard (Aggregated metrics)
       │
       ▼
[Create Requirement /company/requirements/new]
       │
       ▼
[Backend Deterministic Matching Engine]
       ├─► Evaluates hard constraints (skills, notice period, budget, exp)
       ├─► Generates MatchModel records
       └─► Calculates suitability & assigns conflict-free EvaluatorModel
       │
       ▼
[Candidate Matching Pool /company/matches] ◄── Live Match score breakdown (Skills, Exp, Evidence, etc.)
       │
       ▼
[Independent Technical Evaluation Loop] ──► Evaluator records rubric scores & PASS/FAIL verdict
       │
       ▼
[QA Calibration Verification] ──► Calibrates scorecards against fabrication
       │
       ▼
[Decision Shortlist Console /company/shortlists]
       ├─► Shows qualified Top-N candidates
       ├─► Displays deficit warning if fewer qualify than requested (Never fabricates)
       └─► Interactive side-by-side comparison modal (up to 3 candidates)
       │
       ▼
[Company Candidate Dossier /company/candidates/:id]
       ├─► Technical work evidence & rubric breakdown
       └─► Private Company Notes (Tenant isolated)
       │
       ▼
[Company Interview Pipeline /company/interviews] ──► Schedule, reschedule & join video rooms
       │
       ▼
[Post-Interview Feedback /company/feedback] ──► PROCEED_TO_OFFER / NEXT_ROUND / REJECT
       │
       ▼
[Formal Offer Extension /company/offers] ──► Base salary (USD), bonuses, equity, start date
       │
       ▼
[Contracts & Active Placement /company/placements] ──► PlacementModel in production
       │
       ▼
[90-Day Placement Guarantee /company/replacements] ──► Active guarantee countdown window ($0 replacement)
       │
       ▼
[Billing & Corporate Invoicing /company/invoices] ──► NET 30 invoices + Dynamic printable PDF generation
```

---

## 2. Server State Management & Freshness (TanStack Query)

* **Automatic Query Invalidation**:
  - Requirement creation invalidates `['company-dashboard']` and `['requirements']`.
  - Interview scheduling invalidates `['interviews']` and `['company-dashboard']`.
  - Offer creation invalidates `['offers']` and `['company-dashboard']`.
* **Zero Hardcoded Numbers**:
  - All funnel counts (Matched &rarr; Evaluating &rarr; QA Qualified &rarr; Shortlist Ready) update directly whenever backend records transition states.
