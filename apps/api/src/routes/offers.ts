import { Router } from 'express';
import {
  OfferModel,
  CandidateModel,
  PlacementModel,
  InvoiceModel,
  AuditLogModel,
  buildIdQuery,
} from '../db/models';
import { AuthenticatedRequest, optionalAuth } from '../middleware/auth';

export const offersRouter = Router();

offersRouter.get('/', async (req, res) => {
  try {
    const { companyId, candidateId } = req.query;
    const query: any = {};

    if (companyId) query.companyId = companyId;
    if (candidateId) query.candidateId = candidateId;

    const offers = await OfferModel.find(query).sort({ createdAt: -1 }).lean();
    return res.json({
      success: true,
      data: offers,
      total: offers.length,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST Create Offer
offersRouter.post('/', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      requirementId,
      candidateId,
      companyId = req.user?.companyId || 'comp-1',
      annualSalaryUsd = 88000,
      signingBonusUsd = 5000,
      proposedStartDate,
      expiryDate,
      terms = 'Standard 40-hour international remote contract',
    } = req.body;

    const newOffer = await OfferModel.create({
      id: `offer-${Date.now()}`,
      requirementId,
      companyId,
      candidateId,
      annualSalaryUsd: Number(annualSalaryUsd),
      signingBonusUsd: Number(signingBonusUsd),
      proposedStartDate: proposedStartDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      expiryDate: expiryDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'EXTENDED',
      terms,
      extendedAt: new Date().toISOString(),
    });

    await CandidateModel.updateOne(
      { id: candidateId },
      { $set: { state: 'OFFERED' } }
    );

    // Audit log
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: 'OFFER_EXTENDED',
      actorId: req.user?.userId || 'company',
      actorEmail: req.user?.email || 'talent@vanguardfintech.com',
      actorRole: req.user?.role || 'COMPANY_ADMIN',
      entity: 'Offer',
      entityId: newOffer.id,
      timestamp: new Date().toISOString(),
      details: { requirementId, candidateId, annualSalaryUsd },
    });

    return res.status(201).json({
      success: true,
      data: newOffer,
      message: 'Offer extended and saved to MongoDB Atlas.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST Accept Offer (Candidate -> Placed & Invoiced)
offersRouter.post('/:id/accept', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const offer = await OfferModel.findOne(buildIdQuery(req.params.id));

    if (!offer) {
      return res.status(404).json({ success: false, error: 'Offer not found in MongoDB Atlas' });
    }

    offer.status = 'ACCEPTED';
    offer.respondedAt = new Date().toISOString();
    await offer.save();

    // 1. Update Candidate State to PLACED
    await CandidateModel.updateOne(
      { id: offer.candidateId },
      { $set: { state: 'PLACED' } }
    );

    // 2. Generate Placement Record with 90-Day Guarantee
    const startDate = offer.proposedStartDate || new Date().toISOString().split('T')[0];
    const guaranteeEndDate = new Date(new Date(startDate).getTime() + 90 * 86400000).toISOString().split('T')[0];
    const feeAmountUsd = Math.round(offer.annualSalaryUsd * 0.15); // 15% placement success fee

    const placementId = `plc-${Date.now()}`;
    const placement = await PlacementModel.create({
      id: placementId,
      companyId: offer.companyId,
      candidateId: offer.candidateId,
      requirementId: offer.requirementId,
      offerId: offer.id,
      startDate,
      annualSalaryUsd: offer.annualSalaryUsd,
      placementFeePercentage: 15,
      feeAmountUsd,
      status: 'ACTIVE_GUARANTEE',
      guaranteeEndDate,
    });

    // 3. Issue Double-Entry Placement Invoice to Company
    const invoiceId = `inv-${Date.now()}`;
    const invoice = await InvoiceModel.create({
      id: invoiceId,
      companyId: offer.companyId,
      placementId,
      amountUsd: feeAmountUsd,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'ISSUED',
    });

    // 4. Audit Log in Atlas
    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: 'OFFER_ACCEPTED_PLACEMENT_CREATED',
      actorId: req.user?.userId || offer.candidateId,
      actorEmail: req.user?.email || 'karthik.iyer@example.com',
      actorRole: req.user?.role || 'CANDIDATE',
      entity: 'Placement',
      entityId: placementId,
      timestamp: new Date().toISOString(),
      details: { offerId: offer.id, feeAmountUsd, invoiceId, guaranteeEndDate },
    });

    return res.json({
      success: true,
      data: {
        offer,
        placement,
        invoice,
      },
      message: 'Offer accepted! Placement recorded and 15% success fee invoice issued in MongoDB Atlas.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
