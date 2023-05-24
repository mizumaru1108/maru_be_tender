/**
 *  Paytabs payment result model
 *  ref: https://support.paytabs.com/en/support/solutions/articles/60000709780-3-2-o-pt2-api-endpoints-own-form-initiating-the-payment-request#Via-Non-3DSecure-Cards
 *  @example
 * "card_details": {
 *    "pan": "4111111111111111",
 *    "cvv": "123",
 *    "expiry_month": 12,
 *    "expiry_year": 2023
 * }
 */
export class PaytabsCardDetailsModel {
  public pan?: string;
  public cvv?: string;
  public expiry_month?: number;
  public expiry_year?: number;

  constructor(
    pan?: string,
    cvv?: string,
    expiry_month?: number,
    expiry_year?: number,
  ) {
    this.pan = pan;
    this.cvv = cvv;
    this.expiry_month = expiry_month;
    this.expiry_year = expiry_year;
  }
}
