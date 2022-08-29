/**
 * Rerences: 
 * https://support.paytabs.com/en/support/solutions/articles/60000709775-transactions-api
 * https://support.paytabs.com/en/support/solutions/articles/60000711310-what-is-the-tran-type-transaction-type-
 */
export enum PaytabsTranType {
  /**
   * Purchase Transaction
   */
  SALE = 'Sale',

  /**
   * Transaction in auth and capture mode
   */
  AUTH = 'Auth',

  /**
   * Capturing authorized transaction
   */
  CAPTURE = 'Capture',

  /**
   * Register
   */
  REGISTER = 'Register',

  /**
   * Voiding authorized transaction
   */
  VOID = 'Void',

  /**
   * Refund Transaction of fully captured transaction
   */
  REFUND = 'Refund',
}
