import { Router } from 'express';
import {
  InvoiceModel,
  PayoutModel,
  CompanyModel,
  EvaluatorModel,
  EvaluationModel,
  AuditLogModel,
  buildIdQuery,
} from '../db/models';
import { AuthenticatedRequest, optionalAuth } from '../middleware/auth';
import { createInvoicePaymentOrder } from '../services/razorpay';

export const financeRouter = Router();

financeRouter.get('/invoices', async (req, res) => {
  try {
    const { companyId } = req.query;
    const query: any = {};
    if (companyId) query.companyId = companyId;

    const invoices = await InvoiceModel.find(query).sort({ createdAt: -1 }).lean();
    const enriched = await Promise.all(
      invoices.map(async (inv: any) => {
        const company = await CompanyModel.findOne({ id: inv.companyId }).lean();
        return { ...inv, company };
      })
    );

    return res.json({
      success: true,
      data: enriched,
      total: invoices.length,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

financeRouter.get('/payouts', async (req, res) => {
  try {
    const { evaluatorId, status } = req.query;
    const query: any = {};
    if (evaluatorId) {
      const eid = String(evaluatorId);
      const alt = eid.startsWith('eval-') ? eid.replace('eval-', 'evaluator-') : eid.replace('evaluator-', 'eval-');
      query.evaluatorId = { $in: [eid, alt] };
    }
    if (status) query.status = status;

    const payouts = await PayoutModel.find(query).sort({ createdAt: -1 }).lean();
    const enriched = await Promise.all(
      payouts.map(async (p: any) => {
        const [evaluator, evaluation] = await Promise.all([
          EvaluatorModel.findOne({ id: p.evaluatorId }).lean(),
          EvaluationModel.findOne({ id: p.evaluationId }).lean(),
        ]);
        return { ...p, evaluator, evaluation };
      })
    );

    return res.json({
      success: true,
      data: enriched,
      total: payouts.length,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST Create Razorpay Checkout Order for Invoice
financeRouter.post('/invoices/:id/razorpay-order', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const invoice = await InvoiceModel.findOne(buildIdQuery(req.params.id));

    if (!invoice) {
      return res.status(404).json({ success: false, error: 'Invoice not found in MongoDB Atlas' });
    }

    // Convert USD to INR estimate (e.g. 1 USD ~ 83 INR) for Razorpay Indian Gateway
    const amountInr = Math.round(invoice.amountUsd * 83);
    const order = await createInvoicePaymentOrder(invoice.id, amountInr);

    invoice.razorpayOrderId = order.id;
    await invoice.save();

    return res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST Approve & Disburse Evaluator Payout
financeRouter.post('/payouts/:id/disburse', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const payout = await PayoutModel.findOne(buildIdQuery(req.params.id));

    if (!payout) {
      return res.status(404).json({ success: false, error: 'Payout not found in MongoDB Atlas' });
    }

    payout.status = 'DISBURSED';
    payout.disbursedAt = new Date().toISOString();
    payout.transactionRef = `TXN-RAZORPAY-${Date.now()}`;
    await payout.save();

    await AuditLogModel.create({
      id: `audit-${Date.now()}`,
      action: 'EVALUATOR_PAYOUT_DISBURSED',
      actorId: req.user?.userId || 'admin',
      actorEmail: req.user?.email || 'finance@thamilarasan.global',
      actorRole: req.user?.role || 'SUPER_ADMIN',
      entity: 'EvaluatorPayout',
      entityId: payout.id,
      timestamp: new Date().toISOString(),
      details: { amountInr: payout.amountInr, evaluatorId: payout.evaluatorId },
    });

    return res.json({
      success: true,
      data: payout,
      message: 'Payout disbursed and updated in MongoDB Atlas.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
