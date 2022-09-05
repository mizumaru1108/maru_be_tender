import { FusionAuthClient } from '@fusionauth/typescript-client';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation } from '@nestjs/swagger';
import moment from 'moment';
import { AggregatePaginateModel, AggregatePaginateResult, Model, Types } from 'mongoose';
import {
  PaymentGateway,
  PaymentGatewayDocument,
} from 'src/payment-stripe/schema/paymentGateway.schema';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import {
  CampaignVendorLog,
  CampaignVendorLogDocument,
  Vendor,
  VendorDocument,
} from '../buying/vendor/vendor.schema';
import { Campaign, CampaignDocument } from '../campaign/campaign.schema';
import { CampaignSetFavoriteDto } from '../campaign/dto';
import { Item, ItemDocument } from '../item/item.schema';
import { BunnyService } from '../libs/bunny/services/bunny.service';
import { PaytabsIpnWebhookResponsePayload } from '../libs/payment-paytabs/dtos/response/paytabs-ipn-webhook-response-payload.dto';
import { PaytabsCurrencyEnum } from '../libs/payment-paytabs/enums/paytabs-currency-enum';
import { PaytabsResponseStatus } from '../libs/payment-paytabs/enums/paytabs-response-status.enum';
import { PaytabsTranClass } from '../libs/payment-paytabs/enums/paytabs-tran-class.enum';
import { PaytabsTranType } from '../libs/payment-paytabs/enums/paytabs-tran-type.enum';
import { PaytabsPaymentRequestPayloadModel } from '../libs/payment-paytabs/models/paytabs-payment-request-payload.model';
import { PaymentPaytabsService } from '../libs/payment-paytabs/payment-paytabs.service';
import { rootLogger } from '../logger';
import {
  PaymentData,
  PaymentDataDocument,
} from '../payment-stripe/schema/paymentData.schema';
import { Project, ProjectDocument } from '../project/project.schema';
import { ICurrentUser } from '../user/interfaces/current-user.interface';
import { DonorListDto, DonorListTrxDto, DonorPaymentSubmitDto, DonorUpdateProfileDto } from './dto';
import { DonorApplyVendorDto } from './dto/donor-apply-vendor.dto';
import { DonorDonateItemResponse } from './dto/donor-donate-item-response';
import { DonorDonateItemDto } from './dto/donor-donate-item.dto';
import { DonationStatus } from './enum/donation-status.enum';
import { DonationType } from './enum/donation-type.enum';
import { Anonymous, AnonymousDocument } from './schema/anonymous.schema';
import { DonationLog, DonationLogDocument } from './schema/donation-log.schema';
import {
  DonationLogDocument as DonationLogsDocument,
  DonationLogs,
} from './schema/donation_log.schema';
import { Donor, DonorDocument } from './schema/donor.schema';
import { Volunteer, VolunteerDocument } from './schema/volunteer.schema';

@Injectable()
export class DonorService {
  private logger = rootLogger.child({ logger: DonorService.name });

  constructor(
    private bunnyService: BunnyService, // no need to import in donor module (modular utils)
    private paytabsService: PaymentPaytabsService, // no need to import in donor module (modular utils)
    private configService: ConfigService, // no need to import in donor module (modular utils)
    @InjectModel(Donor.name)
    private donorModel: Model<DonorDocument>,
    @InjectModel(Donor.name)
    private donorAggregatePaginateModel: AggregatePaginateModel<DonorDocument>,
    @InjectModel(Volunteer.name)
    private volunteerModel: Model<VolunteerDocument>,
    @InjectModel(DonationLog.name)
    private donationLogModel: Model<DonationLogDocument>,
    @InjectModel(DonationLog.name)
    private campaignAggregatePaginateModel: AggregatePaginateModel<DonationLogDocument>,
    @InjectModel(DonationLog.name)
    private donorLogsAggregatePaginateModel: AggregatePaginateModel<DonationLogsDocument>,
    @InjectModel(DonationLogs.name)
    private donationLogsModel: Model<DonationLogsDocument>,
    @InjectModel(Anonymous.name)
    private anonymousModel: Model<AnonymousDocument>,
    @InjectModel(CampaignVendorLog.name)
    private campaignVendorLogDocument: Model<CampaignVendorLogDocument>,
    @InjectModel(Campaign.name)
    private campaignModel: Model<CampaignDocument>,
    @InjectModel(Vendor.name)
    private vendorModel: Model<VendorDocument>,
    @InjectModel(PaymentGateway.name)
    private paymentGatewayModel: Model<PaymentGatewayDocument>,
    @InjectModel(Item.name)
    private itemModel: Model<ItemDocument>,
    @InjectModel(PaymentData.name)
    private paymentDataModel: Model<PaymentDataDocument>,
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
  ) { }

