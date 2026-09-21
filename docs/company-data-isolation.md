# Multi-Tenant Data Isolation & Security Architecture

## 1. Zero Trust Tenant Scoping
Every company request entering the backend must pass the `authenticate` middleware. The company context is extracted strictly from the cryptographic JWT claims:
```ts
const companyId = req.user?.companyId;
```
The backend **never trusts** `companyId` passed via query parameters, URL params, or request bodies to dictate authorization.

## 2. Strict Isolation Rules
1. **Private Candidate Notes**:
   - Stored in `CompanyNoteModel` with explicit `{ companyId, candidateId }` indexes.
   - Company A can **never** view or query notes authored by Company B.
   - Any query attempting to access notes across company boundaries will strictly return notes matching `req.user.companyId`.

2. **Shortlist Tenant Verification**:
   - `GET /api/company/shortlists/:id` strictly checks:
     ```ts
     if (shortlist.companyId !== req.user.companyId) {
       return res.status(403).json({ success: false, error: 'Unauthorized access to company shortlist' });
     }
     ```

3. **Reusable Evaluation Sanitization**:
   - When a reusable evaluation is fetched through Quick Match, `sanitizeReusableEvaluation` strips any metadata that could betray the identity of prior commissioning companies, interviewer names, or salary negotiation details.

4. **Audit Trails**:
   - Every sensitive event (candidate invitation, note creation, shortlist generation, offer extension) produces an immutable record in `AuditLogModel` capturing `actorId`, `actorRole`, `companyId`, `action`, and `timestamp`.
