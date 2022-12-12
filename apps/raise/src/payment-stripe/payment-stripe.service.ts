import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import axios, { AxiosRequestConfig } from 'axios';
import { ROOT_LOGGER } from '../libs/root-logger';
import { Campaign, CampaignDocument } from '../campaign/schema/campaign.schema';
import { DonationType } from '../donor/enum/donation-type.enum'

import {
  Organization,
  OrganizationDocument,
} from '../organization/schema/organization.schema';

import { PaymentRequestDto } from './payment-stripe.dto';
import { Donor, DonorDocument } from 'src/donor/schema/donor.schema';

import { User, UserDocument } from 'src/user/schema/user.schema';
import { SpanStatusCode, trace } from '@opentelemetry/api';
import {
  Notifications,
  NotificationsDocument,
} from 'src/organization/schema/notifications.schema';
import {
  NotificationSettings,
  NotificationSettingsDocument,
} from 'src/organization/schema/notification_settings.schema';
import { EmailService } from '../libs/email/email.service';
import { PaymentRequestCartDto } from './dto';
import {
  DonationLogs,
  DonationLogsDocument,
} from '../donation/schema/donation_log.schema';
import {
  DonationLog,
  DonationLogDocument,
} from '../donation/schema/donation-log.schema';
import {
  PaymentData,
  PaymentDataDocument,
} from '../donation/schema/paymentData.schema';
import {
  PaymentGateway,
  PaymentGatewayDocument,
} from '../donation/schema/paymentGateway.schema';
import { ZakatLog, ZakatLogDocument } from '../zakat/schemas/zakat_log.schema';
import { Anonymous, AnonymousDocument } from '../donor/schema/anonymous.schema';
import { SendEmailDto } from '../libs/email/dtos/requests/send-email.dto';

@Injectable()
export class PaymentStripeService {
  private readonly logger = ROOT_LOGGER.child({
    logger: PaymentStripeService.name,
  });

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
    private donationLogsModel: mongoose.Model<DonationLogsDocument>,
    @InjectModel(DonationLog.name)
    private donationLogModel: mongoose.Model<DonationLogDocument>,
    @InjectModel(Notifications.name)
    private notificationsModel: mongoose.Model<NotificationsDocument>,
    @InjectModel(NotificationSettings.name)
    private notifSettingsModel: mongoose.Model<NotificationSettingsDocument>,
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<UserDocument>,
    @InjectModel(ZakatLog.name)
    private readonly zakatModel: mongoose.Model<ZakatLogDocument>,
    private readonly emailService: EmailService,
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
      let donorName = '';
      let currency = payment.currency;

