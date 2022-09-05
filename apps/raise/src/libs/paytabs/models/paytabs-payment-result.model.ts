import { PaytabsResponseStatus } from '../enums/paytabs-response-status.enum';

/**
 *  Paytabs payment result model
 *  ref: https://support.paytabs.com/en/support/solutions/articles/60000709778-managed-form
 *  @example
 *  payment_result: {
 *      response_status: "A",
 *      response_code: "G92939",
 *      response_message: "Authorised",
 *      cvv_result: " ",
 *      avs_result: " ",
 *      transaction_time: "2021-04-14T09:35:39Z"
 *  },
 */
export class PaytabsPaymentResultModel {
  /**
   * make all properties optional for now, refactor implements after we get the result from paytabs
   */
  public response_status?: PaytabsResponseStatus;
  public response_code?: string;
  public response_message?: string;
  public cvv_result?: string;
  public avs_result?: string;
  public transaction_time?: string;

  constructor(
    response_status?: PaytabsResponseStatus,
    response_code?: string,
    response_message?: string,
    cvv_result?: string,
    avs_result?: string,
    transaction_time?: string,
  ) {
    this.response_status = response_status;
    this.response_code = response_code;
    this.response_message = response_message;
    this.cvv_result = cvv_result;
    this.avs_result = avs_result;
    this.transaction_time = transaction_time;
  }
}
