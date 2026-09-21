# Reusable Evaluations Architecture & Data Isolation

## 1. Dual-Layer Evaluation Architecture
To protect tenant privacy while maximizing hiring speed, evaluations are segregated into two distinct layers:

### Layer A: Reusable Evaluation (Global Sharing Layer)
Contains only sanitized, non-confidential technical evidence:
- Primary technical skill rubrics (Problem Solving, System Design, Concurrency, Architecture)
- General verified strengths
- General technical concerns
- Evaluation date and expiry timestamp
- Covered skill taxonomy
- Independent QA verification status

### Layer B: Company-Specific Evaluation (Tenant Isolated Layer)
Strictly private to the commissioning organization:
- Requisition-specific notes and requirements
- Internal company interview notes and hiring comments
- Compensation negotiations and internal rejection reasons
- Evaluator discussion regarding company-specific codebases or proprietary architectures

```
┌────────────────────────────────────────────────────────┐
│               LAYER A: REUSABLE EVALUATION             │
│  (Sanitized: Technical Rubrics, Skills, QA Calibrated)  │
│  Visible to: Multiple verified companies with consent  │
└───────────────────────────┬────────────────────────────┘
                            │
            STRICT SECURITY FIREWALL (TENANT BARRIER)
                            │
┌───────────────────────────▼────────────────────────────┐
│          LAYER B: COMPANY-SPECIFIC EVALUATION          │
│   (Internal Notes, Rejection Reasons, Private Hiring)  │
│  Visible to: Commissioning Company ONLY (Tenant Scoped)│
└────────────────────────────────────────────────────────┘
```

## 2. Evaluation Validity & Expiry State Machine
Evaluations are never treated as permanently valid. Technology stacks and candidate capabilities evolve:
- **`VALID`**: Evaluated within the last 6 months, QA calibrated, active consent. Eligible for Quick Match.
- **`EXPIRING`**: Within 30 days of the 6-month validity horizon.
- **`EXPIRED`**: Over 6 months old. Quick Match surfaces candidate with an "Evaluation Expired" badge and a CTA to request fresh assessment.
- **`REASSESSMENT_REQUIRED`**: QA audit detected discrepancy or candidate updated primary tech stack.
- **`SUSPENDED`**: Fraud flag or temporary hold on profile.

## 3. Candidate Consent States
- **`ACTIVE`**: Candidate authorizes platform to share reusable scorecards with verified global hiring partners.
- **`WITHDRAWN`**: Candidate revokes evaluation reuse. Reusable profile is immediately hidden from Quick Match without deleting historical company-specific placement records.
- **`PENDING`**: Initial onboarding verification in progress.
