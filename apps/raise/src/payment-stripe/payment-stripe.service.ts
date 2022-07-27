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
} from '../organization/schema/organization.schema';
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
import { User, UserDocument } from 'src/user/schema/user.schema';
import { SpanStatusCode, trace } from '@opentelemetry/api';

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
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<UserDocument>,
  ) {}

  async stripeRequest(payment: PaymentRequestDto) {
    const tracer = trace.getTracer('tmra-raise');
    const span = tracer.startSpan('stripe-request', {
      attributes: { 'donor.firstName': '-' },
    });
    try {
      // Do some work here

      this.logger.debug('stripeRequest...');
      let txtMessage = '';
      let stripeCallbackUrl = '';
      // let amount = '';
      // let donorId = '';
      let isAnonymous = false;
      let donor = null;
      // let donorName = '';
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
        // console.log('test');
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

      if (!['GBP', 'SAR'].includes(currency)) {
        txtMessage = 'Bad Request';
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            message: 'Currency must be GBP or SAR',
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
      // if (payment.campaignId) {
      const getCampaign = await this.campaignModel
        .findOne({
          _id: payment.campaignId,
        })
        .exec();

      console.log('debug', getCampaign);
      let dataAmount = parseFloat(payment.quantity); // let's assume it will be multiple by 1 (price)
      if (!getCampaign) {
        txtMessage = `request rejected campaignId not found`;
        return {
          statusCode: 514,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            message: txtMessage,
          }),
        };
      } else if (
        parseFloat(getCampaign.amountProgress.toString()) + dataAmount >
        parseFloat(getCampaign.amountTarget.toString())
      ) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            message: `Ammount is larger than the limit of the target ${getCampaign.amountTarget}`,
          }),
        };
      }
      // }

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
        // console.log('donorid');
        // console.log(payment.donorId);
        if (!ObjectId.isValid(payment.donorId)) {
          donor = await this.userModel.findOne({
            _id: payment.donorId,
          });
          // if (donor) donorName = `${donor.firstname} ${donor.lastname ?? ''}`;
        } else {
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

          span.setAttribute('donor.firstName', donor?.firstName ?? '');

          // if (donor) donorName = `${donor.firstName} ${donor.lastName ?? ''}`;
        }
      }

      // const paymentJson = JSON.parse(JSON.stringify(payment));
      const params = new URLSearchParams();
      if (donor) {
        params.append('customer_email', donor.email);
        // params.append('customer', {'email': donor.email, name: donorName});
        // params.append('customer_name', donorName);
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

      const amountStr = data['data']['amount_total'].toString();
      const amount = amountStr.substring(0, amountStr.length - 2);

      console.log('amount unit', amount);

      //insert data to donation_log
      let objectIdDonation = new ObjectId();
      let now: Date = new Date();
      const getDonationLog = await new this.donationLogModel({
        _id: objectIdDonation,
        nonprofitRealmId: ObjectId(payment.organizationId),
        donorUserId: isAnonymous ? '' : payment.donorId,
        // donorName: donor ? `${donor.firstName} ${donor.lastName}` : null,
        // amount: payment.amount,
        amount: Number(amount),
        createdAt: now,
        updatedAt: now,
        campaignId: ObjectId(payment.campaignId),
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
      // this.logger.debug(isAnonymous.toString);
      if (isAnonymous) {
        // donor.donorLogId = objectIdDonation;
        // donor.save();
        await this.anonymousModel.findOneAndUpdate(
          { _id: payment.donorId },
          { donationLogId: objectIdDonation },
        );
      }
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
    } catch (err) {
      // When we catch an error, we want to show that an error occurred
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err.message,
      });
      throw err;
    } finally {
      // Every span must be ended or it will not be exported
      span.end();
    }
  }

  async stripeCallback(sessionId: String, organizationId: String) {
    const tracer = trace.getTracer('tmra-raise');
    const span = tracer.startSpan('stripe-request', {
      attributes: { 'stripe.ammount': '-' },
    });
    try {
      // Do some work here

      this.logger.debug('stripeCallback...');
      let txtMessage = '';
      //check authorization header

      //check validity of JWT

      //get detail of donors by userId
      //get detail of campaign by campaignId
      //get detail of organization by organizationId

      //insert data to donationLog
      //we can use pattern from favicon function

      // console.debug('event=', event );
      // console.debug('queryStringParameters=', paymentCallbackDto);
      console.debug('session_id=', sessionId);
      console.debug('organizationId=', organizationId);

      if (!sessionId || !organizationId) {
        txtMessage = 'session_id and organizationId is required';
        return {
          statusCode: 400, // bad request
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            message: txtMessage,
          }),
        };
      }

      console.debug('organizationId=', organizationId);

      const ObjectId = require('mongoose').Types.ObjectId;
      const getSecretKey = await this.paymentGatewayModel.findOne(
        { organizationId: ObjectId(organizationId) },
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

      /** Get detail of transaction based on checkout session id */
      // let id = '';
      // id = sessionId;
      const options: AxiosRequestConfig<any> = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getSecretKey.apiKey}`,
        },
        url: 'https://api.stripe.com/v1/checkout/sessions/' + sessionId,
      };

      const data = await axios(options);
      console.log(`GET checkout/sessions/${sessionId}`, data);
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

      //update Payment data (contains callback data)
      const myDate = new Date();
      //custom map
      let paymentStatus = '';
      paymentStatus = 'FAILED';
      if (data['data']['payment_status'] == 'paid') {
        paymentStatus = 'SUCCESS';
      }

      console.log('paymentIntentInfo=', data['data']['payment_intent']);
      const paymentIntent = data['data']['payment_intent'];
      const orderId = data['data']['payment_intent'];
      //get donation log id
      const paymentData = await this.paymentDataModel.findOne({
        orderId: orderId,
      });
      if (!paymentData) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            message: 'Payment data not found',
          }),
        };
      }

      console.log(`paymentData=`, paymentData);
      console.log('donationId=', paymentData.donationId);

      //update payment status in donation_log
      let donationId = paymentData.donationId; //new mongoose.Types.ObjectId(paymentData.donationId);

      console.log(
        'valid object Id ?',
        ObjectId.isValid(paymentData.donationId),
      );
      const updateDonationLog = await this.donationLogModel.updateOne(
        { _id: donationId },
        { donationStatus: paymentStatus },
      );

      console.log(`updateDonationLog=`, updateDonationLog);
      if (!paymentData || !updateDonationLog) {
        return {
          statusCode: 520,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            message: 'incorrect orderId',
          }),
        };
      }

      //get campaign Id
      const getDonationLog = await this.donationLogModel.findOne(
        { _id: paymentData.donationId },
        { _id: 0, campaignId: 1 },
      );

      if (!getDonationLog) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            message: 'Donation log not found',
          }),
        };
      }

      console.log(`getDonationLog`, getDonationLog);
      //get current amountProgress in campaign
      const getCampaign = await this.campaignModel.findOne(
        { _id: getDonationLog.campaignId },
        { _id: 0, amountProgress: 1 },
      );

      if (!getCampaign) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            message: 'Campaign not found',
          }),
        };
      }

      //update  amountProgress with current donation amount
      const amountStr = data.data['amount_total'].toString();
      const lastAmount = (
        Number(getCampaign.amountProgress) +
        Number(amountStr.substring(0, amountStr.length - 2))
      ).toString();

      const updateCampaign = await this.campaignModel.updateOne(
        { _id: getDonationLog.campaignId },
        { amountProgress: Number(lastAmount), updatedAt: myDate.toISOString() },
      );

      const updatePaymentData = await this.paymentDataModel.updateOne(
        { orderId: data.data['payment_intent'] },
        {
          paymentStatus: paymentStatus,
          responseMessage: data.data['payment_status'],
          transactionTime: myDate.toISOString(), //stripe have their own transactionTime
          cardType: 'card',
        },
      );

      if (!updateCampaign || !updatePaymentData) {
        return {
          statusCode: 516,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            message: 'failed inserting transaction data',
          }),
        };
      }

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: 'successful receive callback from stripe',
        }),
      };
    } catch (err) {
      // When we catch an error, we want to show that an error occurred
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err.message,
      });
      throw err;
    } finally {
      // Every span must be ended or it will not be exported
      span.end();
    }
  }
}
