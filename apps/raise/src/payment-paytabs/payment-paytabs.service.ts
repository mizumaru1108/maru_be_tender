import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ROOT_LOGGER } from '../libs/root-logger';

/**
 * * Schema / Document
 */
import {
  Organization,
  OrganizationDocument,
} from '../organization/schema/organization.schema';

import {
  PaymentGateway,
  PaymentGatewayDocument,
} from '../donation/schema/paymentGateway.schema';

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

import { Campaign, CampaignDocument } from '../campaign/schema/campaign.schema';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { Donor, DonorDocument } from 'src/donor/schema/donor.schema';
import { ZakatLog, ZakatLogDocument } from '../zakat/schemas/zakat_log.schema';
import { Anonymous, AnonymousDocument } from '../donor/schema/anonymous.schema';

/**
 * * DTO
 */
import { PaymentPaytabsDto } from './dto';
import { PaytabsIpnWebhookResponsePayload } from '../libs/paytabs/dtos/response/paytabs-ipn-webhook-response-payload.dto';
import { PaytabsTranType } from 'src/libs/paytabs/enums/paytabs-tran-type.enum';
import { PaytabsTranClass } from 'src/libs/paytabs/enums/paytabs-tran-class.enum';
import { PaytabsCreateTransactionResponse } from 'src/libs/paytabs/dtos/response/paytabs-create-transaction-response.dto';
import { DonationType } from 'src/donor/enum/donation-type.enum';
import { PaytabsCurrencyEnum } from 'src/libs/paytabs/enums/paytabs-currency-enum';
import { DonationStatus } from 'src/donor/enum/donation-status.enum';
import { PaytabsResponseStatus } from 'src/libs/paytabs/enums/paytabs-response-status.enum';
import { CommonNotificationMapperResponse } from 'src/tender-commons/dto/common-notification-mapper-response.dto';

/**
 * * Others
 */
import { PaytabsService } from '../libs/paytabs/services/paytabs.service';
import { PaytabsPaymentRequestPayloadModel } from 'src/libs/paytabs/models/paytabs-payment-request-payload.model';
import moment from 'moment';
import { Types } from 'mongoose';
import { TenderNotificationService } from '../notification-management/notification/services/tender-notification.service';

@Injectable()
export class PaymentPaytabsService {
  private readonly logger = ROOT_LOGGER.child({
    logger: PaymentPaytabsService.name,
  });

  constructor(
    private paytabsService: PaytabsService,
    @InjectModel(Organization.name)
    private organizationModel: mongoose.Model<OrganizationDocument>,
    @InjectModel(PaymentGateway.name)
    private paymentGatewayModel: mongoose.Model<PaymentGatewayDocument>,
    @InjectModel(Campaign.name)
    private campaignModel: mongoose.Model<CampaignDocument>,
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<UserDocument>,
    @InjectModel(ZakatLog.name)
    private readonly zakatModel: mongoose.Model<ZakatLogDocument>,
    @InjectModel(Donor.name)
    private donorModel: mongoose.Model<DonorDocument>,
    @InjectModel(Anonymous.name)
    private anonymousModel: mongoose.Model<AnonymousDocument>,
    @InjectModel(PaymentData.name)
    private paymentDataModel: mongoose.Model<PaymentDataDocument>,
    @InjectModel(DonationLogs.name)
    private donationLogsModel: mongoose.Model<DonationLogsDocument>,
    @InjectModel(DonationLog.name)
    private donationLogModel: mongoose.Model<DonationLogDocument>,
    private readonly notificationService: TenderNotificationService,
  ) {}

