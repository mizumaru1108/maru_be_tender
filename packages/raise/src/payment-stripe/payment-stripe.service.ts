import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios, { AxiosRequestConfig } from 'axios';
import { rootLogger } from '../logger';
import {
  PaymentGateway,
  PaymentGatewayDocument,
} from './paymentGateway.schema';
import { PaymentRequestDto } from './payment-stripe.dto';

@Injectable()
export class PaymentStripeService {
  private logger = rootLogger.child({ logger: PaymentStripeService.name });

  constructor(
    @InjectModel(PaymentGateway.name)
    private paymentGatewayModel: Model<PaymentGatewayDocument>,
  ) {}

  async stripeRequest(payment: PaymentRequestDto) {
    this.logger.debug('stripeRequest...');
    const paymentJson = JSON.parse(JSON.stringify(payment));
    const params = new URLSearchParams();
    params.append('success_url', payment.success_url);
    params.append('cancel_url', payment.cancel_url);
    params.append('line_items[0][price]', payment.price);
    params.append('line_items[0][quantity]', payment.quantity);
    params.append('mode', 'payment');
    params.append('submit_type', 'donate'); //will enable button with label "donate"

    let txtMessage = '';
    let stripeCallbackUrl = '';
    const organizationId = payment.organizationId;

    if (organizationId) {
      // connectMongo();
      let getSecretKey = await this.paymentGatewayModel.findOne(
        {
          organizationId: organizationId,
        },
        { apiKey: 1, _id: 0 },
      );

      if (!getSecretKey) {
        txtMessage = 'organization can not use Stripe Payment Gateway';
      } else {
        console.log(getSecretKey['apiKey']);

        const options: AxiosRequestConfig<any> = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + getSecretKey['apiKey'] + '',
          },
          params,
          url: 'https://api.stripe.com/v1/checkout/sessions',
        };

        const data = await axios(options);
        if (data['status'] == 200) {
          console.log('debug', data['data']['id']);
          console.log('debug', data);
          stripeCallbackUrl = data['data']['url'];
          txtMessage = `stripe request has been sent`;
        } else {
          txtMessage = data['statusText'];
        }
      }
      // disconnectMongo();

      //check authorization header

      //check validity of JWT

      //get detail of donors by userId
      //get detail of campaign by campaignId
      //get detail of organization by organizationId

      //insert data to donationLog
      //we can use pattern from favicon function
    } else {
      txtMessage = `request rejected `;
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        // "Access-Control-Allow-Credentials": true,
      },
      body: {
        message: txtMessage,
        body: paymentJson,
        data: stripeCallbackUrl,
      },
    };
  }
}
