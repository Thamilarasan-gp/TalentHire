import { Router } from 'express';
import { EvaluatorModel, EvaluationModel, PayoutModel, buildIdQuery } from '../db/models';

export const evaluatorsRouter = Router();

evaluatorsRouter.get('/', async (req, res) => {
  try {
    const { search, domain } = req.query;
    const query: any = {};

    if (search) {
      const s = String(search);
      query.$or = [
        { fullName: { $regex: s, $options: 'i' } },
        { headline: { $regex: s, $options: 'i' } },
        { currentCompany: { $regex: s, $options: 'i' } },
      ];
    }

    if (domain) {
      query.primaryDomains = { $regex: String(domain), $options: 'i' };
    }

    const evaluators = await EvaluatorModel.find(query).lean();
    return res.json({
      success: true,
      data: evaluators,
      total: evaluators.length,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

evaluatorsRouter.get('/:id', async (req, res) => {
  try {
    const evaluator: any = await EvaluatorModel.findOne(buildIdQuery(req.params.id)).lean();

    if (!evaluator) {
      return res.status(404).json({ success: false, error: 'Evaluator not found in MongoDB Atlas' });
    }

    const [assignments, payouts] = await Promise.all([
      EvaluationModel.find({ evaluatorId: evaluator.id }).lean(),
      PayoutModel.find({ evaluatorId: evaluator.id }).lean(),
    ]);

    return res.json({
      success: true,
      data: {
        ...evaluator,
        assignments,
        payouts,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
