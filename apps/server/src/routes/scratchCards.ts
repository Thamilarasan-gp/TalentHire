import { Router } from 'express';
import { ScratchCardModel, PayoutModel, buildIdQuery } from '../db/models';
import { AuthenticatedRequest, optionalAuth } from '../middleware/auth';

export const scratchCardsRouter = Router();

// GET /api/scratch-cards/my-cards - Evaluator fetches their scratch cards
scratchCardsRouter.get('/my-cards', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const evaluatorId = req.query.evaluatorId ? String(req.query.evaluatorId) : 'eval-1';
    let cards = await ScratchCardModel.find({ evaluatorId }).sort({ createdAt: -1 }).lean();

    // If no cards exist yet, seed a fun sample card so evaluator can test the scratch interaction immediately!
    if (cards.length === 0) {
      const demoCard = await ScratchCardModel.create({
        id: `sc-${Date.now().toString().slice(-6)}`,
        evaluatorId,
        evaluationId: 'eval-sample-1',
        candidateId: 'cand-demo',
        candidateName: 'Candidate (Evaluation Completed)',
        rewardAmountInr: Math.floor(Math.random() * 15) + 5, // random ₹5 to ₹19
        isScratched: false,
        triggerReason: 'CANDIDATE_NOT_PASSED_HONORARIUM',
      });
      cards = [demoCard.toObject()];
    }

    const unscratchedCount = cards.filter((c: any) => !c.isScratched).length;
    const totalScratchedEarnings = cards
      .filter((c: any) => c.isScratched)
      .reduce((sum: number, c: any) => sum + (c.rewardAmountInr || 0), 0);

    return res.json({
      success: true,
      data: {
        cards,
        unscratchedCount,
        totalScratchedEarnings,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/scratch-cards/:id/scratch - Rub / scratch card to claim reward
scratchCardsRouter.post('/:id/scratch', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const card = await ScratchCardModel.findOne(buildIdQuery(req.params.id));
    if (!card) {
      return res.status(404).json({ success: false, error: 'Scratch card not found' });
    }

    if (card.isScratched) {
      return res.json({
        success: true,
        alreadyScratched: true,
        rewardAmountInr: card.rewardAmountInr,
        message: `Card already scratched! Reward: ₹${card.rewardAmountInr}`,
      });
    }

    card.isScratched = true;
    card.scratchedAt = new Date().toISOString();
    await card.save();

    // Create an instant micro-payout entry
    await PayoutModel.create({
      id: `payout-sc-${Date.now().toString().slice(-6)}`,
      evaluatorId: card.evaluatorId,
      evaluationId: card.evaluationId,
      amountInr: card.rewardAmountInr,
      status: 'DISBURSED',
      disbursedAt: new Date().toISOString(),
      transactionRef: `IMPS-SCRATCH-${Date.now()}`,
    });

    return res.json({
      success: true,
      rewardAmountInr: card.rewardAmountInr,
      message: `🎉 You scratched and won ₹${card.rewardAmountInr}! Deposited into your evaluator wallet.`,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
