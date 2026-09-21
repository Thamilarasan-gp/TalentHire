# Quick Match: Global Evaluated Talent Pool

## 1. What Quick Match Means
Quick Match grants companies immediate access to pre-evaluated software engineers in the global THAMILARASAN GLOBAL talent pool. Candidates who previously proved their technical proficiency in an independent evaluation loop do not need to repeat the entire technical assessment simply because another company is hiring for the same stack.

## 2. Reusability Decision Tree
Before a candidate appears in Quick Match, the engine evaluates 6 strict gates:

```
Step 1: Hard Requirements Check
        (Mandatory skills, min experience, max notice period, budget ceiling, fraud clear)
        ├─ Failed ──> EXCLUDE from Quick Match
        └─ Passed ──> Continue
Step 2: Existing Evaluation Check
        ├─ None ────> Direct to dedicated sourcing
        └─ Exists ──> Continue
Step 3: Reusability Scope Check
        ├─ COMPANY_SPECIFIC ──> Exclude from global reuse
        └─ REUSABLE ─────────> Continue
Step 4: Validity & Expiry Check
        ├─ Expired (expiresAt < now) ──> Tag EXPIRED (CTA: Request fresh evaluation)
        └─ Valid (expiresAt > now) ───> Continue
Step 5: Candidate Reuse Consent Check
        ├─ WITHDRAWN ──> Strictly exclude (privacy firewall)
        └─ ACTIVE ─────> Continue
Step 6: Skill Coverage Check
        ├─ Full Stack Covered ───> QUICK MATCH ELIGIBLE
        └─ Partial Skills Missing ─> TOP-UP REQUIRED
```

## 3. Direct Interview Action
When a company selects a Quick Match candidate:
- The company is **NOT** forced through an evaluator workflow.
- The company directly schedules a final company culture / architectural fit interview.
- A `CandidateApplication` record is created with `source: 'COMPANY_INVITATION'`, and the reusable evaluation's `reuseCount` is incremented.

## 4. Targeted Top-Up Evaluations
If the candidate's existing evaluation covers Node.js, TypeScript, and AWS, but the hiring company also requires Kafka and payment systems:
- The system offers **"Request Targeted Top-Up Evaluation"**.
- A focused 30-minute loop is commissioned exclusively on the delta skills.
- The platform never forces the candidate to repeat core skills already verified.
