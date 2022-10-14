import { FusionAuthRoles } from '../@types/commons';

/**
 * @Author (RDanang, Iyoy!)
 * Certain Roles Guard
 * @param userRole Current user roles
 * @param requiredRole Required roles
 * @returns {boolean} if user has required roles
 *
 * @example
 * {hasAccess(tender_project_manager, [tender_project_manager, tender_finance]) && <Component />}
 */
export const hasAccess = (userRole: FusionAuthRoles, requiredRole: FusionAuthRoles[]): boolean => {
  if (requiredRole.includes(userRole)) {
    return true;
  }
  return false;
};
