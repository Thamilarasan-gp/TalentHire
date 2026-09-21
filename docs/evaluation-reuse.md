# Evaluation Reuse & Cost Optimization Tracking

## 1. The Value of Evaluation Reuse
Conducting comprehensive 60-minute technical evaluation loops with senior principal architects is expensive in terms of time, evaluator payouts, and candidate energy.

When an evaluation is **reused**:
1. **Candidate saves 3-5 hours** of redundant technical screening per company.
2. **Hiring Company reduces time-to-first-interview from 14 days to 1.4 days.**
3. **Platform optimizes evaluator capacity**, directing expert attention to candidates requiring initial assessment or targeted top-up loops.

## 2. Tracking Reuse Metrics
Every time a company reviews or invites a candidate through Quick Match, the following telemetry is recorded on `EvaluationModel`:
- `reuseCount`: Total number of companies that have evaluated or invited the candidate based on this assessment.
- `lastReusedAt`: Timestamp of the latest company engagement.
- `companiesUsingEvaluation`: Array of company IDs utilizing the scorecard (anonymized in API outputs to protect client identities).

## 3. Platform Evaluation Decision Matrix
```
Requirement Stack vs Existing Assessment:
├─ All Skills Covered & Evaluation Valid ──> REUSE (Quick Match eligible)
├─ Partial Skills Covered (Delta < 30%) ───> TOP-UP (Commission focused mini-loop)
├─ Core Skills Covered but Expired ───────> REASSESS (Commission fresh loop)
└─ Stack Incompatible ────────────────────> NEW EVALUATION (Dedicated sourcing)
```
