/**
 * Refrences: https://support.paytabs.com/en/support/solutions/articles/60000709775-transactions-api
 */
export enum PaytabsTranClass {
  /**
   * ECommerce Online Transaction
   */
  ECOM = 'ecom',

  /**
   * Mail Order Telephonic Order Transaction
   */
  MOTO = 'moto',

  /**
   * Recurring token-based transaction
   */
  RECURRING = 'recurring',
}
