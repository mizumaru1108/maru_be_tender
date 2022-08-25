// The main details needed in the request payload are:

import { PaytabsCurrencyEnum } from '../enums/paytabs-currency-enum';
import { PaytabsTranClass } from '../enums/paytabs-tran-class.enum';
import { PaytabsTranType } from '../enums/paytabs-tran-type.enum';
import { PaytabsCustomerDetailsModel } from './paytabs-customer-details.model';
import { PaytabsPaymentResultModel } from './paytabs-payment-result.model';

/**
 * Paytabs payment request payload model
 * References:
 * https://support.paytabs.com/en/support/solutions/articles/60000709775-transactions-api
 * https://support.paytabs.com/en/support/solutions/articles/60000709777-hosted-payment-page
 */
export class PaytabsPaymentRequestPayloadModel {
  /**
   * Merchant Profile Id
   */
  public profile_id: string;

  /**
   * Item Cost
   */
  public cart_amount: number;

  /**
   * Currency
   */
  public cart_currency: PaytabsCurrencyEnum;

  /**
   * Description
   */
  public cart_description: string;

  /**
   * Unique order reference
   */
  public cart_id: string;

  /**
   *  Either the callback URL (callback) or the return URL (return) for your store
   *  (these URLs will only be used if the transaction required any form of browser redirection)
   */
  public callback: string;

  /**
   * Transaction Type
   */
  public tran_type: PaytabsTranType;

  /**
   * Transaction Class
   */
  public tran_class: PaytabsTranClass;

  /**
   * Framed Hosted Payment Page (actually optional, for some reason i make it required)
   * To display the hosted payment page in an embed frame within the merchant website itself,
   * the following parameter must be passed in the request payload.
   * https://support.paytabs.com/en/support/solutions/articles/60000709777-hosted-payment-page
   */
  public framed: boolean;

  /**
   * Payment Page Language (actually optional, for some reason i make it required)
   * The payment page can support either English (default) or Arabic language.
   * So to create a payment page in the Arabic language you will need to pass
   * the following parameter in your payload.
   * https://support.paytabs.com/en/support/solutions/articles/60000709777-hosted-payment-page
   */
  public hide_shipping: boolean;

  /**
   * Payment Page Language
   * The payment page can support either English (default) or Arabic language.
   * So to create a payment page in the Arabic language you will need to pass the
   * following parameter in your payload.
   */
  public paypage_lang?: string;

  /**
   * optional for annonymous customer
   */
  public customer_details?: PaytabsCustomerDetailsModel;
  public payment_result?: PaytabsPaymentResultModel;

  constructor(
    profile_id: string,
    cart_amount: number,
    cart_currency: PaytabsCurrencyEnum,
    cart_description: string,
    cart_id: string,
    callback: string,
    tran_type: PaytabsTranType,
    tran_class: PaytabsTranClass,
    framed: boolean,
    hide_shipping: boolean,
    customer_details?: PaytabsCustomerDetailsModel,
    payment_result?: PaytabsPaymentResultModel,
  ) {
    this.profile_id = profile_id;
    this.cart_amount = cart_amount;
    this.cart_currency = cart_currency;
    this.cart_description = cart_description;
    this.cart_id = cart_id;
    this.callback = callback;
    this.tran_type = tran_type;
    this.tran_class = tran_class;
    this.framed = framed;
    this.hide_shipping = hide_shipping;
    this.customer_details = customer_details;
    this.payment_result = payment_result;
  }
}
