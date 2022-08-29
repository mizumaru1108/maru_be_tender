import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import axios, { AxiosRequestConfig } from 'axios';
import {
  DonationLogs,
  DonationLogDocument,
} from '../../donor/schema/donation_log.schema';
import { PaymentRequestDto } from './payment-paytabs.dto';
import {
  PaymentData,
  PaymentDataDocument,
} from 'src/payment-stripe/schema/paymentData.schema';
import {
  PaymentGateway,
  PaymentGatewayDocument,
} from 'src/payment-stripe/schema/paymentGateway.schema';
import { Donor, DonorDocument } from 'src/donor/schema/donor.schema';
import { PaytabsPaymentRequestPayloadModel } from './models/paytabs-payment-request-payload.model';
import { PaytabsCreateTransactionResponse } from './dtos/response/paytabs-create-transaction-response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentPaytabsService {
  constructor(
    @InjectModel(DonationLogs.name)
    private donationLogModel: mongoose.Model<DonationLogDocument>,
    @InjectModel(Donor.name)
    private donorModel: mongoose.Model<DonorDocument>,
    @InjectModel(PaymentData.name)
    private paymentDataModel: mongoose.Model<PaymentDataDocument>,
    @InjectModel(PaymentGateway.name)
    private paymentGatewayModel: mongoose.Model<PaymentGatewayDocument>,
    private configService: ConfigService,
  ) {}

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

  async paytabsRequest(paymentDto: PaymentRequestDto) {
    const ObjectId = require('mongoose').Types.ObjectId;
    const paymentGateway = await this.paymentGatewayModel.findOne(
      { organizationId: ObjectId('61b4794cfe52d41f557f1acc') }, // Iqam Global (ommar)
    );

    let txtMessage = '';
    let donorId = '';
    let donor = null;

    if (!paymentGateway) {
      txtMessage = 'organization can not use Paytabs Payment Gateway';      
      return {
        statusCode: 404, //resource not found
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: txtMessage,
        }),
      };
    }
    
    if (paymentDto.donorId) {
      donor = await this.donorModel.findOne({
        _id: paymentDto.donorId,
      });

      if (!donor) {
        txtMessage = 'user not found,  donation service is not available';
        return {
          statusCode: 516, //user not found
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            message: txtMessage,
          }),
        };
      }
    }

    //insert data to donationLog
    let objectIdDonation = new ObjectId();
    let now: Date = new Date();
    const donationLog = await new this.donationLogModel({
      _id: objectIdDonation,
      organizationId: paymentDto.organizationId,
      donorId: paymentDto.donorId,
      donorName: donor ? `${donor.firstName} ${donor.lastName}` : null,
      // amount: payment.amount,
      amount: paymentDto.amount,
      createdAt: now,
      updatedAt: now,
      // projectId: projectId,
      campaignId: paymentDto.campaignId,
      donorUserId: donorId,
      currency: paymentDto.currency,
      donationStatus: 'PENDING',
      type: paymentDto.type,
      paymentGatewayId: 'PAYTABS',
      //transactionId: 'null',
      // ipAddress: event.headers['X-Forwarded-For'],
    }).save();
    if (!donationLog) {
      return {
        statusCode: 513, //https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml (512 ~ 599) unassigned
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: `mongodb error`,
        }),
      };
    }
    console.log(donationLog);

    let dataBody = {
      profile_id: paymentGateway.profileId,
      tran_type: 'sale',
      tran_class: 'ecom',
      cart_description: 'Zakat', //event.body.campaignTitle,
      cart_id: 'zakat', //event.body.campaignId,
      cart_currency: 'SAR',
      cart_amount: paymentDto.amount,
      // return: config.paytabs.returnUrl,
      callback: `https://0pnncvgvzj.execute-api.ap-south-1.amazonaws.com/dev/v1/paytabs/callback`, //{tmraPayTabsCallback} // end point to get payment result
      hide_shipping: true,
      //"paypage_lang": "ar"  ==> arabic enable
      framed: true,
      framed_return_top: true,
      framed_return_parent: true,
      customer_details: {},
    };
    if (donor) {
      dataBody.customer_details = {
        //customer detail is necessary if we want to permit donor send moneny without entering address (billing and shipping)
        name: donor.firstName + ' ' + donor.lastName, // case 1 : registered donor (it will be no problem )     case 2: anonymuous donor with quick donate (how ???)
        email: donor.email, //'email@domain.com',
        phone: donor.mobile, //'0522222222',
        street1: donor.address, //'address street',
        city: donor.city, //'dubai',
        state: donor.state,
        country: donor.country, //'AE', Paytabs support only 2 letter country abbreviations https://www.iban.com/country-codes
        zip: donor.zipcode, //'12345',
        // ip: event.headers['X-Forwarded-For'], //'1.1.1.1',
      };
    }
    const options: AxiosRequestConfig<any> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: paymentGateway.serverKey ?? '',
      },
      data: dataBody,
      url: 'https://secure.paytabs.sa/payment/request',
    };
    console.debug(`POST ${options.url} using request.body=`, options.data);

    try {
      const data = await axios(options);
      //update transactionId
      const updateDonationLog = await this.donationLogModel.updateOne(
        { _id: objectIdDonation },
        { transactionId: data.data['tran_ref'] },
      );
      console.log('debug', updateDonationLog);
      //insert data paymentData
      let objectIdPayment = new ObjectId();
      const insertPaymentData = await new this.paymentDataModel({
        _id: objectIdPayment,
        donationId: objectIdDonation,
        merchantId: paymentGateway.profileId,
        payerId: '',
        orderId: data.data['tran_ref'],
        cardType: '',
        cardScheme: '',
        paymentDescription: '',
        expiryMonth: '',
        expiryYear: '',
        responseStatus: '',
        responseCode: '',
        responseMessage: '',
        cvvResult: '',
        avsResult: '',
        transactionTime: '',
        paymentStatus: 'PENDING',
      }).save();
      console.log(insertPaymentData);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          // "Access-Control-Allow-Credentials": true,
        },
        paytabsResponse: data.data,
        message: 'paytabs request has been sen',
      };
    } catch (err) {
      console.error(
        `POST ${options.url} throws error ${err.response.status}: `,
        err.response.data,
      );
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          // "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          status: 500,
          message: err.response.data.message,
          event: {
            status: err.response.status,
            ...err.response.data,
          },
        }),
      };
    }
  }
}
