export interface PaytabsCreateTransactionResponse {
  tran_ref: string; // ex result = 'TST1233710521255';
  tran_type: string; //ex result = 'Sale';
  cart_id: string; //ex result = 'testing';
  cart_description: string; //ex result = 'testing';
  cart_currency: string; //ex result = 'SAR';
  cart_amount: string; //ex result = '1234.00';
  callback: string; //ex result = 'https?://0pnncvgvzj.execute-api.ap-south-1.amazonaws.com/dev/v1/paytabs/callback';
  return: string; //ex result = 'none';
  redirect_url: string; //ex result = 'https?://secure.paytabs.sa/payment/page/59F48AB982E42AE723270525B7713A9F4FB15716A0C9D3ADD97E94B4';
  serviceId: number; //ex result = 2;
  profileId: number; //ex result = 84050;
  merchantId: number; //ex result = 33226;
  trace: string; //ex result = 'PMNT0202.63074FA0.0001CB93';
}
