import { Router } from 'express';
import { CandidateModel, EvaluationModel, InterviewModel, OfferModel, buildIdQuery } from '../db/models';

export const candidatesRouter = Router();

candidatesRouter.get('/', async (req, res) => {
  try {
    const { search, state, skill, page = '1', limit = '20' } = req.query;
    const query: any = {};

    if (search) {
      const s = String(search);
      query.$or = [
        { fullName: { $regex: s, $options: 'i' } },
        { headline: { $regex: s, $options: 'i' } },
        { primaryRole: { $regex: s, $options: 'i' } },
      ];
    }

    if (state) {
      query.state = state;
    }

    if (skill) {
      query['skills.name'] = { $regex: String(skill), $options: 'i' };
    }

    const p = Math.max(1, parseInt(String(page), 10) || 1);
    const l = Math.max(1, parseInt(String(limit), 10) || 20);

    const [total, candidates] = await Promise.all([
      CandidateModel.countDocuments(query),
      CandidateModel.find(query)
        .skip((p - 1) * l)
        .limit(l)
        .lean(),
    ]);

    return res.json({
      success: true,
      data: candidates,
      total,
      page: p,
      limit: l,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

candidatesRouter.get('/:id', async (req, res) => {
  try {
    const candidate: any = await CandidateModel.findOne(buildIdQuery(req.params.id)).lean();

    if (!candidate) {
      return res.status(404).json({ success: false, error: 'Candidate not found in MongoDB Atlas' });
    }

    const [evaluations, interviews] = await Promise.all([
      EvaluationModel.find({ candidateId: candidate.id }).lean(),
      InterviewModel.find({ candidateId: candidate.id }).lean(),
    ]);

    return res.json({
      success: true,
      data: {
        ...candidate,
        evaluations,
        interviews,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
