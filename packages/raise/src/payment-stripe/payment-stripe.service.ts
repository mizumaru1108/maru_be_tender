import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import axios, { AxiosRequestConfig } from 'axios';
import { rootLogger } from '../logger';
import { Campaign, CampaignDocument } from '../campaign/campaign.schema';
import {
  PaymentGateway,
  PaymentGatewayDocument,
} from './paymentGateway.schema';
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

@Injectable()
export class PaymentStripeService {
  private logger = rootLogger.child({ logger: PaymentStripeService.name });

  constructor(
    @InjectModel(PaymentGateway.name)
    private paymentGatewayModel: mongoose.Model<PaymentGatewayDocument>,
    @InjectModel(Organization.name)
    private organizationModel: mongoose.Model<OrganizationDocument>,
    @InjectModel(Campaign.name)
    private campaignModel: mongoose.Model<CampaignDocument>,
    @InjectModel(Donor.name)
    private donorModel: mongoose.Model<DonorDocument>,
    @InjectModel(DonationLogs.name)
    private donationLogModel: mongoose.Model<DonationLogDocument>,
  ) {}

  async stripeRequest(payment: PaymentRequestDto) {
    this.logger.debug('stripeRequest...');
    let txtMessage = '';
    let stripeCallbackUrl = '';
    let amount = '';
    let donorId = '';

    if (
      !payment.nonprofitUserId ||
      !payment.campaignId ||
      !payment.donorUserId ||
      !payment.donorRealmId ||
      !payment.nonprofitRealmId ||
      // !mongoose.Types.ObjectId.isValid(payment.campaignId) ||
      // !mongoose.isValidObjectId(payment.nonprofitUserId) ||
      // !mongoose.isValidObjectId(payment.donorUserId) ||
      // !mongoose.isValidObjectId(payment.donorRealmId) ||
      // !mongoose.isValidObjectId(payment.nonprofitRealmId) ||
      !payment.paymentMethodType ||
      !payment.type ||
      !payment.amount
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

    const getOrganization = await this.organizationModel.findOne(
      { _id: payment.nonprofitUserId },
      { _id: 1, defaultCurrency: 1 },
    );
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
    }
    console.log('debug', payment.campaignId);

    const getCampaign = await this.campaignModel
      .find({
        _id: payment.campaignId,
      })
      .exec();

    console.log('debug', getCampaign);

    if (!getCampaign) {
      txtMessage = `campaign not found`;
      return {
        statusCode: 514,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: txtMessage,
        }),
      };
    }

    const getSecretKey = await this.paymentGatewayModel.findOne(
      { organizationId: payment.nonprofitUserId },
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
    console.log(payment.donorUserId);
    const ObjectId = require('mongoose').Types.ObjectId;
    const donor = await this.donorModel.findOne({
      // _id: payment.donorUserId,
      email: 'andriamirul+8@gmail.com',
    });

    console.log('email', donor?.email);
    console.log(ObjectId(payment.donorUserId));
    console.log(payment.donorUserId);

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

    // const paymentJson = JSON.parse(JSON.stringify(payment));
    const params = new URLSearchParams();
    // if (donor) {
    //   params.append('customer_email', donor.email);
    // }
    params.append('amount', payment.amount);
    params.append('currency', getOrganization['defaultCurrency']);
    params.append('payment_method_types[]', payment.paymentMethodType);
    console.log(params);
    const options: AxiosRequestConfig<any> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + getSecretKey['apiKey'] + '',
      },
      params,
      url: 'https://api.stripe.com/v1/payment_intents',
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

    // amount = data['data']['amount_total'].toString().slice(0, 2);

    // console.log('amount unit', amount);

    //insert data to donation_log
    let objectIdDonation = new ObjectId();
    let now: Date = new Date();
    donorId = payment.donorUserId;
    const getDonationLog = await new this.donationLogModel({
      _id: objectIdDonation,
      nonprofitRealmId: payment.nonprofitRealmId,
      donorRealmId: payment.donorRealmId,
      amount: payment.amount,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      nonprofitId: payment.nonprofitUserId,
      campaignId: payment.campaignId,
      donorUserId: donorId,
      currency: getOrganization['defaultCurrency'],
      donationStatus: 'PENDING',
      type: payment.type,
      ipAddress: '',
      paymentGatewayId: 'PAYSTRIPE',
      transactionId: data['data']['id'],
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
