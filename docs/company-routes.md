# Company Web Application Routes Map

| Route | Type | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `/company` | Public | Unauthenticated | Premium landing experience showcasing value proposition, comparison, and CTAs |
| `/company/login` | Public | Unauthenticated | Corporate authentication portal with work email login and demo switchers |
| `/company/register` | Public | Unauthenticated | Enterprise registration form with work email validation |
| `/company/verify-email` | Public | Unauthenticated | Email domain verification confirmation screen |
| `/company/forgot-password`| Public | Unauthenticated | Corporate password recovery request screen |
| `/company/reset-password` | Public | Unauthenticated | Secure password reset screen |
| `/company/onboarding` | Workspace | Authenticated | 6-step interactive onboarding wizard with backend progress persistence |
| `/company/dashboard` | Workspace | Authenticated | Live hiring operations command center with 4-stage funnel and metrics |
| `/company/requirements` | Workspace | Authenticated | Live requisitions list with openings, matches, and shortlist progress |
| `/company/requirements/new` | Workspace | Authenticated | Multi-section requirement builder with customizable criteria weightings |
| `/company/matches` | Workspace | Authenticated | Candidate discovery pool with detailed match score breakdowns |
| `/company/shortlists` | Workspace | Authenticated | Top-N verified decision shortlist with deficit notice and comparison modal |
| `/company/candidates/:id` | Workspace | Authenticated | Candidate dossier with work history and private company internal notes |
| `/company/evaluations/:id`| Workspace | Authenticated | Independent evaluator scorecard with PASS/FAIL verdicts and evidence |
| `/company/interviews` | Workspace | Authenticated | Scheduled final interview pipeline and scheduling console |
| `/company/feedback` | Workspace | Authenticated | Structured post-interview feedback and hiring decision recorder |
| `/company/offers` | Workspace | Authenticated | Formal offer generation and status tracking |
| `/company/contracts` | Workspace | Authenticated | Onboarding checklists, signed contracts, and background verification |
| `/company/placements` | Workspace | Authenticated | Active engineering placements in production |
| `/company/replacements` | Workspace | Authenticated | 90-Day Placement Guarantee coverage tracker and consultation requests |
| `/company/invoices` | Workspace | Authenticated | Placement billing statements with printable/downloadable PDF generation |
| `/company/team` | Workspace | Authenticated (`COMPANY_ADMIN`) | Organization teammate invitations and RBAC management |
| `/company/analytics` | Workspace | Authenticated | Dynamic conversion analytics and pipeline charts via Recharts |
| `/company/settings` | Workspace | Authenticated | Corporate profile, timezone, security, and billing settings |
| `/company/support` | Workspace | Authenticated | Enterprise priority support ticketing desk with 4-hour SLA |
