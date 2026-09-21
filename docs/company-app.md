# THAMILARASAN GLOBAL — Company Web Application Overview

**Brand**: THAMILARASAN GLOBAL  
**Positioning**: FIND. EVALUATE. HIRE.  
**Package**: `apps/company-web`  
**API Integration**: Connected directly to `apps/api` (Express + MongoDB Atlas)

---

## 1. Executive Summary
The **Company Web Application** is a premium enterprise recruitment portal designed specifically for international companies (US, Europe, UK, Asia-Pacific) seeking to hire top 1% Indian software engineering leaders without screening bottlenecks.

The core philosophy is:
* **The Matching Engine only matches**: Uses deterministic hard filters (skills, experience depth, timezone overlap, notice period, budget).
* **The Evaluator only evaluates**: Independent Staff & Principal Architects conduct technical loops and record structured scorecards with QA calibrations.
* **The Company makes the final decision**: The hiring manager conducts the final team fit round and retains complete authority on offers, compensation, and placements.

---

## 2. Core Modules & Workspaces

1. **Public Company Experience (`/company`)**:
   - High-impact standalone welcome landing page answering *"What does THAMILARASAN GLOBAL do for my company?"*.
   - Comparison between traditional recruitment agency churn vs. Thamilarasan Global's verified pipeline.
   - Interactive preview of verified candidate dossiers and structured evaluation criteria.

2. **Self-Serve Registration & Onboarding (`/company/register`, `/company/onboarding`)**:
   - Work email validation ensuring corporate domain authenticity.
   - 6-step interactive onboarding wizard:
     1. General Company Info
     2. Engineering Profile & Timezone
     3. Hiring Target & Role Volume
     4. Hiring Team Members
     5. Corporate Invoicing & NET 30 Terms
     6. Account Verification
   - State persisted in MongoDB Atlas at each step to prevent data loss.

3. **Dynamic Hiring Command Center (`/company/dashboard`)**:
   - 4-Stage visual funnel:
     - `Stage 1: Matched` &rarr; Deterministic hard constraints passed.
     - `Stage 2: Evaluating` &rarr; In progress with conflict-free evaluators.
     - `Stage 3: QA Qualified` &rarr; Calibrated PASS verdicts verified.
     - `Stage 4: Shortlist Ready` &rarr; Recommended Top-N shortlist ready for final company interview.
   - Real-time aggregated metrics from database records.
   - Upcoming scheduled client interviews with direct video room links.
   - Audited recent hiring activity stream.

4. **Requirement Builder & Deterministic Matching (`/company/requirements/new`)**:
   - Requisition creator with configurable rubric criteria weightings (Technical Skills %, Experience %, System Design %, Communication %, Domain %, Availability %) validated to sum to exactly 100%.
   - Automated execution of the matching engine upon submission.

5. **Flagship Decision Shortlists (`/company/shortlists`)**:
   - Deficit-transparent roster: If 10 requested and 7 qualified, explicitly states *"Only 7 candidates currently meet all required criteria"* rather than fabricating candidates.
   - Interactive side-by-side comparison modal for up to 3 candidates.

6. **Candidate Dossiers & Private Notes (`/company/candidates/:id`)**:
   - Comprehensive technical dossier with verified skills and rubric scores.
   - Private company internal notes stored securely in MongoDB Atlas and isolated to the authenticated tenant.

7. **Independent Evaluation Reports (`/company/evaluations/:id`)**:
   - Transparent evidence dossier with PASS, FAIL, or REVIEW_REQUIRED verdicts (never "HIRE").

8. **Interviews, Feedback, Offers & Contracts**:
   - Direct interview scheduling with timezone awareness.
   - Structured post-interview feedback (`PROCEED_TO_OFFER`, `NEXT_ROUND`, `ON_HOLD`, `REJECT`).
   - Formal offer extension with base salary, bonuses, equity, and start dates.

9. **Billing, Guarantees & Placements**:
   - Placement records under the 90-Day Replacement Guarantee ($0 fee replacement).
   - Invoices with NET 30 terms and instant printable PDF statements.
