# THAMILARASAN GLOBAL — Company Web API Reference

Base path: `/api/company`

All requests except registration and OAuth callback require `Authorization: Bearer <JWT_TOKEN>`.

---

## 1. Authentication
- `POST /api/auth/register-company`: Registers company, primary admin user, and issues JWT.
- `POST /api/auth/login`: Authenticates company user.
- `GET /api/auth/me`: Retrieves current session profile.

## 2. Company Workspace
- `GET /api/company/me`: Retrieves current company account profile.
- `PATCH /api/company/me`: Updates company settings.
- `GET /api/company/dashboard`: Returns aggregated hiring metrics, distinguishing Quick Match talent from dedicated pipeline applicants.
- `GET /api/company/analytics`: Returns velocity metrics (time-to-interview, evaluation reuse rate) and custom pipeline pass rates.

## 3. Quick Match (Global Evaluated Talent)
- `GET /api/company/quick-match`:
  - Query parameters: `requirementId`, `validity` (`VALID` | `EXPIRED` | `TOP_UP` | `ALL`), `search`, `minScore`.
  - Returns sanitized global evaluated candidate dossiers with matching reasons.
- `GET /api/company/quick-match/:candidateId`: Retrieves sanitized candidate profile and reusable evaluation.
- `POST /api/company/quick-match/:candidateId/invite`: Attaches Quick Match candidate to company's dedicated pipeline (`CandidateApplicationModel`) and increments `reuseCount`.
- `POST /api/company/quick-match/:candidateId/top-up`: Commissions a targeted top-up evaluation for missing secondary skills.

## 4. Dedicated Candidate Pipeline
- `GET /api/company/applications`: Lists company-specific applicants.
- `GET /api/company/applications/:id`: Retrieves application detail with tenant verification.
- `POST /api/company/applications/:id/invite`: Advances applicant status.

## 5. Decision Shortlists
- `GET /api/company/shortlists`: Lists verified shortlists for company requisitions.
- `GET /api/company/shortlists/:id`: Retrieves specific shortlist with candidate rankings, evaluation rubrics, and deficit flags. Strict tenant isolation enforced.

## 6. Candidate Dossiers & Evaluations
- `GET /api/company/candidates/:id`: Retrieves candidate profile, evaluation, private company notes, and interview history.
- `GET /api/company/candidates/:id/reusable-evaluation`: Retrieves sanitized reusable scorecard. Enforces active candidate consent.

## 7. Interviews & Google Calendar Integration
- `GET /api/company/integrations/google/status`: Checks Google Calendar connection.
- `GET /api/company/integrations/google/connect`: Generates OAuth consent URL.
- `GET /api/company/integrations/google/callback`: OAuth token exchange handler.
- `GET /api/company/interviews`: Lists company interviews.
- `POST /api/company/interviews`: Schedules interview, auto-creating Google Meet link if connected.
- `POST /api/company/interviews/:id/feedback`: Records private company decision (`PROCEED_TO_OFFER`, `NEXT_ROUND`, `REJECT`, `ON_HOLD`).

## 8. Offers & Invoices
- `GET /api/company/offers`: Lists extended job offers.
- `POST /api/company/offers`: Generates formal job offer.
- `GET /api/company/invoices`: Lists corporate invoices.
- `GET /api/company/invoices/:id/pdf`: Renders printable corporate PDF invoice.
