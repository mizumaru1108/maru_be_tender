/**
 * Paytabs shipping details model
 * @example
 * customer_details: {
 *   name: 'wajih last1';
 *   email: 'wajih2@domain.com';
 *   phone: '971555555555';
 *   street1: 'street2';
 *   city: 'dubai';
 *   state: 'DU';
 *   country: 'AE';
 *   ip: '92.98.175.176';
 * };
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
