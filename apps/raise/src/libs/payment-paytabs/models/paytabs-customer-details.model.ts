/**
 * Paytabs customer details model
 * Refrences:
 * https://support.paytabs.com/en/support/solutions/articles/60000709778-managed-form
 * @example
 * customer_details: {
 *     name: "Aliaa AHmed",
 *     email: "aliaa@paytabs.com",
 *     phone: "01000002801",
 *     street1: "st1 near st2",
 *     city: "Cairo",
 *     state: "Cairo",
 *     country: "EG",
 *     zip: "12345",
 *     ip: "196.219.200.200"
 * },
 */
export class PaytabsCustomerDetailsModel {
  public name: string;
  public email: string;
  public phone: string;
  public street1: string;
  public city: string;
  public state: string;
  public country: string;
  public zip?: string;
  public ip?: string;

  constructor(
    name: string,
    email: string,
    phone: string,
    street1: string,
    city: string,
    state: string,
    country: string,
    zip?: string,
    ip?: string,
  ) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.street1 = street1;
    this.city = city;
    this.state = state;
    this.country = country;
    this.zip = zip;
    this.ip = ip;
  }
}
