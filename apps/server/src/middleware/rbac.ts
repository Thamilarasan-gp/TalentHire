import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
import { hasPermission, Permission } from '@thamilarasan/auth';

export function requirePermission(permission: Permission) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: role ${req.user.role} lacks permission ${permission}`,
      });
    }

    next();
  };
}

export function enforceTenant(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  // Platform roles can inspect across tenants
  if (
    [
      'PLATFORM_ADMIN',
      'PLATFORM_OPERATIONS',
      'QA_REVIEWER',
      'FINANCE_APPROVER',
      'READ_ONLY_AUDITOR',
    ].includes(req.user.role)
  ) {
    return next();
  }

  // Company roles are locked to their own companyId
  const requestedCompanyId = req.params.companyId || req.body.companyId || req.query.companyId;
  if (requestedCompanyId && req.user.companyId && req.user.companyId !== requestedCompanyId) {
    return res.status(403).json({
      success: false,
      error: 'Tenant isolation violation: Access denied to foreign company resources',
    });
  }

  next();
}
