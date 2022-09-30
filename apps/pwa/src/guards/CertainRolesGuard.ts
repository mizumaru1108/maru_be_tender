import { Role } from './RoleBasedGuard';

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
export const hasAccess = (userRole: Role, requiredRole: Role[]): boolean => {
  if (requiredRole.includes(userRole)) {
    return true;
  }
  return false;
};