      const ObjectId = require('mongoose').Types.ObjectId;
      if (
        !payment.organizationId ||
        !payment.campaignId ||
        !payment.donorId ||
        !ObjectId.isValid(payment.campaignId) ||
        !ObjectId.isValid(payment.organizationId) ||
        !payment.success_url ||
        !payment.cancel_url ||
        !payment.price ||
        !payment.amount ||
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

      if (!['GBP', 'SAR', 'USD'].includes(currency)) {
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
      // console.log('debug', payment.campaignId);
      // if (payment.campaignId) {
      const getCampaign = await this.campaignModel
        .findOne({
          _id: payment.campaignId,
        })
        .exec();

      //console.log('debug', getCampaign);
      // let dataAmount = payment.amount * parseFloat(payment.quantity); // let's assume it will be multiple by 1 (price)
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
        parseFloat(getCampaign.amountProgress.toString()) + payment.amount >
        parseFloat(getCampaign.amountTarget.toString())
      ) {
        //console.log(getCampaign.amountProgress.toString());
        //console.log(payment.amount.toString());
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            message: `Amount is larger than the limit of the target ${getCampaign.amountTarget}`,
          }),
        };
      }
      // }
      //console.log('debug', payment.organizationId);
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

      //console.log(getSecretKey['apiKey']);
      //let getUser = new UserModel();
      //console.log(payment.donorId);
      if (payment.donorId) {
        // console.log('donorid');
        // console.log(payment.donorId);
        if (!ObjectId.isValid(payment.donorId)) {
          donor = await this.userModel.findOne({
            _id: payment.donorId,
          });
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
          // donorName = `${donor?.firstName ? donor?.lastName : ''} ${donor?.lastName ? donor?.lastName : ''}`;
          // if (donor) donorName = `${donor.firstName} ${donor.lastName ?? ''}`;
        }
      }

      // if(donor && donor?.firstName );
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

      const amountStr = data['data']['amount_total'].toString();
      const amount = amountStr.substring(0, amountStr.length - 2);

      //console.log('amount unit', amount);
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

      //console.log(insertPaymentData);

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

      //console.log('debug', data);
      //console.log('debug', data['data']['id']);
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

      //console.debug('organizationId=', organizationId);
      const ObjectId = require('mongoose').Types.ObjectId;
      const getOrganization = await this.organizationModel.findOne({
        _id: ObjectId(organizationId),
      });
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
      // const paymentIntent = data['data']['payment_intent'];
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

      let donationId = paymentData.donationId;
      const getDonationLog = await this.donationLogModel.findOne(
        {
          _id: donationId,
        },
        {
          _id: 1,
          campaignId: 1,
          currency: 1,
          amount: 1,
          donorUserId: 1,
        },
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
        { _id: 0, amountProgress: 1, amountTarget: 2, title: 3 },
      );

      if (!getCampaign) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            message: 'Campaign not found',
          }),
        };
      }

      console.log('Get donorId', donationId);

      // Get Donor Data
      const donor = await this.userModel.findOne(
        { _id: getDonationLog.donorId },
        {
          _id: 0,
          firstName: 1,
          lastName: 2,
          email: 3,
        },
      );

      console.log('DONOR=>', donor);

      // Get Anonymous Data
      let anonymousData;
      if (!donor) {
        anonymousData = await this.anonymousModel.findOne(
          // { _id: new ObjectId(donationId) },
          { donationLogId: getDonationLog._id },
          {
            _id: 0,
            isEmailChecklist: 1,
            anonymous: 2,
            email: 3,
            firstName: 4,
            lastName: 5,
          },
        );
      }

      console.log('Anonymous Data', anonymousData);

      let now: Date = new Date();
      if (paymentStatus == 'SUCCESS') {
        const updateDonationLog = await this.donationLogModel.updateOne(
          { _id: donationId },
          { donationStatus: paymentStatus, updatedAt: now },
        );

        //console.log(`updateDonationLog=`, updateDonationLog);
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

        //update  amountProgress with current donation amount
        const amountStr = data.data['amount_total'].toString();
        const lastAmount = (
          Number(getCampaign.amountProgress) +
          Number(amountStr.substring(0, amountStr.length - 2))
        ).toString();

        const notifSettings = await this.notifSettingsModel.findOne({
          organizationId: ObjectId(organizationId),
        });

        // console.log('orgs & Log Notif=>', notifSettings, '=>', getOrganization);
        if (getOrganization && notifSettings) {
          this.logger.debug(`notification settings ${notifSettings.id}`);
          const subject = `New Donation For ${getCampaign.title}`;
          const donorName = donor
            ? `${donor.firstname} ${donor.lastname}`
            : anonymousData
            ? anonymousData.anonymous
              ? 'anonymous'
              : `${anonymousData.firstName} ${anonymousData.lastName}`
            : 'anonymous';
          if (notifSettings.newDonation) {
            const emailDataContext = {
              donor: donorName,
              title: getCampaign.title,
              currency: getDonationLog.currency,
              amount: getDonationLog.amount,
            };

            const baseEmailDto = {
              subject: subject,
              mailType: 'template' as 'template' | 'plain',
              templatePath: 'org/new_donation',
              templateContext: {
                ...emailDataContext,
              },
            };

            // send email to organization
            const emailToOrg: SendEmailDto = {
              to: getOrganization.contactEmail,
              ...baseEmailDto,
            };
            this.emailService.sendMail(emailToOrg);

            if (donor) {
              const emailToDonor: SendEmailDto = {
                to: donor.email,
                ...baseEmailDto,
              };
              // send email to donor
              this.emailService.sendMail(emailToDonor);
            }

            if (anonymousData) {
              if (anonymousData.isEmailChecklist || !anonymousData.anonymous) {
                const emailToAnnonymous: SendEmailDto = {
                  to: anonymousData.email,
                  ...baseEmailDto,
                };

                // send email to annonymous
                this.emailService.sendMail(emailToAnnonymous);
              }
            }
          }
        } else {
          this.logger.debug(`notification settings not found`);
        }

        const updateCampaign = await this.campaignModel.updateOne(
          { _id: getDonationLog.campaignId },
          {
            amountProgress: Number(lastAmount),
            updatedAt: myDate.toISOString(),
          },
        );

        if (!updateCampaign) {
          return {
            statusCode: 516,
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
              message: 'failed update campaign data',
            }),
          };
        } else if (
          (Number(getCampaign.amountTarget) == Number(lastAmount)) ||
          (Number(lastAmount) > Number(getCampaign.amountTarget))
        ) {
          await this.campaignModel.updateOne(
            { _id: getDonationLog.campaignId },
            {
              isFinished: 'Y',
            },
          );

          this.notificationsModel.create({
            organizationId: new ObjectId(organizationId),
            type: 'general',
            createdAt: new Date(),
            title: 'Campaign is completed',
            body: `Alhamdulillah, amount target of the campaign ${getCampaign.title} is completed...`,
            icon: 'info',
            markAsRead: false,
          });

          if (getOrganization && notifSettings) {
            this.logger.debug(`notification settings ${notifSettings.id}`);
            if (notifSettings.completeDonation) {
              const subject = 'Complete Donation';
              const emailData = {
                campaignId: getCampaign.id,
                campaignName: getCampaign.title,
              };
              this.emailService.sendMailWTemplate(
                getOrganization.contactEmail,
                subject,
                'org/donation_complete',
                emailData,
                'hello@tmra.io', // optional, you can delete it, when new identity is provided, we can use other identity ex: ommar.net
              );
            }
          } else {
            this.logger.debug(`notification settings not found`);
          }
        }
      }

      const updatePaymentData = await this.paymentDataModel.updateOne(
        { orderId: data.data['payment_intent'] },
        {
          paymentStatus: paymentStatus,
          responseMessage: data.data['payment_status'],
          transactionTime: myDate.toISOString(), //stripe have their own transactionTime
          cardType: 'card',
        },
      );

      if (!updatePaymentData) {
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

  async stripeRequestBasket(payment: PaymentRequestCartDto) {
    const ObjectId = require('mongoose').Types.ObjectId;
    let isAnonymous = false;
    let donor = null;
    let currency = payment.currency;

    if (
      !payment.organizationId ||
      !payment.donorId ||
      !ObjectId.isValid(payment.organizationId) ||
      !payment.success_url ||
      !payment.cancel_url ||
      !payment.price ||
      !payment.total_amount ||
      !payment.quantity ||
      !payment.data_basket.length
    ) {
      throw new BadRequestException('Bad request is not match');
    }

    if (!['GBP', 'SAR', 'USD'].includes(currency)) {
      throw new BadRequestException('Currency is invalid');
    }

    // Get Organization Data
    const getOrganization = await this.organizationModel.findOne({
      _id: payment.organizationId,
    });

    if (!getOrganization) {
      throw new HttpException('Request rejected organizationId not found', HttpStatus.BAD_REQUEST);
    } else if (!currency) {
      currency = getOrganization['defaultCurrency'];
    }

    // Get Campaigns Data
    const campaigns = payment.data_basket;
    const campaignIds: any[] = [];
    const totalAmounts: any[] = [];

    for (let i = 0; i < campaigns.length; i++) {
      campaignIds.push(campaigns[i]._id);
      totalAmounts.push(campaigns[i].amount);
    }

    const getCampaign = await this.campaignModel
    .find({
      _id: { $in: campaignIds },
    })
    .exec();

    if (!getCampaign) {
      throw new HttpException('Request rejected campaignId not found', HttpStatus.BAD_REQUEST);
    }

    getCampaign.map((e, i) => {
      if (
        parseInt(e.amountProgress.toString()) + totalAmounts[i] > parseInt(e.amountTarget.toString())
      ) {
        throw new HttpException(`Amount is larger than the limit the target of campaign ${e.id}`, HttpStatus.BAD_REQUEST);
      } else return e;
    })

    // Get secretKey
    const getSecretKey = await this.paymentGatewayModel.findOne(
      { organizationId: ObjectId(payment.organizationId) },
      { apiKey: 1, _id: 0 },
    );

    if (!getSecretKey) {
      throw new HttpException('Organization can not use Stripe Payment Gateway', HttpStatus.BAD_REQUEST);
    }

    if (payment.donorId) {
      if (!ObjectId.isValid(payment.donorId)) {
        donor = await this.userModel.findOne({
          _id: payment.donorId,
        });
      } else {
        donor = await this.donorModel.findOne({
          _id: payment.donorId,
        });

        if (!donor) {
          donor = await this.anonymousModel.findOne({
            _id: payment.donorId,
          });

          if (!donor) {
            throw new HttpException('User not found,  donation service is not available', HttpStatus.BAD_REQUEST);
          } else {
            isAnonymous = true;
          }
        }
      }
    }

    // Total Quantity
    const qty = totalAmounts.reduce((ac, obj) => {
      return ac + obj;
    }, 0);
    const payQuantityToStripe = Math.round(parseFloat(qty)).toString();

    // Axios to Stripe Webhook
    const params = new URLSearchParams();

    if (donor) params.append('customer_email', donor.email);

    params.append('success_url', payment.success_url);
    params.append('cancel_url', payment.cancel_url);
    params.append('line_items[0][price]', payment.price);
    params.append('line_items[0][quantity]', payQuantityToStripe);
    params.append('mode', 'payment');
    params.append('submit_type', 'donate'); //will enable button with label "donate"
    this.logger.info('params', params);

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

    if (!data) throw new HttpException('Gateway Timeout or Stripe API down', HttpStatus.GATEWAY_TIMEOUT);

    // Insert Data to Donation Log
    const amountStr = data['data']['amount_total'].toString();
    const amount = amountStr.substring(0, amountStr.length - 2);
    let objectIdDonation = new ObjectId();
    let now: Date = new Date();

    const getDonationLog = await new this.donationLogsModel({
      _id: objectIdDonation,
      nonprofitRealmId: ObjectId(payment.organizationId),
      donorUserId: payment.donorId,
      amount: Number(amount),
      transactionId: data['data']['payment_intent'],
      createdAt: now,
      updatedAt: now,
      currency: currency,
      donationStatus: 'PENDING',
      type: DonationType.CART,
      organizationId: payment.organizationId,
    }).save();

    if (!getDonationLog) {
      throw new HttpException('Gateway Timeout or Stripe API down', HttpStatus.GATEWAY_TIMEOUT);
    };

    //Update Campaign Amount
    if (getCampaign && getCampaign.length) {
      for (const elCampaign of getCampaign) {
        let oIdCampaignDonation = new ObjectId();
        const newAmount: any = campaigns.find(el => el._id == elCampaign._id)?.amount
        const subtotal = (
          Number(elCampaign.amountProgress.toString()) +
          Number(newAmount)
        ).toString();

        // Create Donation Log Per Campaign
        const createDonationCampaign = await new this.donationLogsModel({
          _id: oIdCampaignDonation,
          nonprofitRealmId: ObjectId(payment.organizationId),
          donorUserId: payment.donorId,
          amount: Number(newAmount),
          transactionId: data['data']['payment_intent'],
          campaignId: elCampaign._id,
          createdAt: now,
          updatedAt: now,
          currency: currency,
          donationStatus: 'PENDING',
          type: DonationType.CART,
          organizationId: payment.organizationId,
        }).save();

        if (!createDonationCampaign) {
          throw new HttpException('Gateway Timeout or Stripe API down', HttpStatus.GATEWAY_TIMEOUT);
        };

        if (isAnonymous) {
          await this.anonymousModel.findOneAndUpdate(
            { _id: payment.donorId },
            { donationLogId: createDonationCampaign._id },
          );
        }
      }
    }

    // Insert Data to Payment Data
    let objectIdPayment = new ObjectId();
    
    if (isAnonymous) {
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
      responseStatus: campaigns, //send data list Campaign
      responseCode: '',
      responseMessage: '',
      cvvResult: '',
      avsResult: '',
      transactionTime: '',
      paymentStatus: 'OPEN',
    }).save();

    if (!insertPaymentData) throw new HttpException('Payment data failed to save in mongodb', HttpStatus.GATEWAY_TIMEOUT);

    return {
      stripeResponse: data['data'],
      message: 'Stripe request has been sent',
    }
  }

  async stripeCallbackBasket(sessionId: String, organizationId: String) {
    const tracer = trace.getTracer('tmra-raise');
    const span = tracer.startSpan('stripe-request', {
      attributes: { 'stripe.ammount': '-' },
    });
    try {
      // Do some work here
      this.logger.debug('stripeCallback...');
      let txtMessage = '';
      //console.debug('session_id=', sessionId);
      //console.debug('organizationId=', organizationId);

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

      //console.debug('organizationId=', organizationId);
      const ObjectId = require('mongoose').Types.ObjectId;
      const getOrganization = await this.organizationModel.findOne({
        _id: ObjectId(organizationId),
      });
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
      //const paymentIntent = data['data']['payment_intent'];
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

      //update payment status in donation_log
      let donationId = paymentData.donationId; //new mongoose.Types.ObjectId(paymentData.donationId);
      const updateDonationLog = await this.donationLogsModel.updateOne(
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
      const getDonationLog = await this.donationLogsModel.findOne(
        { _id: paymentData.donationId },
        { _id: 0, campaignId: 1, currency: 2, amount: 3 },
      );

      if (!getDonationLog) {
        return {
          statusCode: 404,
          body: JSON.stringify({
            message: 'Donation log not found',
          }),
        };
      }

      // Get Donor Data
      const donor = await this.userModel.findOne(
        { _id: donationId },
        { _id: 0, firstName: 1, lastName: 2, email: 3 },
      );

      // Get Anonymous Data
      let anonymousData;
      if (!donor) {
        anonymousData = await this.anonymousModel.findOne(
          { _id: donationId },
          {
            _id: 0,
            isEmailChecklist: 1,
            anonymous: 2,
            email: 3,
            firstName: 4,
            lastName: 5,
          },
        );
      }
      const getDataBasket = await this.paymentDataModel.findOne(
        {
          orderId: data.data['payment_intent'],
        },
        {
          responseStatus: 1,
        },
      );

      console.log('get data Basket', getDataBasket);
      const campaignId: any[] = [];
      const totalAmount: any[] = [];
      if (!!getDataBasket && getDataBasket.responseStatus) {
        const campaigns = JSON.parse(getDataBasket?.responseStatus!);
        for (let i = 0; i < campaigns.length; i++) {
          campaignId.push(campaigns[i].campaignId);
          totalAmount.push(campaigns[i].amount);
          if (paymentStatus == 'SUCCESS') {
            const getCampaign = await this.campaignModel.findOne(
              { _id: campaignId },
              { _id: 0, amountProgress: 1, amountTarget: 1, title: 1 },
            );

            if (!getCampaign) {
              return {
                statusCode: 404,
                body: JSON.stringify({
                  message: 'Campaign not found', // =>
                }),
              };
            }
            const notifSettings = await this.notifSettingsModel.findOne({
              organizationId: ObjectId(organizationId),
            });

            const lastAmount = (
              Number(getCampaign.amountProgress) + Number(totalAmount)
            ).toString();

            if (getOrganization && notifSettings && getCampaign) {
              this.logger.debug(`notification settings ${notifSettings.id}`);
              const subject = `New Donation For ${getCampaign.title}`;
              const donorName = donor
                ? `${donor.firstname} ${donor.lastname}`
                : anonymousData
                ? anonymousData.anonymous
                  ? 'anonymous'
                  : `${anonymousData.firstName} ${anonymousData.lastName}`
                : 'anonymous';
              if (notifSettings.newDonation) {
                const emailData = {
                  // donor: 'Donor',
                  donor: donorName,
                  title: getCampaign.title,
                  currency: getDonationLog.currency,
                  amount: getDonationLog.amount,
                };
                this.emailService.sendMailWTemplate(
                  getOrganization.contactEmail,
                  subject,
                  'org/new_donation',
                  emailData,
                );
                const emailDonor = {
                  donor: donorName,
                  title: getCampaign.title,
                  currency: getDonationLog.currency,
                  amount: getDonationLog.amount,
                };
                if (donor) {
                  this.emailService.sendMailWTemplate(
                    donor.email,
                    subject,
                    'org/new_donation',
                    emailDonor,
                  );
                }
                if (anonymousData) {
                  if (
                    anonymousData.isEmailChecklist ||
                    !anonymousData.anonymous
                  ) {
                    this.emailService.sendMailWTemplate(
                      anonymousData.email,
                      subject,
                      'org/new_donation',
                      emailDonor,
                    );
                  }
                }
              }
            } else {
              this.logger.debug(`notification settings not found`);
            }

            const updateCampaign = await this.campaignModel.updateOne(
              { _id: getDonationLog.campaignId },
              {
                amountProgress: Number(lastAmount),
                updatedAt: myDate.toISOString(),
              },
            );

            if (!updateCampaign) {
              return {
                statusCode: 516,
                headers: {
                  'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                  message: 'failed update campaign data',
                }),
              };
            } else if (
              (Number(getCampaign.amountTarget) == Number(lastAmount)) ||
              (Number(lastAmount) > Number(getCampaign.amountTarget))
            ) {
              await this.campaignModel.updateOne(
                { _id: getDonationLog.campaignId },
                {
                  isFinished: 'Y',
                },
              );

              this.notificationsModel.create({
                organizationId: new ObjectId(organizationId),
                type: 'general',
                createdAt: new Date(),
                title: 'Campaign is completed',
                body: `Alhamdulillah, amount target of the campaign ${getCampaign.title} is completed...`,
                icon: 'info',
                markAsRead: false,
              });

              if (getOrganization && notifSettings) {
                this.logger.debug(`notification settings ${notifSettings.id}`);
                if (notifSettings.completeDonation) {
                  const subject = 'Complete Donation';
                  const emailData = {
                    campaignId: getCampaign.id,
                    campaignName: getCampaign.title,
                  };
                  this.emailService.sendMailWTemplate(
                    getOrganization.contactEmail,
                    subject,
                    'org/donation_complete',
                    emailData,
                  );
                }
              } else {
                this.logger.debug(`notification settings not found`);
              }

              const updatePaymentData = await this.paymentDataModel.updateOne(
                { orderId: data.data['payment_intent'] },
                {
                  paymentStatus: paymentStatus,
                  responseMessage: data.data['payment_status'],
                  transactionTime: myDate.toISOString(), //stripe have their own transactionTime
                  cardType: 'card',
                },
              );

              if (!updatePaymentData) {
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
            }
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
        }
      }
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

  async reqPayStripe(payment: PaymentRequestDto) {
    const tracer = trace.getTracer('tmra-raise');
    const span = tracer.startSpan('stripe-request', {
      attributes: { 'donor.firstName': '-' },
    });
    try {
      // Do some work here
      this.logger.debug('payStripeRequest...');
      let txtMessage = '';
      let stripeCallbackUrl = '';
      let isAnonymous = false;
      let donor = null;
      let currency = payment.currency;
      const ObjectId = require('mongoose').Types.ObjectId;
      // console.log('Log Stripe Reg=>', payment);
      if (
        !payment.organizationId ||
        !payment.campaignId ||
        !payment.donorId ||
        !ObjectId.isValid(payment.campaignId) ||
        !ObjectId.isValid(payment.organizationId) ||
        !payment.success_url ||
        !payment.cancel_url ||
        !payment.price ||
        // !payment.amount
        !payment.quantity
      ) {
        throw new HttpException(`Bad Request`, HttpStatus.BAD_REQUEST);
      }

      if (!['GBP', 'SAR', 'USD'].includes(currency)) {
        throw new HttpException(
          `request rejected organizationId not found`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const getOrganization = await this.organizationModel.findOne({
        _id: payment.organizationId,
      });
      // console.log('currency', getOrganization?.defaultCurrency);
      if (!getOrganization) {
        throw new HttpException(
          `request rejected organizationId not found`,
          HttpStatus.NOT_FOUND,
        );
      } else if (!currency) {
        currency = getOrganization['defaultCurrency'];
      }

      const getCampaign = await this.campaignModel
        .findOne({
          _id: payment.campaignId,
        })
        .exec();

      if (!getCampaign) {
        throw new HttpException(
          `request rejected campaignId not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      // else if (
      //   parseFloat(getCampaign.amountProgress.toString()) + payment.amount >
      //   parseFloat(getCampaign.amountTarget.toString())
      // ) {
      //   throw new HttpException(
      //     `Amount is larger than the limit of the target ${getCampaign.amountTarget}`,
      //     HttpStatus.BAD_REQUEST,
      //   );
      // }
      //console.log('debug', payment.organizationId);
      const getSecretKey = await this.paymentGatewayModel.findOne(
        { organizationId: ObjectId(payment.organizationId) },
        { apiKey: 1, _id: 0 },
      );

      if (!getSecretKey) {
        throw new NotFoundException(
          `organization can not use Stripe Payment Gateway`,
        );
      }

      if (payment.donorId) {
        if (!ObjectId.isValid(payment.donorId)) {
          donor = await this.userModel.findOne({
            _id: payment.donorId,
          });
        } else {
          donor = await this.donorModel.findOne({
            _id: payment.donorId,
          });

          if (!donor) {
            donor = await this.anonymousModel.findOne({
              _id: payment.donorId,
            });
            if (!donor) {
              throw new NotFoundException(
                `user not found,  donation service is not available`,
              );
            } else {
              isAnonymous = true;
            }
          }
          span.setAttribute('donor.firstName', donor?.firstName ?? '');
        }
      }

      const payQuantityToStripe = Math.round(parseFloat(payment.quantity)).toString();

      const params = new URLSearchParams();
      if (donor) {
        params.append('customer_email', donor.email);
      }
      params.append('success_url', payment.success_url);
      params.append('cancel_url', payment.cancel_url);
      params.append('line_items[0][price]', payment.price);
      params.append('line_items[0][quantity]', payQuantityToStripe);
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
      // console.log('Log Data =>', data);
      // console.log('Log Id ==>', data['data']['id']);
      // console.log('Log Currency =>', data['data']['currency']);
      // console.log('Log Expired =>', data['data']['expires_at']);
      // console.log('Log Data payIntent =>', data['data']['payment_intent']);
      if (!data) {
        throw new HttpException(
          'Gateway Timeout or Stripe API down',
          HttpStatus.GATEWAY_TIMEOUT,
        );
      }

      const amountStr = data['data']['amount_total'].toString();
      const amount = amountStr.substring(0, amountStr.length - 2);

      const cerrencyPayment = data['data']['currency'];
      switch (cerrencyPayment) {
        case 'usd':
          currency = 'USD';
          break;
        case 'sar':
          currency = 'SAR';
          break;
        default:
          currency = 'GBP';
          break;
      }

      let objectIdDonation = new ObjectId();
      let now: Date = new Date();
      let getDonationLog;
      if (
        getCampaign.campaignType &&
        getCampaign.campaignType === 'zakat' &&
        payment.zakatLogs
      ) {
        //insert data to donation_log for zakat transaction
        getDonationLog = await new this.donationLogsModel({
          _id: objectIdDonation,
          nonprofitRealmId: new ObjectId(payment.organizationId),
          donorUserId: isAnonymous ? '' : payment.donorId,
          amount: Number(amount),
          transactionId: data['data']['payment_intent'],
          createdAt: now,
          updatedAt: now,
          campaignId: ObjectId(payment.campaignId),
          currency: currency,
          donationStatus: 'PENDING',
          type: DonationType.ZAKAT,
          organizationId: payment.organizationId,
        }).save();

        if (Array.isArray(payment.zakatLogs)) {
          //insert data to zakatlogs
          for (let i = 0; i < payment.zakatLogs.length; i++) {
            const zakatLogs = payment.zakatLogs[i];
            const details = Array.isArray(zakatLogs.details) ? zakatLogs : [];
            await new this.zakatModel({
              _id: new ObjectId(),
              donationLogId: objectIdDonation,
              type: zakatLogs.type,
              currency: zakatLogs.currency,
              totalAmount: Number(zakatLogs.totalAmount),
              unit: zakatLogs.unit,
              numberOfUnits: zakatLogs.numberOfUnits,
              details: details,
              createdAt: now,
            }).save();
          }
        }
        this.logger.info('Create LOG_');
      } else {
        //insert data to donationLog for campaign transaction
        getDonationLog = await new this.donationLogModel({
          _id: objectIdDonation,
          organizationId: payment.organizationId,
          donorId: isAnonymous ? '' : payment.donorId,
          amount: Number(amount),
          transactionId: data['data']['payment_intent'],
          createdAt: now,
          updatedAt: now,
          campaignId: ObjectId(payment.campaignId),
          currency: currency,
          donationStatus: 'PENDING',
          type: DonationType.CAMPAIGN
        }).save();
        this.logger.info('Create LOG');
      }

      if (!getDonationLog) {
        throw new BadRequestException(`donation failed to save in mongodb`);
      }

      //insert data to paymentData
      let objectIdPayment = new ObjectId();
      if (isAnonymous) {
        await this.anonymousModel.findOneAndUpdate(
          { _id: payment.donorId },
          {
            donationLogId: objectIdDonation,
            isEmailChecklist: payment.isEmailChecklist,
            anonymous: payment.isAnonymous,
          },
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

      if (!insertPaymentData) {
        throw new BadRequestException(`payment data failed to save in mongodb`);
      }

      stripeCallbackUrl = data['data']['url'];
      txtMessage = `stripe request has been sent`;

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
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

  async payStripWebHook(payLoad: any) {
    const ObjectId = require('mongoose').Types.ObjectId;
    const payment_status = payLoad.data.object.payment_status;
    const transactionId = payLoad.data.object.payment_intent;
    const status = payLoad.data.object.status;
    const amount_total = payLoad.data.object.amount_total.toString();
    const payloadCurrency = String(payLoad.data.object.currency).toUpperCase();

    let getDonationLog, getCampaignCarts, getCampaign;
    let now: Date = new Date();
    let logsData = true;
    let ids, campaignId, donorId, organizationId, campaignIds;

    if (payment_status == 'paid') {
      getDonationLog = await this.donationLogModel.findOne(
        { transactionId: transactionId },
        {
          _id: 1,
          campaignId: 1,
          currency: 1,
          amount: 1,
          donorId: 1,
          organizationId: 1,
        },
      );
      organizationId = new ObjectId(getDonationLog?.organizationId);
      donorId = getDonationLog?.donorId;
      campaignId = new ObjectId(getDonationLog?.campaignId);
      if (!getDonationLog) {
        getDonationLog = await this.donationLogsModel.findOne(
          { transactionId: transactionId },
          {
            _id: 1,
            campaignId: 1,
            currency: 1,
            amount: 1,
            donorUserId: 1,
            nonprofitRealmId: 1,
          },
        );
        organizationId = getDonationLog?.nonprofitRealmId;
        donorId = getDonationLog?.donorUserId;
        campaignId = getDonationLog?.campaignId;
        logsData = false;
      }

      ids = getDonationLog?._id;

      const donor = await this.userModel.findOne({ _id: donorId });
      // Get Anonymous Data
      let anonymousData;

      if (!donor) {
        anonymousData = await this.anonymousModel.findOne(
          { donationLogId: ids },
          {
            _id: 0,
            isEmailChecklist: 1,
            anonymous: 1,
            email: 1,
            firstName: 1,
            lastName: 1,
          },
        );
      }

      if (getDonationLog && getDonationLog.campaignId) {
        getCampaign = await this.campaignModel.findOne(
          { _id: campaignId },
          { _id: 0, amountProgress: 1, amountTarget: 1, title: 1 },
        );
  
        if (!getCampaign) {
          throw new HttpException(`Campaign not found`, HttpStatus.NOT_FOUND);
        }
      } else {
        getDonationLog = await this.donationLogsModel.find(
          { transactionId: transactionId}
        );

        campaignIds = getDonationLog.filter(el => el.campaignId).map(v => v.campaignId?.toString());
        
        getCampaignCarts = await this.campaignModel
        .find({
          _id: { $in: campaignIds },
        }, { _id: 1, amountProgress: 1, amountTarget: 1, title: 1 })
        .exec();
      }

      const getLog = await this.donationLogModel.findOne(
        { transactionId: transactionId },
        { _id: 1 },
      );
  
      if (getLog) {
        await this.donationLogModel.updateOne(
          { transactionId: transactionId },
          { donationStatus: 'SUCCESS', updatedAt: now },
        );
        logsData = false;
      } else if (getCampaignCarts) {
        await this.donationLogsModel.updateMany(
          { transactionId: transactionId  },
          { donationStatus: 'SUCCESS', updatedAt: now },
        );
        logsData = false;
      } else {
        await this.donationLogsModel.updateOne(
          { transactionId: transactionId },
          { donationStatus: 'SUCCESS', updatedAt: now },
        );
        logsData = false;
      }

      if (logsData) {
        throw new BadRequestException(`donation failed to save in mongodb`);
      }

      // Notification Setting
      const notifSettings = await this.notifSettingsModel.findOne({
        organizationId: ObjectId(organizationId),
      });
      const getOrganization = await this.organizationModel.findOne({
        _id: organizationId,
      });
  
      this.logger.info(
        'Get Notif Organization',
        notifSettings,
        'Get Organization',
        getOrganization,
      );

      if (getOrganization && notifSettings) {
        this.logger.debug(`notification settings ${notifSettings.id}`);
        const subject = `New Donation For ${getCampaign?.title}`;
        const donorName =
          donor && !anonymousData
            ? `${donor.firstname} ${donor.lastname}`
            : anonymousData
            ? anonymousData.anonymous
              ? 'anonymous'
              : `${anonymousData.firstName} ${anonymousData.lastName}`
            : 'anonymous';

        if (notifSettings.newDonation && getDonationLog) {
          const emailDonor = {
            donor: donorName,
            title: getCampaign?.title || getCampaign?.campaignName,
            currency: String(payLoad.data.object.currency).toUpperCase() || '',
            amount: amount_total.substring(0, amount_total.length - 2) || '',
          };
  
          if (donor && !anonymousData) {
            this.emailService.sendMailWTemplate(
              donor.email,
              subject,
              'org/new_donation',
              emailDonor,
              getOrganization.contactEmail
            );
          } else if (anonymousData) {
            if (anonymousData.isEmailChecklist || anonymousData.anonymous) {
              this.emailService.sendMailWTemplate(
                anonymousData.email,
                subject,
                'org/new_donation',
                emailDonor,
                getOrganization.contactEmail,
              );
            }
          }
        }
      } else {
        this.logger.debug(`notification settings not found`);
      }

      // Update  amountProgress with current donation amount
      const amountStr = payLoad.data.object.amount_total.toString();
      let lastAmount;

      if (typeof getDonationLog === 'object' && getCampaignCarts) {
        const findPaymentData = await this.paymentDataModel.findOne(
          { orderId: transactionId },
          { _id: 1, responseStatus: 1 }
        )

        if (!findPaymentData) throw new BadRequestException(`Cannot find payment data`);

        const campaignsRes: any = JSON.stringify(findPaymentData?.responseStatus!);
        const valuePaymentCampaign = JSON.parse(campaignsRes)!;

        for (const itemPayment of getCampaignCarts) {
          const newAmount = valuePaymentCampaign.find((el: any) => el._id == itemPayment?._id!)?.amount
          const subtotalAmount = (
            Number(itemPayment.amountProgress.toString()) +
            Number(newAmount)
          ).toString();

          const updateAnyCampaign = await this.campaignModel.updateOne(
            { _id: itemPayment._id },
            {
              amountProgress: Number(subtotalAmount),
              updatedAt: now,
            },
          );

          if (
            (Number(itemPayment?.amountTarget) == Number(subtotalAmount)) ||
            (Number(subtotalAmount) > Number(itemPayment?.amountTarget))
          ) {
            await this.campaignModel.updateOne(
              { _id: itemPayment._id },
              {
                isFinished: 'Y',
              },
            );

            this.notificationsModel.create({
              organizationId: organizationId,
              type: 'general',
              createdAt: new Date(),
              title: 'Campaign is completed',
              body: `Alhamdulillah, amount target of the campaign ${itemPayment?.title} is completed...`,
              icon: 'info',
              markAsRead: false,
            });

            if (getOrganization && notifSettings) {
              this.logger.debug(`notification settings ${notifSettings.id}`);
              if (notifSettings.completeDonation) {
                const subject = 'Complete Donation';
                const emailData = {
                  campaignId: itemPayment?.id,
                  campaignName: itemPayment?.title || itemPayment?.campaignName,
                };
                this.emailService.sendMailWTemplate(
                  donor?.email!,
                  subject,
                  'org/donation_complete',
                  emailData,
                  getOrganization.contactEmail,
                );
              }
            } else {
              this.logger.debug(`notification settings not found`);
            }

          } else if(!updateAnyCampaign) {
            throw new BadRequestException(
              `update campaign failed to save in mongodb`,
            );
          }
        }
      } else {
        lastAmount = (
          Number(getCampaign?.amountProgress) +
          Number(amountStr.substring(0, amountStr.length - 2))
        ).toString();
        
        const updateCampaign = await this.campaignModel.updateOne(
          { _id: campaignId },
          {
            amountProgress: Number(lastAmount),
            updatedAt: now,
          },
        );

        if (!updateCampaign) {
          throw new BadRequestException(
            `update campaign failed to save in mongodb`,
          );
        } else if (
          (Number(getCampaign?.amountTarget) == Number(lastAmount)) ||
          (Number(lastAmount) > Number(getCampaign?.amountTarget))
        ) {
          await this.campaignModel.updateOne(
            { _id: campaignId },
            {
              isFinished: 'Y',
            },
          );
    
          this.notificationsModel.create({
            organizationId: organizationId,
            type: 'general',
            createdAt: new Date(),
            title: 'Campaign is completed',
            body: `Alhamdulillah, amount target of the campaign ${getCampaign?.title} is completed...`,
            icon: 'info',
            markAsRead: false,
          });
    
          if (getOrganization && notifSettings) {
            this.logger.debug(`notification settings ${notifSettings.id}`);
            if (notifSettings.completeDonation) {
              const subject = 'Complete Donation';
              const emailData = {
                campaignId: getCampaign?.id,
                campaignName: getCampaign?.title || getCampaign?.campaignName,
              };
              this.emailService.sendMailWTemplate(
                donor?.email!,
                subject,
                'org/donation_complete',
                emailData,
                getOrganization.contactEmail,
              );
            }
          } else {
            this.logger.debug(`notification settings not found`);
          }
        }
      }
    }

    if (status == 'expired') {
      const updateDonationLog = await this.donationLogModel.updateOne(
        { transactionId: transactionId },
        { donationStatus: 'FAILED', updatedAt: now },
      );

      if (!updateDonationLog) {
        await this.donationLogsModel.updateOne(
          { transactionId: transactionId },
          { donationStatus: 'FAILED', updatedAt: now },
        );
      } else if (typeof getDonationLog === 'object' && getCampaignCarts) {
        await this.donationLogsModel.updateMany(
          { transactionId: transactionId },
          { donationStatus: 'FAILED', updatedAt: now },
        );
      }

      throw new BadRequestException(`donation pay expired`);
    }
  }
}
