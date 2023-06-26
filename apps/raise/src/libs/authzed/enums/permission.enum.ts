/**
 * Feel free to add more, see the refrences on the authzed web, login to the admin page and check the permissions
 * on tmra_staging
 * https://app.authzed.com/organization/otarid/systems/tmra_staging?tab=schema
 */
export enum Permission {
  /**
   * Used for edit and view data that can only be accessed by the operator and manager.
   */
  OE = 'operator_edit',

  /**
   * Used for edit and view data that can only be accessed by the vendor and manager.
   */
  VE = 'vendor_edit',

  /**
   * Only Manager can access this route.
   * Used for GLOBAL EDIT (can edit and view all the data)
   */
  MO = 'manager_only',
  /**
   * Used for Giving Sadakah user (Organization)
   */
  NF = 'nonprofit_only',
  /**
   * Used for Super Admin user (Organization)
   */
  SA = 'super_admin',
}
