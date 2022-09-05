/**
 *  Paytabs payment result model
 *  ref: https://support.paytabs.com/en/support/solutions/articles/60000709778-managed-form
 *  @example
 *  payment_info: {
 *      card_type: "Credit",
 *      card_scheme: "Visa",
 *      payment_description: "4111 11## #### 1111"
 *      expiryMonth: "04",
 *      expiryYear: "2021",
 *      IssuerCountry: "",
 *      IssuerName: "",
 *  },
 */
export class PaytabsPaymentInfoModel {
  public card_type?: string;
  public card_scheme?: string;
  public payment_description?: string;
  public expiryMonth?: string;
  public expiryYear?: string;
  public IssuerCountry?: string;
  public IssuerName?: string;

  constructor(
    card_type?: string,
    card_scheme?: string,
    payment_description?: string,
    expiryMonth?: string,
    expiryYear?: string,
    IssuerCountry?: string,
    IssuerName?: string,
  ) {
    this.card_type = card_type;
    this.card_scheme = card_scheme;
    this.payment_description = payment_description;
    this.expiryMonth = expiryMonth;
    this.expiryYear = expiryYear;
    this.IssuerCountry = IssuerCountry;
    this.IssuerName = IssuerName;
  }
}
