# Company Role-Based Access Control (RBAC) & Tenant Isolation

---

## 1. Company Roles Matrix

| Feature / Operation | `COMPANY_ADMIN` | `COMPANY_RECRUITER` | `COMPANY_HIRING_MANAGER` |
| :--- | :---: | :---: | :---: |
| **View Dashboard & Metrics** | Full Access | Full Access | Full Access |
| **Create Requirements** | Yes | Yes | Read Only |
| **Browse Matching Pool** | Yes | Yes | Yes |
| **Inspect Decision Shortlists** | Yes | Yes | Yes |
| **Compare Candidates Side-by-Side** | Yes | Yes | Yes |
| **View Candidate Dossiers & Rubrics**| Yes | Yes | Yes |
| **Record Private Company Notes** | Yes | Yes | Yes |
| **Schedule Interviews** | Yes | Yes | Yes |
| **Submit Post-Interview Feedback** | Yes | Yes | Yes |
| **Generate & Extend Job Offers** | Yes | Yes | Review Only |
| **View Billing & Invoices** | Full Access | Hidden / Restricted | Hidden / Restricted |
| **Download PDF Invoices** | Yes | No | No |
| **Invite / Remove Team Members** | Yes | No | No |
| **Configure Company Settings** | Yes | No | No |
| **Submit Priority Support Tickets** | Yes | Yes | Yes |

---

## 2. Strict Tenant Isolation Rules

Tenant isolation is strictly enforced at the database and middleware layers:

1. **Authentication Token Verification**:
   - Every request extracts `req.user.companyId` from the cryptographically signed JWT.
2. **Scoping All Queries**:
   - All Mongoose queries filter explicitly:
     ```typescript
     Model.find({ companyId: req.user.companyId })
     ```
   - No company user can ever supply an arbitrary `companyId` in the body or query params to read another organization's records.
3. **Private Notes Isolation**:
   - Private candidate notes in `CompanyNoteModel` are keyed on `{ companyId, candidateId }`.
   - Company A can never view notes written by Company B on the same candidate.
4. **Immutable Audit Trails**:
   - Every mutating action records an audit log in `AuditLogModel` tagged with `actorId`, `actorRole`, `entity`, and `timestamp`.
