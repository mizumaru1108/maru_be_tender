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
import { PaymentPaytabsDto, PaymentGateWayDto } from './dto';
import { PaytabsIpnWebhookResponsePayload } from '../libs/paytabs/dtos/response/paytabs-ipn-webhook-response-payload.dto';
import { PaytabsTranType } from 'src/libs/paytabs/enums/paytabs-tran-type.enum';
import { PaytabsTranClass } from 'src/libs/paytabs/enums/paytabs-tran-class.enum';
import { PaytabsCreateTransactionResponse } from 'src/libs/paytabs/dtos/response/paytabs-create-transaction-response.dto';
import { DonationType } from 'src/donor/enum/donation-type.enum';
import { PaytabsCurrencyEnum } from 'src/libs/paytabs/enums/paytabs-currency-enum';
import { DonationStatus } from 'src/donor/enum/donation-status.enum';
import { PaytabsResponseStatus } from 'src/libs/paytabs/enums/paytabs-response-status.enum';

/**
 * * Others
 */
import { PaytabsService } from '../libs/paytabs/services/paytabs.service';
import { TenderNotificationService } from 'src/tender-notification/services/tender-notification.service';
import { PaytabsPaymentRequestPayloadModel } from 'src/libs/paytabs/models/paytabs-payment-request-payload.model';
import moment from 'moment';

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
    const baseUrl = process.env.TENDER_BASE_URL;
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
      const firstName = donor?.firstName || '';
      const lastName = donor?.lastName || '';
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
        callback: `${baseUrl}/paytabs/callback-single`,
        return: payloadRequest.success_url,
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
            donationLogId: donationLogId,
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
        } else if (
          amount_target == Number(subtotalAmountCampaign) ||
          Number(subtotalAmountCampaign) > Number(request.cart_amount)
        ) {
          await this.campaignModel.updateOne(
            { _id: getCampaign._id },
            {
              isFinished: 'Y',
            },
          );
        }

        const updatePaymentData = await this.paymentDataModel.updateOne(
          { orderId: order_id },
          {
            paymentStatus: payment_status,
            responseMessage: payment_status,
            cardType: request.payment_info?.card_type || '',
            cardScheme: request.payment_info?.card_scheme || '',
            paymentDescription: request.payment_info?.payment_description || '',
            expiryMonth: Number(request.payment_info?.expiryMonth) || undefined,
            expiryYear: Number(request.payment_info?.expiryYear) || undefined,
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
}