  async paytabsRequest(payloadRequest: PaymentPaytabsDto) {
    const ObjectId = require('mongoose').Types.ObjectId;
    let currency = payloadRequest.currency;
    let isAnonymous = false;
    let donor = null;
    let paytabsResponse: PaytabsCreateTransactionResponse | null = null;

    try {
      /**
       * ? Validate request payload
       * @body request payload
       */
      if (
        !payloadRequest.organizationId ||
        !payloadRequest.campaignId ||
        !ObjectId.isValid(payloadRequest.organizationId) ||
        !ObjectId.isValid(payloadRequest.campaignId) ||
        !payloadRequest.donorId ||
        !payloadRequest.success_url ||
        !payloadRequest.cancel_url ||
        !payloadRequest.amount
      ) {
        throw new HttpException(`Bad Request`, HttpStatus.BAD_REQUEST);
      }

      /**
       * * Finding organization
       * @return organization schema
       */
      this.logger.info(`Finding organization ${payloadRequest.organizationId}`);

      const getOrganizationData = await this.organizationModel.findOne({
        _id: payloadRequest.organizationId,
      });

      if (!getOrganizationData) {
        throw new HttpException(
          `Request rejected organizationId not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      /**
       * ? Validate currency options
       */
      const currencyOptions = getOrganizationData.currencyOptions as string[];
      const defaultCurrency = getOrganizationData.defaultCurrency;

      if (!currencyOptions.includes(currency)) {
        throw new HttpException(
          `Request rejected currency options is not allowed!`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        currency = defaultCurrency;
      }

      /**
       * * Finding payment gateway organization
       * @return payment gateway schema
       */
      this.logger.info(
        `Finding payment gateway organization ${payloadRequest.organizationId}`,
      );

      const getSecretKey = await this.paymentGatewayModel.findOne({
        organizationId: ObjectId(payloadRequest.organizationId),
        name: 'PAYTABS',
      });

      if (!getSecretKey) {
        throw new NotFoundException(
          `organization can not use Paytabs Payment Gateway`,
        );
      }

      /**
       * * Finding campaign
       * @return campaign schema
       */
      this.logger.info(`Finding campaign id ${payloadRequest.campaignId}`);

      const getCampaign = await this.campaignModel
        .findOne({
          _id: payloadRequest.campaignId,
        })
        .exec();

      if (!getCampaign) {
        throw new HttpException(
          `request rejected campaignId not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      /**
       * * Finding donor details
       * @return donor details
       */
      this.logger.info(`Finding donor details ${payloadRequest.donorId}`);

      if (payloadRequest.donorId) {
        if (!ObjectId.isValid(payloadRequest.donorId)) {
          donor = await this.userModel
            .findOne(
              {
                _id: payloadRequest.donorId,
              },
              {
                _id: true,
                email: true,
                name: true,
                firstname: true,
                lastname: true,
                firstName: true,
                lastName: true,
                type: true,
              },
            )
            .exec();
        } else {
          donor = await this.donorModel
            .aggregate([
              {
                $match: {
                  _id: ObjectId(payloadRequest.donorId),
                },
              },
              { $limit: 1 },
              { $addFields: { type: 'donor' } },
              {
                $project: {
                  _id: 1,
                  email: 1,
                  firstName: 1,
                  lastName: 1,
                  type: 1,
                },
              },
            ])
            .then((items) => items[0]);

          if (!donor) {
            donor = await this.anonymousModel
              .aggregate([
                {
                  $match: {
                    _id: ObjectId(payloadRequest.donorId),
                  },
                },
                { $limit: 1 },
                { $addFields: { type: 'donor' } },
                {
                  $project: {
                    _id: 1,
                    email: 1,
                    firstName: 1,
                    lastName: 1,
                    type: 1,
                  },
                },
              ])
              .then((items) => items[0]);

            if (!donor) {
              throw new HttpException(
                'User not found! donation service is not available.',
                HttpStatus.BAD_REQUEST,
              );
            } else {
              isAnonymous = true;
            }
          }
        }
      }

      if (donor && donor.type && donor.type !== 'donor') {
        throw new ForbiddenException(
          'Your account is not allowed to make donations!',
        );
      }

      /**
       * * Initialize for paytabs
       */
      const donationLogId = new ObjectId();
      const firstName = donor
        ? donor?.firstname
          ? donor?.firstname
          : donor?.firstName
          ? donor?.firstName
          : ''
        : '';
      const lastName = donor
        ? donor?.lastname
          ? donor?.lastname
          : donor?.lastName
          ? donor?.lastName
          : ''
        : '';
      const name = `${firstName} ${lastName}`;
      const now: Date = new Date();
      let getDonationLog;

      const paytabsPayload: PaytabsPaymentRequestPayloadModel = {
        profile_id: getSecretKey.profileId!,
        cart_amount: payloadRequest.amount!,
        cart_currency: 'IDR' as PaytabsCurrencyEnum,
        cart_description: `Single payment for donation id: [${donationLogId}]`,
        cart_id: `${donationLogId}`,
        tran_type: PaytabsTranType.SALE,
        tran_class: PaytabsTranClass.ECOM,
        callback: `https://api-staging.tmra.io/v2/raise/paytabs/callback-single`,
        return: payloadRequest.success_url,
        framed: true,
        hide_shipping: true,
        customer_details: {
          name: name ?? '',
          email: donor?.email ?? '',
          phone: donor?.phone ?? '',
          street1: '',
          city: '',
          state: '',
          country: '',
          zip: '',
        },
      };

      const response = await this.paytabsService.createTransaction(
        paytabsPayload,
        getSecretKey.serverKey!,
        'https://secure-global.paytabs.com/payment/request',
      );

      paytabsResponse = response;

      if (paytabsResponse) {
        if (
          getCampaign.campaignType &&
          getCampaign.campaignType === 'zakat' &&
          payloadRequest.zakatLogs
        ) {
          getDonationLog = await new this.donationLogsModel({
            _id: donationLogId,
            nonprofitRealmId: new ObjectId(payloadRequest.organizationId),
            donorUserId: payloadRequest.donorId,
            amount: Number(payloadRequest.amount),
            transactionId: paytabsResponse.tran_ref,
            createdAt: now,
            updatedAt: now,
            campaignId: ObjectId(payloadRequest.campaignId),
            currency: currency,
            donationStatus: 'PENDING',
            type: DonationType.ZAKAT,
            organizationId: payloadRequest.organizationId,
          }).save();

          if (Array.isArray(payloadRequest.zakatLogs)) {
            for (let i = 0; i < payloadRequest.zakatLogs.length; i++) {
              const zakatLogs = payloadRequest.zakatLogs[i];
              const details = Array.isArray(zakatLogs.details) ? zakatLogs : [];

              await new this.zakatModel({
                _id: new ObjectId(),
                donationLogId: donationLogId,
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

          this.logger.info(`Create LOG Zakat ${getDonationLog._id}`);
        } else {
          getDonationLog = await new this.donationLogModel({
            _id: donationLogId,
            organizationId: payloadRequest.organizationId,
            donorId: payloadRequest.donorId,
            amount: Number(payloadRequest.amount),
            transactionId: paytabsResponse.tran_ref,
            createdAt: now,
            updatedAt: now,
            campaignId: ObjectId(payloadRequest.campaignId),
            currency: currency,
            donationStatus: 'PENDING',
            type: DonationType.CAMPAIGN,
          }).save();

          this.logger.info(`Create LOG Campaign ${getDonationLog._id}`);
        }
      }

      if (!getDonationLog) {
        throw new BadRequestException(`donation failed to save in mongodb`);
      }

      /**
       * * Validate anonymous user
       */
      if (isAnonymous) {
        await this.anonymousModel.findOneAndUpdate(
          { _id: payloadRequest.donorId },
          {
            // donationLogId: donationLogId,
            isEmailChecklist: payloadRequest.isEmailChecklist,
            anonymous: payloadRequest.isAnonymous,
          },
        );
      }

      /**
       * * Insert data to payment schema
       */
      const object_payment_data_id = new ObjectId();

      const insertPaymentData = await new this.paymentDataModel({
        _id: object_payment_data_id,
        donationId: donationLogId,
        merchantId: '',
        payerId: '',
        orderId: paytabsResponse.tran_ref,
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

      return {
        paytabsResponse,
        message: 'Paytabs request has been sent',
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async paytabsSingleCallback(request: PaytabsIpnWebhookResponsePayload) {
    const ObjectId = require('mongoose').Types.ObjectId;
    const now = new Date();
    const order_id = request.tran_ref;
    let payment_status: DonationStatus = DonationStatus.PENDING;
    let anonymousData = null;

    try {
      const donationLog = await this.donationLogModel.findOne({
        transactionId: order_id,
        type: 'campaign',
      });

      if (!donationLog) {
        throw new BadRequestException(`Donation log not found`);
      }

      /**
       * * Finding organization data
       */
      this.logger.info(
        `Finding organization data: ${donationLog.organizationId}`,
      );

      const getOrganization = await this.organizationModel.findOne({
        _id: new Types.ObjectId(donationLog.organizationId),
      });

      if (!getOrganization) {
        throw new HttpException(
          'Request rejected organizationId not found',
          HttpStatus.NOT_FOUND,
        );
      }

      switch (request.payment_result.response_status!) {
        case PaytabsResponseStatus.A:
          payment_status = DonationStatus.SUCCESS;
          break;
        case PaytabsResponseStatus.D:
          payment_status = DonationStatus.DECLINED;
          break;
        case PaytabsResponseStatus.E:
          payment_status = DonationStatus.ERROR;
          break;
        case PaytabsResponseStatus.H:
          payment_status = DonationStatus.HOLD;
          break;
        case PaytabsResponseStatus.P:
          payment_status = DonationStatus.PENDING;
          break;
        case PaytabsResponseStatus.V:
          payment_status = DonationStatus.VOIDED;
          break;
        default:
          break;
      }

      const paymentData = await this.paymentDataModel.findOne({
        orderId: order_id,
      });

      if (!paymentData) {
        throw new HttpException('Payment data not found', HttpStatus.NOT_FOUND);
      }

      const donor = await this.userModel.findOne(
        { _id: donationLog.donorId },
        { _id: 0, firstName: 1, lastName: 2, email: 3 },
      );

      if (!donor) {
        anonymousData = await this.anonymousModel.findOne({
          _id: donationLog.donorId,
        });
      }

      if (donationLog.campaignId && request.cart_amount) {
        let updateCampaignDonationLog;

        const getCampaign = await this.campaignModel
          .findOne({
            _id: donationLog.campaignId,
          })
          .exec();

        if (!getCampaign) {
          throw new HttpException(
            `request rejected campaignId not found`,
            HttpStatus.NOT_FOUND,
          );
        }

        const amount_progress = Number(getCampaign.amountProgress.toString());
        const amount_target = Number(getCampaign.amountTarget.toString());

        const subtotalAmountCampaign = (
          amount_progress + Number(request.cart_amount)
        ).toString();

        if (getCampaign.campaignType && getCampaign.campaignType === 'zakat') {
          updateCampaignDonationLog = await this.donationLogsModel.updateOne(
            {
              _id: paymentData.donationId,
              transactionId: order_id,
              donorUserId: donationLog.donorId,
              campaignId: ObjectId(donationLog.campaignId),
            },
            { donationStatus: payment_status, updatedAt: now },
          );
        } else {
          updateCampaignDonationLog = await this.donationLogModel.updateOne(
            {
              _id: paymentData.donationId,
              transactionId: order_id,
              donorUserId: donationLog.donorId,
              campaignId: ObjectId(donationLog.campaignId),
            },
            { donationStatus: payment_status, updatedAt: now },
          );
        }

        if (!updateCampaignDonationLog) {
          throw new BadRequestException(`donation failed update to mongodb`);
        }

        if (payment_status === DonationStatus.SUCCESS) {
          const updateCampaign = await this.campaignModel.updateOne(
            { _id: getCampaign._id },
            {
              amountProgress: Number(subtotalAmountCampaign),
              updatedAt: now,
            },
          );

          if (!updateCampaign) {
            throw new HttpException(
              'failed update campaign data',
              HttpStatus.BAD_REQUEST,
            );
          }

          if (
            amount_target === Number(subtotalAmountCampaign) ||
            Number(subtotalAmountCampaign) > amount_target
          ) {
            await this.campaignModel.updateOne(
              { _id: getCampaign._id },
              {
                isFinished: 'Y',
              },
            );
          }

          /**
           * * Send email notification for payment campaign
           */
          this.logger.info(
            `Send email notification for payment campaign: ${getCampaign._id}`,
          );

          const notifPayload: CommonNotificationMapperResponse = {
            logTime: moment(new Date().getTime()).format('llll'),
            generalHostEmail: 'tmra',
            clientSubject: 'Thanks for your donations!',
            clientId: [],
            clientEmail: [donor ? donor?.email! : anonymousData?.email!],
            clientMobileNumber: [],
            clientEmailTemplatePath: `gs/en/payment/donor_donation`,
            clientEmailTemplateContext: [
              {
                organization_name: getOrganization.name,
                donor_email: donor ? donor?.email! : anonymousData?.email!,
                donor_name: donor
                  ? donor?.firstname!
                  : anonymousData?.firstName!,
                donor_amount: Number(request.cart_amount),
                campaign_name: getCampaign.title
                  ? getCampaign.title
                  : getCampaign.campaignName,
              },
            ],
            clientContent: 'Thanks for your donations!',
            reviewerId: [],
            reviewerEmail: [getOrganization.contactEmail],
            reviewerEmailTemplatePath: `gs/en/payment/organization_donation`,
            reviewerEmailTemplateContext: [
              {
                donor_name: donor
                  ? donor?.firstname!
                  : anonymousData?.firstName!,
                donor_amount: Number(request.cart_amount),
                campaign_name: getCampaign.title
                  ? getCampaign.title
                  : getCampaign.campaignName,
              },
            ],
            reviewerContent: 'There is a new donation...',
            reviewerMobileNumber: [],
            reviwerSubject: 'There is a new donation...',
            createManyWebNotifPayload: [],
          };

          await this.notificationService.sendSmsAndEmailBatch(notifPayload);
        }

        const updatePaymentData = await this.paymentDataModel.updateOne(
          { orderId: order_id },
          {
            paymentStatus: payment_status,
            responseMessage: payment_status,
            cardType: request.payment_info?.card_type || '',
            cardScheme: request.payment_info?.card_scheme || '',
            paymentDescription: request.payment_info?.payment_description || '',
            expiryMonth: Number(request.payment_info?.expiryMonth) || null,
            expiryYear: Number(request.payment_info?.expiryYear) || null,
            responseStatus: request.payment_result?.response_status || '',
            responseCode: request.payment_result?.response_code || '',
            cvvResult: request.payment_result?.cvv_result || '',
            avsResult: request.payment_result?.avs_result || '',
            transactionTime: request.payment_result?.transaction_time || '',
          },
        );

        if (!updatePaymentData) {
          throw new HttpException(
            'failed inserting transaction data',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      return {
        tran_ref: request.tran_ref,
        message: 'Successful callback request from paytabs',
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async paytabsRequestCart(request: PaymentPaytabsDto) {
    const ObjectId = require('mongoose').Types.ObjectId;
    let isAnonymous = false;
    let donor = null;
    let currency = request.currency;
    let paytabsResponse: PaytabsCreateTransactionResponse | null = null;

    try {
      /**
       * ? Validate request payload
       * @body request payload
       */
      if (
        !request.organizationId ||
        !ObjectId.isValid(request.organizationId) ||
        !request.donorId ||
        !request.success_url ||
        !request.cancel_url ||
        !request.total_amount ||
        !request.data_basket?.length
      ) {
        throw new HttpException(`Bad Request`, HttpStatus.BAD_REQUEST);
      }
      this.logger.info(`Finding organization ${request.organizationId}`);

      const getOrganization = await this.organizationModel.findOne({
        _id: request.organizationId,
      });

      /**
       * * Finding organization
       */
      if (!getOrganization) {
        throw new HttpException(
          'Request rejected organizationId not found',
          HttpStatus.BAD_REQUEST,
        );
      }

      /**
       * ? Validate currency
       */
      const currencyOptions = getOrganization.currencyOptions as string[];
      const defaultCurrency = getOrganization.defaultCurrency;

      if (!currencyOptions.includes(currency)) {
        throw new HttpException(
          `Request rejected currency options is not allowed!`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        currency = defaultCurrency;
      }

      /**
       * * Finding campaign list
       */

      const campaigns = request.data_basket;
      const campaignIds: any[] = [];
      const totalAmounts: { id: string; amount: number }[] = [];

      for (let i = 0; i < campaigns.length; i++) {
        campaignIds.push(campaigns[i]._id);
        totalAmounts.push({
          id: campaigns[i]._id,
          amount: campaigns[i].amount,
        });
      }

      this.logger.info(`Finding campaign id list ${campaignIds}`);

      const getCampaign = await this.campaignModel
        .find({
          _id: { $in: campaignIds },
        })
        .exec();

      if (!getCampaign) {
        throw new HttpException(
          'Request rejected campaignId not found',
          HttpStatus.BAD_REQUEST,
        );
      }

      getCampaign.map((e) => {
        const amount_to_pay = totalAmounts.find((el) => el.id === e.id)?.amount;
        const amount_progress = parseInt(e.amountProgress.toString());
        const amount_target = parseInt(e.amountTarget.toString());

        if (amount_progress + amount_to_pay! > amount_target) {
          throw new HttpException(
            `Amount is larger than the limit the target of campaign ${e.id}`,
            HttpStatus.BAD_REQUEST,
          );
        } else return e;
      });

      /**
       * * Finding Secret Key
       * ? for validating can use payment gateway or not
       */
      this.logger.info(`Finding secretKey ${getOrganization._id}`);
      const getSecretKey = await this.paymentGatewayModel.findOne({
        organizationId: ObjectId(getOrganization._id),
        name: 'PAYTABS',
      });

      if (!getSecretKey) {
        throw new HttpException(
          'Organization can not use Paytabs Payment Gateway',
          HttpStatus.BAD_REQUEST,
        );
      }

      /**
       * * Finding Donor Data
       * ? Validate first avail in userModel or donorModel or anonymousModel
       * @returns donor data
       */

      if (request.donorId) {
        if (!ObjectId.isValid(request.donorId)) {
          donor = await this.userModel
            .findOne(
              {
                _id: request.donorId,
              },
              {
                _id: true,
                email: true,
                name: true,
                firstname: true,
                lastname: true,
                firstName: true,
                lastName: true,
                type: true,
              },
            )
            .exec();
        } else {
          donor = await this.donorModel
            .aggregate([
              {
                $match: {
                  _id: ObjectId(request.donorId),
                },
              },
              { $limit: 1 },
              { $addFields: { type: 'donor' } },
              {
                $project: {
                  _id: 1,
                  email: 1,
                  firstName: 1,
                  lastName: 1,
                  type: 1,
                },
              },
            ])
            .then((items) => items[0]);

          if (!donor) {
            donor = await this.anonymousModel
              .aggregate([
                {
                  $match: {
                    _id: ObjectId(request.donorId),
                  },
                },
                { $limit: 1 },
                { $addFields: { type: 'donor' } },
                {
                  $project: {
                    _id: 1,
                    email: 1,
                    firstName: 1,
                    lastName: 1,
                    type: 1,
                  },
                },
              ])
              .then((items) => items[0]);

            if (!donor) {
              throw new HttpException(
                'User not found! donation service is not available.',
                HttpStatus.BAD_REQUEST,
              );
            } else {
              isAnonymous = true;
            }
          }
        }
      }

      if (donor && donor.type && donor.type !== 'donor') {
        throw new HttpException(
          'Your account is not allowed to make donations!',
          HttpStatus.BAD_REQUEST,
        );
      }

      /**
       * * Total Amount
       */
      const qty = totalAmounts.reduce((acc, curr) => {
        return acc + curr.amount;
      }, 0);

      // const payQuantityToPaytabs = qty;

      /**
       * * Initialize for paytabs
       */
      const donationLogId = new ObjectId();
      const firstName = donor
        ? donor?.firstname
          ? donor?.firstname
          : donor?.firstName
          ? donor?.firstName
          : ''
        : '';
      const lastName = donor
        ? donor?.lastname
          ? donor?.lastname
          : donor?.lastName
          ? donor?.lastName
          : ''
        : '';
      const name = `${firstName} ${lastName}`;
      const now: Date = new Date();

      const paytabsPayload: PaytabsPaymentRequestPayloadModel = {
        profile_id: getSecretKey.profileId!,
        cart_amount: qty,
        cart_currency: 'IDR' as PaytabsCurrencyEnum,
        cart_description: `Cart payment for donation id: [${donationLogId}]`,
        cart_id: `${donationLogId}`,
        tran_type: PaytabsTranType.SALE,
        tran_class: PaytabsTranClass.ECOM,
        callback: `https://api-staging.tmra.io/v2/raise/paytabs/callback-cart`,
        return: request.success_url,
        framed: true,
        hide_shipping: true,
        customer_details: {
          name: name || '',
          email: donor?.email || '',
          phone: donor?.phone || '',
          street1: '',
          city: '',
          state: '',
          country: '',
          zip: '',
        },
      };

      const response = await this.paytabsService.createTransaction(
        paytabsPayload,
        getSecretKey.serverKey!,
        'https://secure-global.paytabs.com/payment/request',
      );

      paytabsResponse = response;

      if (paytabsResponse) {
        const getDonationLog = await new this.donationLogsModel({
          _id: donationLogId,
          nonprofitRealmId: ObjectId(request.organizationId),
          donorUserId: request.donorId,
          amount: Number(qty),
          transactionId: paytabsResponse.tran_ref,
          createdAt: now,
          updatedAt: now,
          currency: currency,
          donationStatus: 'PENDING',
          type: DonationType.CART,
          organizationId: request.organizationId,
        }).save();

        if (!getDonationLog) {
          throw new HttpException(
            `Cant't save donation log!`,
            HttpStatus.BAD_REQUEST,
          );
        }

        /**
         * * Create campaign donations log
         */

        if (getCampaign && getCampaign.length) {
          for (const elCampaign of getCampaign) {
            const oIdCampaignDonation = new ObjectId();
            const newAmount: any = campaigns.find(
              (el) => el._id == elCampaign._id,
            )?.amount;

            const createDonationCampaign = await new this.donationLogsModel({
              _id: oIdCampaignDonation,
              nonprofitRealmId: ObjectId(request.organizationId),
              donorUserId: request.donorId,
              amount: Number(newAmount),
              transactionId: paytabsResponse.tran_ref,
              campaignId: elCampaign._id,
              createdAt: now,
              updatedAt: now,
              currency: currency,
              donationStatus: 'PENDING',
              type: DonationType.CART,
              organizationId: request.organizationId,
            }).save();

            if (!createDonationCampaign) {
              throw new HttpException(
                'Cannot create campaign donations!',
                HttpStatus.BAD_REQUEST,
              );
            }

            if (isAnonymous) {
              await this.anonymousModel.findOneAndUpdate(
                { _id: request.donorId },
                {
                  isEmailChecklist: request.isEmailChecklist,
                  anonymous: request.isAnonymous,
                },
              );
            }
          }
        }
      }

      // Insert Data to Payment Data
      const objectIdPayment = new ObjectId();

      const insertPaymentData = await new this.paymentDataModel({
        _id: objectIdPayment,
        donationId: donationLogId,
        merchantId: '',
        payerId: '',
        orderId: paytabsResponse.tran_ref,
        cardType: '',
        cardScheme: '',
        paymentDescription: '',
        expiryMonth: '',
        expiryYear: '',
        responseStatus: campaigns,
        responseCode: '',
        responseMessage: '',
        cvvResult: '',
        avsResult: '',
        transactionTime: '',
        paymentStatus: 'OPEN',
      }).save();

      if (!insertPaymentData)
        throw new HttpException(
          'Payment data failed to save in mongodb',
          HttpStatus.GATEWAY_TIMEOUT,
        );

      return {
        paytabsResponse,
        message: 'Paytabs request cart has been sent',
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async paytabsCartCallback(request: PaytabsIpnWebhookResponsePayload) {
    const now = new Date();
    const order_id = request.tran_ref;
    let payment_status: DonationStatus = DonationStatus.PENDING;
    let anonymousData = null;

    try {
      /**
       * * Finding donation log list
       */
      this.logger.info(`Finding donation log by order_id ${order_id}`);

      const donationsLog = await this.donationLogsModel.find({
        transactionId: order_id,
        type: 'cart',
      });

      if (donationsLog && !donationsLog.length) {
        throw new NotFoundException(`Donation list is empty`);
      }

      /**
       * * Finding organization data
       */
      this.logger.info(
        `Finding organization data: ${donationsLog[0].organizationId}`,
      );

      const getOrganization = await this.organizationModel.findOne({
        _id: new Types.ObjectId(donationsLog[0].organizationId),
      });

      if (!getOrganization) {
        throw new HttpException(
          'Request rejected organizationId not found',
          HttpStatus.NOT_FOUND,
        );
      }

      /**
       * ? Validate payment status
       */
      this.logger.info(
        `Validate Payment status "${request.payment_result.response_status!}"`,
      );

      switch (request.payment_result.response_status!) {
        case PaytabsResponseStatus.A:
          payment_status = DonationStatus.SUCCESS;
          break;
        case PaytabsResponseStatus.D:
          payment_status = DonationStatus.DECLINED;
          break;
        case PaytabsResponseStatus.E:
          payment_status = DonationStatus.ERROR;
          break;
        case PaytabsResponseStatus.H:
          payment_status = DonationStatus.HOLD;
          break;
        case PaytabsResponseStatus.P:
          payment_status = DonationStatus.PENDING;
          break;
        case PaytabsResponseStatus.V:
          payment_status = DonationStatus.VOIDED;
          break;
        default:
          break;
      }

      /**
       * * Finding payment data
       */
      this.logger.info(`Finding payment data by order_id "${order_id}"`);

      const paymentData = await this.paymentDataModel.findOne({
        orderId: order_id,
      });

      if (!paymentData) {
        throw new HttpException('Payment data not found', HttpStatus.NOT_FOUND);
      }

      /**
       * * Donor Data
       * Finding donor data or anonymous data
       */
      this.logger.info(
        `Finding donor data by donorId "${donationsLog[0].donorUserId}"`,
      );

      const donor = await this.userModel.findOne(
        { _id: donationsLog[0].donorUserId },
        { _id: 0, firstName: 1, lastName: 2, email: 3 },
      );

      if (!donor) {
        anonymousData = await this.anonymousModel.findOne({
          _id: donationsLog[0].donorUserId,
        });
      }

      /**
       * * Filtering campaign list
       */

      const campaignIds: any[] = [];
      const totalAmounts: { id: string; amount: number }[] = [];
      const campaigns = donationsLog.filter((el) => !!el.campaignId);

      this.logger.info(`Looping campaign list for update`);
      for (let i = 0; i < campaigns.length; i++) {
        campaignIds.push(campaigns[i].campaignId?.toString()!);
        totalAmounts.push({
          id: campaigns[i].campaignId?.toString()!,
          amount: campaigns[i].amount!,
        });

        if (payment_status === DonationStatus.SUCCESS) {
          const getCampaign = await this.campaignModel.findOne(
            { _id: campaigns[i].campaignId?.toString()! },
            { _id: 1, amountProgress: 1, amountTarget: 1, title: 1 },
          );

          if (!getCampaign) {
            throw new HttpException(
              `Campaign ${campaigns[i]._id} not found`,
              HttpStatus.NOT_FOUND,
            );
          }

          const amount_to_pay = totalAmounts.find(
            (el) => el.id === campaigns[i].campaignId?.toString()!,
          )?.amount;

          const amount_progress = parseInt(
            getCampaign.amountProgress.toString(),
          );
          const amount_target = parseInt(getCampaign.amountTarget.toString());

          const lastAmount = (
            Number(amount_progress) + Number(amount_to_pay)
          ).toString();

          this.logger.info(`Updating campaign id: ${getCampaign._id}`);

          const updateCampaign = await this.campaignModel.updateOne(
            { _id: getCampaign._id },
            {
              amountProgress: Number(lastAmount),
              updatedAt: now,
            },
          );

          if (!updateCampaign) {
            throw new HttpException(
              'failed update campaign data',
              HttpStatus.BAD_REQUEST,
            );
          }

          if (
            amount_target == Number(lastAmount) ||
            Number(lastAmount) > amount_target
          ) {
            await this.campaignModel.updateOne(
              { _id: getCampaign._id },
              {
                isFinished: 'Y',
                updatedAt: now,
              },
            );
          }

          /**
           * * Updating donation log by campaignId
           */
          this.logger.info(
            `Updating donation log "${order_id}" by campaignId: ${getCampaign._id}`,
          );

          const getDonationLogCampaign = await this.donationLogsModel.updateOne(
            { transactionId: order_id, campaignId: getCampaign._id },
            {
              donationStatus: payment_status,
              updatedAt: now,
            },
          );

          if (!getDonationLogCampaign) {
            throw new HttpException(
              'failed inserting donation log data',
              HttpStatus.BAD_REQUEST,
            );
          }

          /**
           * * Send email notification for payment campaign
           */
          this.logger.info(
            `Send email notification for payment campaign: ${getCampaign._id}`,
          );

          const notifPayload: CommonNotificationMapperResponse = {
            logTime: moment(new Date().getTime()).format('llll'),
            generalHostEmail: 'tmra',
            clientSubject: 'Thanks for your donations!',
            clientId: [],
            clientEmail: [donor ? donor?.email! : anonymousData?.email!],
            clientMobileNumber: [],
            clientEmailTemplatePath: `gs/en/payment/donor_donation`,
            clientEmailTemplateContext: [
              {
                organization_name: getOrganization.name,
                donor_email: donor ? donor?.email! : anonymousData?.email!,
                donor_name: donor
                  ? donor?.firstname!
                  : anonymousData?.firstName!,
                donor_amount: Number(amount_to_pay),
                campaign_name: getCampaign.title
                  ? getCampaign.title
                  : getCampaign.campaignName,
              },
            ],
            clientContent: 'Thanks for your donations!',
            reviewerId: [],
            reviewerEmail: [getOrganization.contactEmail],
            reviewerEmailTemplatePath: `gs/en/payment/organization_donation`,
            reviewerEmailTemplateContext: [
              {
                donor_name: donor
                  ? donor?.firstname!
                  : anonymousData?.firstName!,
                donor_amount: Number(amount_to_pay),
                campaign_name: getCampaign.title
                  ? getCampaign.title
                  : getCampaign.campaignName,
              },
            ],
            reviewerContent: 'There is a new donation...',
            reviewerMobileNumber: [],
            reviwerSubject: 'There is a new donation...',
            createManyWebNotifPayload: [],
          };

          await this.notificationService.sendSmsAndEmailBatch(notifPayload);
        }
      }

      /**
       * * Updating donation log without campaign id
       */
      this.logger.info(`Updating donation log without campaign id`);
      const donationWoCampaign = donationsLog.filter((el) => !el.campaignId);
      const updateDonationLog = await this.donationLogsModel.updateOne(
        { _id: donationWoCampaign[0]._id },
        { donationStatus: payment_status },
      );

      if (!updateDonationLog) {
        throw new HttpException(
          'Invalid update donation log',
          HttpStatus.BAD_REQUEST,
        );
      }

      /**
       * * Updating payment data
       */
      this.logger.info(`Updating payment data by order_id: ${order_id}`);

      const updatePaymentData = await this.paymentDataModel.updateOne(
        { orderId: order_id },
        {
          paymentStatus: payment_status,
          responseMessage: payment_status,
          cardType: request.payment_info?.card_type || '',
          cardScheme: request.payment_info?.card_scheme || '',
          paymentDescription: request.payment_info?.payment_description || '',
          expiryMonth: Number(request.payment_info?.expiryMonth) || null,
          expiryYear: Number(request.payment_info?.expiryYear) || null,
          responseCode: request.payment_result?.response_code || '',
          cvvResult: request.payment_result?.cvv_result || '',
          avsResult: request.payment_result?.avs_result || '',
          transactionTime: request.payment_result?.transaction_time || '',
        },
      );

      if (!updatePaymentData) {
        throw new HttpException(
          'failed updating transaction data',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        tran_ref: request.tran_ref,
        message: 'Successfull callback cart payment request from paytabs',
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
