import { PaytabsCustomerDetailsModel } from '../../models/paytabs-customer-details.model';
import { PaytabsPaymentInfoModel } from '../../models/paytabs-payment-info.model';
import { PaytabsPaymentResultModel } from '../../models/paytabs-payment-result.model';

export interface PaytabsIpnWebhookResponsePayload {
  tran_ref: string; // ex: "TST2100600035019",
  cart_id: string; // ex: "cart_11111",
  cart_description: string; // ex: "Description of the items/services",
  cart_currency: string; // ex: "AED",
  cart_amount: string; // ex: "12.3",
  tran_currency: string; // ex: "AED",
  tran_total: string; // ex: "12.30",
  payment_result: PaytabsPaymentResultModel;
  payment_info: PaytabsPaymentInfoModel;
  customer_details?: PaytabsCustomerDetailsModel;
  shipping_details?: PaytabsCustomerDetailsModel;
}
