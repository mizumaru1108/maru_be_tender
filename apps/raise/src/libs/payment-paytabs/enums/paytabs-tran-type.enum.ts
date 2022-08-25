/**
 * Rerences: https://support.paytabs.com/en/support/solutions/articles/60000709775-transactions-api
 */
export enum PaytabsTranType {
  /**
   * Purchase Transaction
   */
  SALE = 'sale',

  /**
   * Transaction in auth and capture mode
   */
  AUTH = 'auth',

  /**
   * Capturing authorized transaction
   */
  CAPTURE = 'capture',

  /**
   * Voiding authorized transaction
   */
  VOID = 'void',

  /**
   * Refund Transaction of fully captured transaction
   */
  REFUND = 'refund',
}
