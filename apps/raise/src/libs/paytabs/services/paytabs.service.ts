import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { PaytabsCreateTransactionResponse } from '../dtos/response/paytabs-create-transaction-response.dto';
import { PaytabsPaymentRequestPayloadModel } from '../models/paytabs-payment-request-payload.model';

@Injectable()
export class PaytabsService {
  constructor(private configService: ConfigService) {}

  async createTransaction(
    paytabsPaymentRequest: PaytabsPaymentRequestPayloadModel,
    serverKey?: string,
  ): Promise<PaytabsCreateTransactionResponse> {
    // console.log('paytabsPaymentRequest', paytabsPaymentRequest);
    let auth: string = '';
    const keyFromEnv = this.configService.get<string>('PAYTABS_SERVER_KEY');

    if (keyFromEnv) {
      auth = keyFromEnv;
    } else if (!keyFromEnv && serverKey) {
      auth = serverKey;
    } else {
      throw new BadRequestException('Wrong Authorization Key');
    }

    const options: AxiosRequestConfig<any> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth,
      },
      data: paytabsPaymentRequest,
      url: 'https://secure.paytabs.sa/payment/request',
    };
    console.debug(`POST ${options.url} using request.body=`, options.data);

    try {
      const data = await axios(options);
      // console.log('data', data);
      return data.data;
    } catch (err) {
      console.error(
        `POST ${options.url} throws error ${err.response.status}: `,
        err.response.data,
      );
      throw new Error(err.response.data.message);
    }
  }
}