  /* apply to become vendor from donor */
  // !Should we implements db transaction? when image upload failed, we should rollback the db transaction,
  // !i can do the db transaction, but how to revoke the image upload?
  async applyVendor(
    userId: string,
    rawDto: DonorApplyVendorDto,
  ): Promise<Vendor> {
    // validate with zod
    let validatedDto: DonorApplyVendorDto;
    try {
      validatedDto = DonorApplyVendorDto.parse(rawDto);
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.log(err);
        throw new BadRequestException(
          {
            statusCode: 400,
            message: `Invalid Create Vendor Input`,
            data: err.issues,
          },
          `Invalid Create Vendor Input`,
        );
      }
    }

    const newVendor = new this.vendorModel();
    // isDeleted, isActive is "N" by default so no need to set it, also _id and timestamps (createdAt, updatedAt) are automatically set by mongoose
    newVendor.vendorId = validatedDto!.vendorId;
    newVendor.ownerUserId = userId;
    newVendor.name = validatedDto!.name;
    newVendor.channels = validatedDto!.channels;
    newVendor.vendorId = validatedDto!.vendorId;

    if (validatedDto!.images && validatedDto!.images.length > 0) {
      let folderType: string = '';
      for (let i = 0; i < validatedDto!.images.length; i++) {
        if (i === 0) folderType = 'coverImage';
        if (i === 1 || i === 2 || i === 3) folderType = 'image';
        if (i === 4) folderType = 'avatar';
        const path = await this.bunnyService.generatePath(
          validatedDto!.organizationId.toString(),
          folderType,
          validatedDto!.images[i].fullName,
          validatedDto!.images[i].imageExtension,
        );
        const base64Data = validatedDto!.images[i].base64Data;
        const binary = Buffer.from(
          validatedDto!.images[i].base64Data,
          'base64',
        );
        if (!binary) {
          const trimmedString = 56;
          base64Data.length > 40
            ? base64Data.substring(0, 40 - 3) + '...'
            : base64Data.substring(0, length);
          throw new BadRequestException(
            `Image payload ${i} is not a valid base64 data: ${trimmedString}`,
          );
        }
        const imageUpload = await this.bunnyService.uploadImage(
          path,
          binary,
          validatedDto!.name,
        );

        if (i === 0 && imageUpload) newVendor.coverImage = path;
        if (i === 1 && imageUpload) newVendor.image1 = path;
        if (i === 2 && imageUpload) newVendor.image2 = path;
        if (i === 3 && imageUpload) newVendor.image3 = path;
        if (i === 4 && imageUpload) newVendor.vendorAvatar = path;
      }
    }
    // return vendorDocument as Vendor
    return await newVendor.save();
  }

  async setFavoriteCampaign(campaignSetFavoriteDto: CampaignSetFavoriteDto) {
    const filter = { donorId: campaignSetFavoriteDto.donorId };
    const update = { favoriteCampaignIds: campaignSetFavoriteDto.campaignIds };

    this.logger.debug(
      `update donor ${campaignSetFavoriteDto.donorId} favorite campaigns: ${campaignSetFavoriteDto.campaignIds}`,
    );
    return await this.donorModel.findOneAndUpdate(filter, update, {
      new: true,
    });
  }

  async submitPayment(
    donorPaymentSubmitDto: DonorPaymentSubmitDto,
  ): Promise<DonationLog> {
    const log = new this.donationLogModel(donorPaymentSubmitDto);
    log.donationLogId = uuidv4();
    log.createdAt = moment().toISOString();
    log.updatedAt = moment().toISOString();
    return log.save();
  }

  async donateSingleItem(
    user: ICurrentUser,
    request: DonorDonateItemDto,
  ): Promise<DonorDonateItemResponse> {
    const pgData = await this.paymentGatewayModel.findOne({
      organizationId: new Types.ObjectId(request.organizationId),
    });

    if (pgData?.name !== 'PAYTABS' || !pgData) {
      throw new BadRequestException(
        `This organization is not allowed to use payment gateway`,
      );
    }

    const donorData = await this.donorModel.findOne({
      ownerUserId: user.id,
      organizationId: new Types.ObjectId(request.organizationId),
    });

    const item = await this.itemModel.findOne({
      _id: new Types.ObjectId(request.itemId),
    });
    if (!item) {
      throw new BadRequestException(`Item not found`);
    }

    let projectId: Types.ObjectId | string = '';

    if (item.projectId) {
      projectId = new Types.ObjectId(item.projectId);
    }

    const paytabsPayload: PaytabsPaymentRequestPayloadModel = {
      profile_id: pgData.profileId!,
      cart_amount: parseFloat(item.defaultPrice!) * request.qty,
      cart_currency: pgData.defaultCurrency! as PaytabsCurrencyEnum,
      cart_description: `donate for ${item.name!}`,
      cart_id: item._id.toString(),
      tran_type: PaytabsTranType.SALE,
      tran_class: PaytabsTranClass.ECOM,
      // !TODO: change the harcoded value with env variable later on
      callback: `https://api-staging.tmra.io/v2/raise/donor/donate-item/callback`,
      framed: true,
      hide_shipping: true,
      customer_details: {
        name: donorData?.firstName + ' ' + donorData?.lastName || '',
        email: donorData?.email || '',
        phone: donorData?.mobile || '',
        street1: donorData?.address || '',
        city: donorData?.city || '',
        state: donorData?.state || '',
        country: donorData?.country || '',
        zip: donorData?.zipcode || '',
      },
    };

    const paytabsResponse = await this.paytabsService.createTransaction(
      paytabsPayload,
      pgData.serverKey!,
    );

    if (!paytabsResponse) {
      throw new BadRequestException(`Paytabs payment failed!`);
    }

    let objectIdDonation = new Types.ObjectId();
    let now = moment().toISOString();

    /* Save to donation log */
    const donationLog = await new this.donationLogModel({
      _id: objectIdDonation,
      organizationId: new Types.ObjectId(request.organizationId),
      donorId: donorData?.ownerUserId || '',
      donorName: donorData?.firstName + ' ' + donorData?.lastName || '',
      amount: parseFloat(item.defaultPrice!) * request.qty,
      createdAt: now,
      updatedAt: now,
      projectId: projectId ? (projectId as Types.ObjectId) : '',
      campaignId: '',
      donorUserId: donorData?.ownerUserId || '',
      currency: pgData.defaultCurrency! as PaytabsCurrencyEnum,
      donationStatus: 'PENDING',
      type: 'item',
      paymentGatewayId: 'PAYTABS',
      transactionId: paytabsResponse.tran_ref,
      purchaseQty: request.qty,
      // ipAddress: paytabsResponse.
    }).save();

    if (!donationLog) {
      throw new Error('Donation log not saved correctly!');
    }

    /* Save to payment data */
    const insertPaymentData = await new this.paymentDataModel({
      _id: new Types.ObjectId(),
      donationId: objectIdDonation,
      merchantId: pgData.profileId,
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
      paymentStatus: 'PENDING',
    }).save();

    if (!insertPaymentData) {
      throw new Error('Payment data not saved correctly!');
    }

    const response: DonorDonateItemResponse = {
      donationLogResponse: donationLog,
      paymentDataResponse: insertPaymentData,
      paytabsResponse,
    };
    return response;
  }

  async donateSingleItemCallback(request: PaytabsIpnWebhookResponsePayload) {
    const donationLog = await this.donationLogModel.findOne({
      transactionId: request.tran_ref,
    });
    if (!donationLog) {
      throw new BadRequestException(`Donation log not found`);
    }

    let status: DonationStatus = DonationStatus.pending;
    switch (request.payment_result.response_status) {
      case PaytabsResponseStatus.A:
        status = DonationStatus.success;
        break;
      case PaytabsResponseStatus.D:
        status = DonationStatus.declined;
        break;
      case PaytabsResponseStatus.E:
        status = DonationStatus.error;
        break;
      case PaytabsResponseStatus.H:
        status = DonationStatus.hold;
        break;
      case PaytabsResponseStatus.P:
        status = DonationStatus.pending;
        break;
      case PaytabsResponseStatus.V:
        status = DonationStatus.voided;
        break;
    }
    console.log('payment status', status);

    donationLog.donationStatus = status;
    donationLog.ipAddress = request.customer_details?.ip || '';
    donationLog.updatedAt = moment().toISOString();

    console.log('updating donation log');
    const updateDonationLog = await donationLog.save();
    if (!updateDonationLog) {
      throw new Error('Donation log not updated correctly!');
    }

    const paymentData = await this.paymentDataModel.findOne({
      orderId: request.tran_ref,
    });
    if (!paymentData) {
      throw new BadRequestException(`Payment data not found`);
    }
    paymentData.cardType = request.payment_info?.card_type || '';
    paymentData.cardScheme = request.payment_info?.card_scheme || '';
    paymentData.paymentDescription =
      request.payment_info?.payment_description || '';
    paymentData.expiryMonth =
      Number(request.payment_info?.expiryMonth) || undefined;
    paymentData.expiryYear =
      Number(request.payment_info?.expiryYear) || undefined;
    paymentData.responseStatus = request.payment_result?.response_status || '';
    paymentData.responseCode = request.payment_result?.response_code || '';
    paymentData.responseMessage =
      request.payment_result?.response_message || '';
    paymentData.cvvResult = request.payment_result?.cvv_result || '';
    paymentData.avsResult = request.payment_result?.avs_result || '';
    paymentData.transactionTime =
      request.payment_result?.transaction_time || '';
    paymentData.paymentStatus = request.payment_result?.response_message || '';
    console.log('updating payment data');
    const updatePaymentData = await paymentData.save();
    if (!updatePaymentData) {
      throw new Error('Payment data not updated correctly!');
    }

    const item = await this.itemModel.findOne({
      _id: new Types.ObjectId(request.cart_id),
    });
    if (!item) {
      throw new BadRequestException(`Item not found`);
    }
    if (request.payment_result.response_status === PaytabsResponseStatus.A) {
      if (
        item &&
        item.totalNeed &&
        Number(item.totalNeed) > 0 &&
        donationLog &&
        donationLog.purchaseQty
      ) {
        let updatedQty = Number(item.totalNeed) - donationLog.purchaseQty;
        item.totalNeed = updatedQty.toString();
      }
    }
    item.updatedAt = moment().toISOString();
    console.log('updating item stock');
    const updateItem = await item.save();
    if (!updateItem) {
      throw new Error('Item not updated correctly!');
    }

    // update target of project (?)
    // const project = await this.projectModel.findOne({
    //   _id: new Types.ObjectId(item.projectId),
    // });
    // if (!project) {
    //   throw new BadRequestException(`Project not found`);
    // }
    // project.updatedAt = moment().toISOString();
  }

  async getDonor(donorId: string) {
    this.logger.debug(`Get Donor ${donorId}...`);
    let donor = null;
    if (!Types.ObjectId.isValid(donorId)) {
      donor = await this.donorModel.findOne({
        ownerUserId: donorId,
      });
    } else {
      donor = await this.donorModel.findOne({
        _id: donorId,
      });
    }
    if (!donor) {
      return {
        statusCode: 404,
        message: 'Donor not found',
      };
    }
    return {
      statusCode: 200,
      donor,
    };
  }

  async getDonorListAll(organizationId: string) {
    this.logger.debug('Get donor who participating in volunteer..');
    const data = await this.volunteerModel.aggregate([
      {
        $lookup: {
          from: 'donor',
          localField: 'donorId',
          foreignField: 'ownerUserId',
          as: 'a',
        },
      },
      {
        $unwind: {
          path: '$a',
        },
      },
      {
        $lookup: {
          from: 'volunteerTaskLog',
          localField: '_id',
          foreignField: 'volunteerId',
          as: 'b',
        },
      },
      {
        $unwind: {
          path: '$b',
        },
      },
      {
        $group: {
          _id: '$a._id',
          firstName: { $first: '$a.firstName' },
          lastName: { $first: '$a.lastName' },
          dateJoin: { $first: '$createdAt' },
          orgId: { $first: '$a.organizationId' },
          status: { $first: '$b.status' },
          lastUpdate: { $max: '$b.updatedAt' },
        },
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          dateJoin: 1,
          orgId: 1,
          status: 1,
        },
      },
      {
        $match: {
          orgId: organizationId,
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    if (!data) {
      return {
        statusCode: 404,
        message: 'Donor not found',
      };
    }
    return {
      statusCode: 200,
      data,
    };
  }

  async addAnonymousDonor(donorAddProfileDto: DonorUpdateProfileDto) {
    const newDonor = new this.anonymousModel(donorAddProfileDto);
    newDonor.createdAt = new Date();
    newDonor.save();

    if (!newDonor) {
      return {
        statusCode: 400,
        message: 'Failed',
      };
    }
    return {
      statusCode: 200,
      donor: newDonor,
    };
  }

  async updateUserProfile(userId: string, imageUrl: string) {
    const fusionauth = new FusionAuthClient(
      this.configService.get('FUSIONAUTH_ADMIN_KEY', ''),
      this.configService.get('FUSIONAUTH_URL', ''),
      this.configService.get('FUSIONAUTH_TENANT_ID', ''),
    );
    // console.log(this.configService.get('FUSIONAUTH_URL', ''));
    try {
      await fusionauth.patchUser(userId, {
        user: {
          imageUrl: imageUrl,
        },
      });
      this.logger.debug('Successfully changed profile');
    } catch (err) {
      const errMessage = err.exception
        ? err.exception
        : `Sorry, we couldn't update your profile picture`;
      this.logger.debug(errMessage);
    }
  }

  async updateDonor(
    donorId: string,
    donorUpdateProfileDto: DonorUpdateProfileDto,
  ) {
    this.logger.debug(`Get Donor ${donorId}...`);
    this.logger.debug(Types.ObjectId.isValid(donorId));
    let donorUpdated = null;
    if (Types.ObjectId.isValid(donorId)) {
      donorUpdated = await this.donorModel.findOneAndUpdate(
        { _id: donorId },
        donorUpdateProfileDto,
        { new: true },
      );
    } else {
      donorUpdated = await this.donorModel.findOneAndUpdate(
        { ownerUserId: donorId },
        donorUpdateProfileDto,
        { new: true },
      );
    }

    if (!donorUpdated) {
      return {
        statusCode: 400,
        message: 'Failed',
      };
    }

    if (donorUpdated && donorUpdateProfileDto.profilePic) {
      this.updateUserProfile(
        donorUpdated.ownerUserId,
        donorUpdateProfileDto.profilePic,
      );
    }
    return {
      statusCode: 200,
      donor: donorUpdated,
    };
  }

  async getDonationLogs(
    donorUserId: string,
    sortDate: string,
    sortStatus: string,
  ) {
    this.logger.debug('Get Donation logs...');
    let sortData = {};
    if (sortDate) {
      sortData = {
        createdAt: sortDate == 'asc' ? 1 : -1,
      };
    } else if (sortStatus) {
      sortData = {
        donationStatus: sortStatus == 'asc' ? 1 : -1,
        createdAt: -1,
      };
    } else {
      sortData = {
        createdAt: -1,
      };
    }
    const donationLogList = await this.donationLogsModel.aggregate([
      {
        $match: { donorUserId: donorUserId },
      },
      {
        $lookup: {
          from: 'campaign',
          localField: 'campaignId',
          foreignField: '_id',
          as: 'campaign',
        },
      },
      {
        $unwind: {
          path: '$campaign',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'organization',
          localField: 'nonprofitRealmId',
          foreignField: '_id',
          as: 'organization',
        },
      },
      {
        $unwind: {
          path: '$organization',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          createdAt: { $first: '$createdAt' },
          donationStatus: { $first: '$donationStatus' },
          amount: { $first: '$amount' },
          campaignName: { $first: '$campaign.campaignName' },
          campaignType: { $first: '$campaign.campaignType' },
          organizationName: { $first: '$organization.name' },
        },
      },
      {
        $sort: sortData,
      },
    ]);
    return donationLogList;
  }

  @ApiOperation({ summary: 'Get Total donationbyId' })
  async getTotalDonation(donorUserId: string, currencyCode: string) {
    let currency = currencyCode ?? 'USD';
    this.logger.debug('Get Donation logs...');
    const donationId = await this.donorModel.findOne({
      ownerUserId: donorUserId,
    });
    if (!donationId) {
      throw new NotFoundException(`donorUserId must be valid`);
    }

    const totalDonation = await this.donationLogsModel.aggregate([
      {
        $match: {
          donationStatus: 'SUCCESS',
          donorUserId,
          currencyCode: currency,
        },
      },
      {
        $group: {
          _id: '$donorUserId',
          totalPersonDonation: {
            $sum: {
              $toDouble: '$amount',
            },
          },
          personDonation: {
            $first: {
              $toDouble: '$amount',
            },
          },
          currencyCode: {
            $first: '$currency',
          },
        },
      },
    ]);

    const totalFundDonation = await this.donationLogsModel.aggregate([
      {
        $match: { donationStatus: 'SUCCESS', currencyCode: currency },
      },
      {
        $group: {
          _id: '$donationStatus',
          amountTotalDonation: { $sum: '$amount' },
          currencyCode: {
            $first: '$currency',
          },
        },
      },
    ]);

    const campaignLogs = await this.campaignModel.aggregate([
      { $match: { isPublished: 'Y', currencyCode: currency } },
      {
        $group: {
          _id: 'isPublished',
          totalProgram: { $sum: '$amountTarget' },
          currencyCode: { $first: '$currencyCode' },
        },
      },
    ]);

    return { totalDonation, totalFundDonation, programFund: campaignLogs };
  }

  async getHistoryAllSuccess(donorId: string) {
    const ObjectId = require('mongoose').Types.ObjectId;
    let data: any = {};

    // const dataDonor = await this.donorModel.findOne({
    //   ownerUserId: donorId,
    // });

    // this.logger.debug('debug donor name', dataDonor);

    const getData = await this.donationLogModel.aggregate([
      {
        $lookup: {
          from: 'donor',
          localField: 'donorId',
          foreignField: 'ownerUserId',
          as: 'a',
        },
      },
      { $unwind: { path: '$a', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          name: '$a.firstName',
          email: '$a.email',
          date: '$createdAt',
        },
      },
      {
        $match: { email: { $exists: true } },
      },
      {
        $project: {
          _id: 1,
          organizationId: 1,
          projectId: 1,
          campaignId: 1,
          donorId: 1,
          itemId: 1,
          type: 1,
          donationStatus: 1,
          paymentGatewayId: 1,
          amount: 1,
          currency: 1,
          transactionId: 1,
          ipAddress: 1,
          createdAt: 1,
          updatedAt: 1,
          donationLogId: 1,
          date: 1,
          name: 1,
          email: 1,
        },
      },
      {
        $match: {
          donationStatus: 'success',
          donorId: donorId,
        },
      },
      { $sort: { _id: -1 } },
    ]);

    data.activities = getData;

    return data;
  }

  async getTotalDonationDonor(donorId: string, currency: string) {
    this.logger.debug(`getTotalDonorSummary donorId=${donorId}`);
    const getDonor = await this.donorModel.findOne({
      _id: donorId,
    });
    if (!getDonor) {
      const txtMessage = `request rejected donorId not found`;
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

    const getDateQuery = (filterBy: string) => {
      const date = new Date();
      const tomorrow = new Date(date.getDate() + 1);

      switch (filterBy) {
        case 'year':
          return {
            $exists: true,
            $lt: date,
          };
        case 'month':
          return {
            $exists: true,
            $gte: tomorrow,
          };
        default:
          const sevenDaysAgo: Date = new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
          );
          return {
            $gte: sevenDaysAgo,
          };
      }
    };
    const totalProgram = await this.campaignModel
      .where({
        organizationId: new Types.ObjectId(donorId),
        createdAt: getDateQuery('week'),
      })
      .count();

    const totalDonor = await this.donorModel
      .where({
        donorId: new Types.ObjectId(donorId),
        createdAt: getDateQuery('week'),
      })
      .count();

    const donationList = await this.donationLogModel.aggregate([
      {
        $match: {
          donorId: new Types.ObjectId(donorId),
          donationStatus: 'SUCCESS',
          createdAt: getDateQuery('week'),
        },
      },
      {
        $group: {
          _id: { donorId: '$donorId' },
          total: { $sum: '$amount' },
        },
      },
    ]);

    const totalDonation = donationList.length == 0 ? 0 : donationList[0].total;

    const returningDonorAgg = await this.donationLogModel.aggregate([
      {
        $match: {
          donorId: new Types.ObjectId(donorId),
          donationStatus: 'SUCCESS',
          donorUserId: { $ne: null },
          createdAt: getDateQuery('week'),
        },
      },
      {
        $lookup: {
          from: 'donor',
          localField: 'donorUserId',
          foreignField: 'ownerUserId',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
        },
      },
      {
        $group: {
          _id: '$donorUserId',
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ]);
    // console.log(totalReturningDonor);

    const mostPopularProgramsDiagram = await this.donationLogModel.aggregate([
      {
        $match: {
          donorId: new Types.ObjectId(donorId),
          donationStatus: 'SUCCESS',
          donorUserId: { $ne: null },
          createdAt: getDateQuery('week'),
        },
      },
      {
        $lookup: {
          from: 'campaign',
          localField: 'campaignId',
          foreignField: '_id',
          as: 'campaign',
        },
      },
      {
        $unwind: {
          path: '$campaign',
        },
      },
      {
        $addFields: {
          name: {
            $cond: {
              if: { $eq: [{ $ifNull: ['$campaign.title', 0] }, 0] },
              then: '$campaign.campaignName',
              else: '$campaign.title',
            },
          },
        },
      },
      {
        $group: {
          _id: '$campaign._id',
          campaignName: { $first: '$name' },
          count: { $sum: 1 },
        },
      },
    ]);
    console.log(mostPopularProgramsDiagram);

    const totalDonationPerProgram = await this.donationLogModel.aggregate([
      {
        $match: {
          donorId: new Types.ObjectId(donorId),
          donationStatus: 'SUCCESS',
          donorUserId: { $ne: null },
          createdAt: getDateQuery('week'),
        },
      },
      {
        $lookup: {
          from: 'campaign',
          localField: 'campaignId',
          foreignField: '_id',
          as: 'campaign',
        },
      },
      {
        $unwind: {
          path: '$campaign',
        },
      },
      {
        $addFields: {
          name: {
            $cond: {
              if: { $eq: [{ $ifNull: ['$campaign.title', 0] }, 0] },
              then: '$campaign.campaignName',
              else: '$campaign.title',
            },
          },
        },
      },
      {
        $group: {
          _id: '$campaign._id',
          campaignName: { $first: '$name' },
          total_donation: { $sum: '$amount' },
        },
      },
    ]);

    const campaignPerType = await this.campaignModel
      .where({
        donorId: new Types.ObjectId(donorId),
        createdAt: getDateQuery('week'),
      })
      .select({
        _id: 1,
        title: 1,
        campaignType: 1,
        amountProgress: 1,
        amountTarget: 1,
      });
    const donorList = await this.donationLogModel.aggregate([
      {
        $match: {
          donorId: new Types.ObjectId(donorId),
          donationStatus: 'SUCCESS',
          donorUserId: { $ne: null },
          createdAt: getDateQuery('week'),
        },
      },
      {
        $lookup: {
          from: 'donor',
          localField: 'donorUserId',
          foreignField: 'ownerUserId',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
        },
      },
      {
        $group: {
          _id: '$donorUserId',
          donorId: { $first: '$user._id' },
          firstName: { $first: '$user.firstName' },
          lastName: { $first: '$user.lastName' },
          email: { $first: '$user.email' },
          country: { $first: '$user.country' },
          mobile: { $first: '$user.mobile' },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    return {
      total_donation: totalDonation,
      total_program: totalProgram,
      total_donor: totalDonor,
      total_returning_donor: returningDonorAgg.length,
      most_popular_programs: mostPopularProgramsDiagram,
      total_donation_program: totalDonationPerProgram,
      campaign_per_type: campaignPerType.slice(0, 5),
      donor_list: donorList,
    };
  }

  /** Get All Donor Transaction List / Exlude Zakat Campaign Trx */
  // async getTrxDonorList(filter: DonorListTrxDto): Promise<AggregatePaginateResult<DonationLogDocument>> {
  async getTrxDonorList(filter: DonorListTrxDto): Promise<AggregatePaginateResult<DonationLogsDocument>> {
    this.logger.debug(`getTransactions Donors organizationId=${filter.organizationId}`);
    const { limit = 10, page = 1, createdAt, donationStatus, amount, email } = filter;
    let sortData = {};

    sortData = {
      _id: createdAt == 'asc' ? 1 : -1
    };

    if (createdAt) {
      sortData = {
        createdAt: createdAt == 'asc' ? 1 : -1
      };
    }
    if (donationStatus) {
      sortData = {
        donationStatus: donationStatus == 'asc' ? 1 : -1
      };
    }
    if (amount) {
      sortData = {
        amount: amount == 'asc' ? 1 : -1
      };
    }
    if (email) {
      sortData = {
        email: email == 'asc' ? 1 : -1
      };
    }
    //console.log('currency', 'orgsID', new Types.ObjectId(filter.organizationId));

    const exZakat = filter.exZktList ? filter.exZktList : '6299ed6a9f1ad428563563ed';
    //const aggregateQuerry = this.donationLogsModel.aggregate();
    // const aggregateQuerry = this.donationLogsModel.aggregate([
    const aggregateQuerry = this.donationLogModel.aggregate([
      {
        $match: {
          nonprofitRealmId: new Types.ObjectId(filter.organizationId),
          campaignId: { $nin: [new Types.ObjectId(exZakat)] }
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'donorUserId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'anonymous',
          localField: '_id',
          foreignField: 'donationLogId',
          as: 'anonymous',
        },
      },
      {
        $unwind: {
          path: '$anonymous',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          donorName: {
            $cond: {
              if: { $eq: [{ $ifNull: ['$user', 0] }, 0] },
              then: {
                $concat: ['$anonymous.firstName', ' ', '$anonymous.lastName'],
              },
              else: {
                $concat: ['$user.firstname', ' ', '$user.lastname'],
              },
            },
          },
          email: {
            $cond: [
              { $eq: [{ $ifNull: ['$user', 0] }, 0] },
              '$anonymous.email',
              '$user.email',
            ],
          },
        },
      },
      // {
      //   $match:
      //   {
      //     nonprofitRealmId: new Types.ObjectId(filter.organizationId),
      //     campaignId: { $nin: [new Types.ObjectId(exZakat)] }
      //   }
      // }
      // ,
      {
        $group: {
          _id: '$_id',
          createdAt: { $first: '$createdAt' },
          donationStatus: { $first: '$donationStatus' },
          amount: { $first: '$amount' },
          donorName: { $first: '$donorName' },
          email: { $first: '$email' },
        },
      }
      // ,
      // {
      //   $sort: sortData,
      // },
    ]);

    const donorTrxList =
      // await this.campaignAggregatePaginateModel.aggregatePaginate(
      await this.donorLogsAggregatePaginateModel.aggregatePaginate(
        aggregateQuerry,
        {
          page,
          limit,
          sort: sortData
        },
      );
    console.log('Ini logs ==>', donorTrxList);
    return donorTrxList;

  }

  /** Get All Donor List  */
  async getDonorList(filter: DonorListDto): Promise<AggregatePaginateResult<Donor>> {
    this.logger.debug(`get Donors list organizationId=${filter.organizationId}`);
    const { limit = 10, page = 1, organizationId, firstName, lastName, email, phoneNumber, country, type } = filter;
    let sortData = {};

    sortData = {
      _id: firstName == 'asc' ? 1 : -1
    };

    if (firstName) {
      sortData = {
        firstName: firstName == 'asc' ? 1 : -1
      };
    }
    if (lastName) {
      sortData = {
        lastName: lastName == 'asc' ? 1 : -1
      };
    }
    if (email) {
      sortData = {
        email: email == 'asc' ? 1 : -1
      };
    }
    if (phoneNumber) {
      sortData = {
        phoneNumber: phoneNumber == 'asc' ? 1 : -1
      };
    }
    if (country) {
      sortData = {
        country: country == 'asc' ? 1 : -1
      };
    }
    if (type) {
      sortData = {
        type: type == 'asc' ? 1 : -1
      };
    }

    const aggregateQuerry = this.donorModel.aggregate([
      {
        $match: {
          organizationId: organizationId
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'ownerUserId',
          foreignField: '_id',
          as: 'users'
        },
      },
      {
        $unwind: {
          path: '$users',
          preserveNullAndEmptyArrays: true
        },
      },

      {
        $group: {
          _id: '$_id',
          firstName: { $first: '$firstName' },
          lastName: { $first: '$lastName' },
          email: { $first: '$email' },
          phoneNumber: { $first: '$mobile' },
          country: { $first: '$country' },
          type: { $first: '$users.type' }
        },
      }
    ]);

    const donorList =
      await this.donorAggregatePaginateModel.aggregatePaginate(
        aggregateQuerry,
        {
          page,
          limit,
          sort: sortData
        },
      );
    return donorList;

  }



}
