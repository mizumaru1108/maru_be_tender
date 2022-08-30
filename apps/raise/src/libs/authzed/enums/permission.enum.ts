/**
 * Feel free to add more, see the refrences on the authzed web, login to the admin page and check the permissions
 * on tmra_staging
 * https://app.authzed.com/organization/otarid/systems/tmra_staging?tab=schema
 */
export enum Permission {
  /**
   * Only Operator and Manager can access this route.
   * will be used to secure the route for the operator and manager.
   */
  OE = 'operator_edit',

  /**
   * Only Operator and Manager can access this route.
   * will be used to secure the route for the operator and manager.
   */
  OV = 'operator_view',

  /**
   * Only Vendor and Manager can access this route.
   * will be used to secure the route for the vendor and manager.
   */
  VE = 'vendor_edit',

  /**
   * Only Vendor and Manager can access this route.
   * will be used to secure the route for the vendor and manager.
   */
  VV = 'vendor_view',

  /**
   * Only Manager can access this route.
   * will be used to secure the route for the manager.
   */
  PM = 'permission_management',
}
