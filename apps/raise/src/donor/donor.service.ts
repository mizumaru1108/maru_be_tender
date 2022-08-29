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
import { Model, Types } from 'mongoose';
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
import { PaytabsTranClass } from '../libs/payment-paytabs/enums/paytabs-tran-class.enum';
import { PaytabsTranType } from '../libs/payment-paytabs/enums/paytabs-tran-type.enum';
import { PaytabsPaymentRequestPayloadModel } from '../libs/payment-paytabs/models/paytabs-payment-request-payload.model';
import { PaymentPaytabsService } from '../libs/payment-paytabs/payment-paytabs.service';
import { rootLogger } from '../logger';
import {
  PaymentData,
  PaymentDataDocument,
} from '../payment-stripe/schema/paymentData.schema';
import { ICurrentUser } from '../user/interfaces/current-user.interface';
import { DonorPaymentSubmitDto, DonorUpdateProfileDto } from './dto';
import { DonorApplyVendorDto } from './dto/donor-apply-vendor.dto';
import { DonorDonateItemResponse } from './dto/donor-donate-item-response';
import { DonorDonateItemDto } from './dto/donor-donate-item.dto';
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
    private bunnyService: BunnyService,
    private configService: ConfigService,
    @InjectModel(Donor.name)
    private donorModel: Model<DonorDocument>,
    @InjectModel(Volunteer.name)
    private volunteerModel: Model<VolunteerDocument>,
    @InjectModel(DonationLog.name)
    private donationLogModel: Model<DonationLogDocument>,
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
    private paytabsService: PaymentPaytabsService, // no need to import in donor module (modular utils)
  ) {}

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

    let campaignId: string = '';
    let projectId: string = '';

    if (request.campaignId) {
      campaignId = request.campaignId;
    }

    if (request.projectId) {
      projectId = request.projectId;
    }
    if (item.projectId) {
      projectId = item.projectId;
    }

    const paytabsPayload: PaytabsPaymentRequestPayloadModel = {
      profile_id: pgData.profileId!,
      cart_amount: parseFloat(item.defaultPrice!) * request.qty,
      cart_currency: pgData.defaultCurrency! as PaytabsCurrencyEnum,
      cart_description: `donate for ${item.name!}`,
      cart_id: item.id,
      tran_type: PaytabsTranType.SALE,
      tran_class: PaytabsTranClass.ECOM,
      callback: `https://70d9-2001-448a-2082-43c8-4923-634d-7f55-6d7d.ap.ngrok.io/donate-item/callback`,
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
    let now: Date = new Date();

    /* Save to donation log */
    const donationLog = await new this.donationLogModel({
      _id: objectIdDonation,
      organizationId: request.organizationId,
      donorId: donorData?.ownerUserId || '',
      donorName: donorData?.firstName + ' ' + donorData?.lastName || '',
      amount: parseFloat(item.defaultPrice!) * request.qty,
      createdAt: now,
      updatedAt: now,
      projectId,
      campaignId,
      donorUserId: donorData?.ownerUserId || '',
      currency: pgData.defaultCurrency! as PaytabsCurrencyEnum,
      donationStatus: 'PENDING',
      type: 'item',
      paymentGatewayId: 'PAYTABS',
      transactionId: paytabsResponse.tran_ref,
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
    const paymentData = await this.paymentDataModel.findOne({
      donationId: donationLog.id,
    });
    if (!paymentData) {
      throw new BadRequestException(`Payment data not found`);
    }
    const pgData = await this.paymentGatewayModel.findOne({
      organizationId: donationLog.organizationId,
    });
    if (!pgData) {
      throw new BadRequestException(`Payment gateway not found`);
    }
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
}
