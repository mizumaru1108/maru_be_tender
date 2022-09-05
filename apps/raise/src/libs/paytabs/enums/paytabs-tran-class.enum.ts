/**
 * Refrences: https://support.paytabs.com/en/support/solutions/articles/60000709775-transactions-api
 */
export enum PaytabsTranClass {
  /**
   * ECommerce Online Transaction
   * The initial request to create any payment page should be with class "ecom", which indicates to
   * eCommerce asin the code below
   *
   *  "tran_type": "sale",
   *  "tran_class": "ecom",
   *  "tokenise": "2",
   *
   * The parameter "tokenise" is an optional parameter, where you need to pass, only if you want to
   * save a transaction's token, for further usage such as the used one in the recurring requests.
   *
   * The "tokenise" value is per the below table:
   * Value    |  Format
   * ---------------------------
   * 2        |  Hex32
   * 3        |  AlphaNum20
   * 4        |  Digit22
   * 5        |  Digit16
   * 6        |  AlphaNum32
   */
  ECOM = 'Ecom',

  /**
   * Mail Order Telephonic Order Transaction
   * The moto class is meant to be used to process the request/payment with "Non 3DS" and/or "Non CVV".
   *
   * When can I use Moto?
   * - If you have your client's card saved in your database, then using the class "moto" you do not need
   *   to ask your client for their cards information on any future purchase.
   *
   * - If you are a big known business market and since not all people have a 3DS n their card, by using
   *   the class "moto", you can process the request/payment without 3DS.
   *
   * What are the Moto feature requirements?
   * 1. The Moto feature should be enabled on your account (profile) before using it.
   *    Only your account manager can decide if it can be applied to your profile or not.
   * 2. The Moto feature will work in the "Own Form" request only.
   * 3. PCI DSS certification to a minimum of SAQ-D is required to have the moto feature enabled
   *    on your profile.
   */
  MOTO = 'Moto',

  /**
   * Recurring token-based transaction'
   *
   * Tokenization is the process of protecting sensitive data by replacing it with an algorithmically
   * generated number called a token. This can be used to allow returning customers to purchase without
   * re-entering credit card details (recurring) such as monthly subscriptions fees.
   *
   * Once you have the token from the initial payment response, you can do a new request and pass the
   * token number as "token" in case you need to perform recurring action.
   *
   * The recurring (tokenization) feature should be enabled on your account (profile) before using it.
   * You can enable it by sending an email to customercare@paytabs.com
   */
  RECURRING = 'Recurring',
}
