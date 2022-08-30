/**
 * Feel free to add more, see the refrences on the authzed web, login to the admin page and check the permissions
 * on tmra_staging
 * https://app.authzed.com/organization/otarid/systems/tmra_staging?tab=schema
 */
export enum AuthzedRelationship {
  /**
   * Manager (Cluster Admin/Super Admin)
   */
  MANAGER = 'manager',

  /**
   * Operator
   */
  OPERATOR = 'operator',

  /**
   * Vendor
   */
  VENDOR = 'vendor',
}
