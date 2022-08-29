/**
 * Rerences: https://support.paytabs.com/en/support/solutions/articles/60000709775-transactions-api
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
   * Voiding authorized transaction
   */
  VOID = 'Void',

  /**
   * Refund Transaction of fully captured transaction
   */
  REFUND = 'Refund',
}
