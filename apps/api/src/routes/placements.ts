import { Router } from 'express';
import { PlacementModel, CandidateModel, CompanyModel, RequirementModel } from '../db/models';

export const placementsRouter = Router();

placementsRouter.get('/', async (req, res) => {
  try {
    const { companyId } = req.query;
    const query: any = {};
    if (companyId) query.companyId = companyId;

    const placements = await PlacementModel.find(query).sort({ createdAt: -1 }).lean();

    const enriched = await Promise.all(
      placements.map(async (p: any) => {
        const [candidate, company, requirement] = await Promise.all([
          CandidateModel.findOne({ id: p.candidateId }).lean(),
          CompanyModel.findOne({ id: p.companyId }).lean(),
          RequirementModel.findOne({ id: p.requirementId }).lean(),
        ]);
        return {
          ...p,
          candidate,
          company,
          requirement,
        };
      })
    );

    return res.json({
      success: true,
      data: enriched,
      total: placements.length,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
