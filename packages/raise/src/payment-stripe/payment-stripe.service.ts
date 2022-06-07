import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import axios, { AxiosRequestConfig } from 'axios';
import { rootLogger } from '../logger';
import { Campaign, CampaignDocument } from '../campaign/campaign.schema';
import {
  PaymentGateway,
  PaymentGatewayDocument,
} from './schema/paymentGateway.schema';
import {
  Organization,
  OrganizationDocument,
} from '../organization/organization.schema';
import {
  DonationLogs,
  DonationLogDocument,
} from '../donor/schema/donation_log.schema';
import { PaymentRequestDto } from './payment-stripe.dto';
import { Donor, DonorDocument } from 'src/donor/schema/donor.schema';
import { PaymentData, PaymentDataDocument } from './schema/paymentData.schema';
import {
  Anonymous,
  AnonymousDocument,
} from 'src/donor/schema/anonymous.schema';

@Injectable()
export class PaymentStripeService {
  private logger = rootLogger.child({ logger: PaymentStripeService.name });

  constructor(
    @InjectModel(PaymentData.name)
    private paymentDataModel: mongoose.Model<PaymentDataDocument>,
    @InjectModel(PaymentGateway.name)
    private paymentGatewayModel: mongoose.Model<PaymentGatewayDocument>,
    @InjectModel(Organization.name)
    private organizationModel: mongoose.Model<OrganizationDocument>,
    @InjectModel(Campaign.name)
    private campaignModel: mongoose.Model<CampaignDocument>,
    @InjectModel(Donor.name)
    private donorModel: mongoose.Model<DonorDocument>,
    @InjectModel(Anonymous.name)
    private anonymousModel: mongoose.Model<AnonymousDocument>,
    @InjectModel(DonationLogs.name)
    private donationLogModel: mongoose.Model<DonationLogDocument>,
  ) {}

  async stripeRequest(payment: PaymentRequestDto) {
    this.logger.debug('stripeRequest...');
    let txtMessage = '';
    let stripeCallbackUrl = '';
    // let amount = '';
    // let donorId = '';
    let isAnonymous = false;
    let donor = null;
    let currency = payment.currency;

    const ObjectId = require('mongoose').Types.ObjectId;
    console.log(payment);
    if (
      !payment.organizationId ||
      !payment.campaignId ||
      !payment.donorId ||
      !ObjectId.isValid(payment.campaignId) ||
      !ObjectId.isValid(payment.organizationId) ||
      !payment.success_url ||
      !payment.cancel_url ||
      !payment.price ||
      !payment.quantity
    ) {
      txtMessage = 'Bad Request';
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: txtMessage,
        }),
      };
    }

    const getOrganization = await this.organizationModel.findOne({
      _id: payment.organizationId,
    });
    console.log('currency', getOrganization?.defaultCurrency);
    if (!getOrganization) {
      txtMessage = `request rejected organizationId not found`;
      return {
        statusCode: 514,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: txtMessage,
        }),
      };
    } else if (!currency) {
      currency = getOrganization['defaultCurrency'];
    }
    console.log('debug', payment.campaignId);
    if (payment.campaignId) {
      const getCampaign = await this.campaignModel
        .find({
          _id: payment.campaignId,
        })
        .exec();

      console.log('debug', getCampaign);
    }

    console.log('debug', payment.organizationId);
    const getSecretKey = await this.paymentGatewayModel.findOne(
      { organizationId: ObjectId(payment.organizationId) },
      { apiKey: 1, _id: 0 },
    );

    if (!getSecretKey) {
      txtMessage = 'organization can not use Stripe Payment Gateway';
      console.log('here');
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

    console.log(getSecretKey['apiKey']);
    //let getUser = new UserModel();
    console.log(payment.donorId);
    if (payment.donorId) {
      donor = await this.donorModel.findOne({
        _id: payment.donorId,
      });

      if (!donor) {
        donor = await this.anonymousModel.findOne({
          _id: payment.donorId,
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
        } else {
          isAnonymous = true;
        }
      }
    }

    // const paymentJson = JSON.parse(JSON.stringify(payment));
    const params = new URLSearchParams();
    if (donor) {
      params.append('customer_email', donor.email);
    }
    params.append('success_url', payment.success_url);
    params.append('cancel_url', payment.cancel_url);
    params.append('line_items[0][price]', payment.price);
    params.append('line_items[0][quantity]', payment.quantity);
    params.append('mode', 'payment');
    params.append('submit_type', 'donate'); //will enable button with label "donate"
    console.log(params);
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
    console.log(data);
    if (!data) {
      return {
        statusCode: 504,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: 'Gateway Timeout or Stripe API down',
        }),
      };
    }

    const amount = data['data']['amount_total'].toString().slice(0, 2);

    console.log('amount unit', amount);

    //insert data to donation_log
    let objectIdDonation = new ObjectId();
    let now: Date = new Date();
    const getDonationLog = await new this.donationLogModel({
      _id: objectIdDonation,
      nonprofitRealmId: ObjectId(payment.organizationId),
      donorUserId: isAnonymous ? null : ObjectId(payment.donorId),
      // donorName: donor ? `${donor.firstName} ${donor.lastName}` : null,
      // amount: payment.amount,
      amount: amount,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      campaignId: payment.campaignId,
      currency: currency,
      donationStatus: 'PENDING',
      // type: payment.type,
      // ipAddress: '',
      // paymentGatewayId: 'PAYSTRIPE',
      // transactionId: data['data']['id'],
    }).save();

    if (!getDonationLog) {
      txtMessage = 'donation failed to save in mongodb';
      return {
        statusCode: 504,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: txtMessage,
        }),
      };
    }

    //insert data to paymentData
    let objectIdPayment = new ObjectId();
    const insertPaymentData = await new this.paymentDataModel({
      _id: objectIdPayment,
      donationId: objectIdDonation,
      merchantId: '',
      payerId: '',
      orderId: data.data['payment_intent'], //payment_intent ID
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
      paymentStatus: 'OPEN',
    }).save();

    console.log(insertPaymentData);

    if (!insertPaymentData) {
      txtMessage = 'payment data failed to save in mongodb';
      return {
        statusCode: 504,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: txtMessage,
        }),
      };
    }

    console.log('debug', data);
    console.log('debug', data['data']['id']);
    stripeCallbackUrl = data['data']['url'];
    txtMessage = `stripe request has been sent`;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        // "Access-Control-Allow-Credentials": true,
      },
      stripeResponse: data['data'],
      message: txtMessage,
    };
  }
}
