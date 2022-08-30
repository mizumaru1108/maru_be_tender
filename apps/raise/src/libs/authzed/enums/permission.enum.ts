export enum Permission {
  /**
   * Only Operator and Manager can access this route.
   */
  OE = 'operator_edit',

  /**
   * Only Operator and Manager can access this route.
   */
  OV = 'operator_view',

  /**
   * Only Vendor and Manager can access this route.
   */
  VE = 'vendor_edit',

  /**
   * Only Vendor and Manager can access this route.
   */
  VV = 'vendor_view',

  /**
   * Only Manager can access this route.
   */
  PM = 'permission_management',
}
