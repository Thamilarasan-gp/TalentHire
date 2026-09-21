import { Router } from 'express';
import { CompanyModel, RequirementModel, PlacementModel, buildIdQuery } from '../db/models';

export const companiesRouter = Router();

companiesRouter.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const query: any = {};

    if (search) {
      const s = String(search);
      query.$or = [
        { name: { $regex: s, $options: 'i' } },
        { domain: { $regex: s, $options: 'i' } },
        { city: { $regex: s, $options: 'i' } },
      ];
    }

    const companies = await CompanyModel.find(query).lean();
    return res.json({
      success: true,
      data: companies,
      total: companies.length,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

companiesRouter.get('/:id', async (req, res) => {
  try {
    const company: any = await CompanyModel.findOne(buildIdQuery(req.params.id)).lean();

    if (!company) {
      return res.status(404).json({ success: false, error: 'Company not found in MongoDB Atlas' });
    }

    const [activeRequirements, placementsCount] = await Promise.all([
      RequirementModel.find({ companyId: company.id }).lean(),
      PlacementModel.countDocuments({ companyId: company.id }),
    ]);

    return res.json({
      success: true,
      data: {
        ...company,
        activeRequirements,
        placementsCount,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
