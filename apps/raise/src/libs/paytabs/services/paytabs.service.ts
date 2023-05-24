import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { HmacSHA256 } from 'crypto-js';
import { PaytabsCreateTransactionResponse } from '../dtos/response/paytabs-create-transaction-response.dto';
import { PaytabsIpnWebhookResponsePayload } from '../dtos/response/paytabs-ipn-webhook-response-payload.dto';
import { PaytabsPaymentRequestPayloadModel } from '../models/paytabs-payment-request-payload.model';

@Injectable()
export class PaytabsService {
  constructor(private configService: ConfigService) {}

  async verifySignature(
    payload: PaytabsIpnWebhookResponsePayload,
    payloadSignature: string,
    serverKey: string,
  ): Promise<boolean> {
    // hash payload + server key using HmacSHA256 (validate paytabs signature)
    const signature = HmacSHA256(JSON.stringify(payload), serverKey);
    return signature.toString() === payloadSignature;
  }

  async createTransaction(
    paytabsPaymentRequest: PaytabsPaymentRequestPayloadModel,
    serverKey?: string,
    endpointUrl?: string,
  ): Promise<PaytabsCreateTransactionResponse> {
    // console.log('paytabsPaymentRequest', paytabsPaymentRequest);
    let auth = '';
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
      url: endpointUrl
        ? endpointUrl
        : 'https://secure.paytabs.sa/payment/request',
    };
    console.debug(`POST ${options.url} using request.body=`, options.data);

    try {
      const data = await axios(options);

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
