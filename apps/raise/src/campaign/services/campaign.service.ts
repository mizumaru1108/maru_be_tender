import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import {
  AggregatePaginateModel,
  AggregatePaginateResult,
  FilterQuery,
  Model,
  SortOrder,
  Types,
} from 'mongoose';

import {
  CampaignVendorLog,
  CampaignVendorLogDocument,
  Vendor,
  VendorDocument,
} from '../../buying/vendor/vendor.schema';
import { validateObjectId } from '../../commons/utils/validateObjectId';
import { BunnyService } from '../../libs/bunny/services/bunny.service';
import { rootLogger } from '../../logger';
import {
  Operator,
  OperatorDocument,
} from '../../operator/schema/operator.schema';
import { RoleEnum } from '../../user/enums/role-enum';
import { User, UserDocument } from '../../user/schema/user.schema';
import { CampaignApplyVendorDto } from '../dto/apply-vendor.dto';
import { ApproveCampaignResponseDto } from '../dto/approve-campaign-response.dto';
import { CampaignCreateResponse } from '../dto/campaign-create-response.dto';
import { CampaignCreateDto } from '../dto/campaign-create.dto';
import { CampaignDonorOnOperatorDasboardFilter } from '../dto/campaign-donor-on-operator-dashboard-filter.dto';
import { CampaignDonorOnOperatorDasboardParam } from '../dto/campaign-donor-on-operator-dashboard-param.dto';
import { CampaignGetAllVendorRequestDto } from '../dto/campaign-get-all-vendor-request.dto';
import { CampaignUpdateDto } from '../dto/campaign-update.dto';
import { CreateCampaignDto } from '../dto/create-campaign.dto';
import { GetAllMyCampaignFilterDto } from '../dto/get-all-my-campaign.dto';
import { GetAllNewCampaignFilter } from '../dto/get-all-new-campaign-filter.dto';
import { UpdateCampaignStatusDto } from '../dto/update-campaign-status.dto';
import { CampaignSortByEnum } from '../enums/campaign-sortby-enum';
import { CampaignStatus } from '../enums/campaign-status.enum';
import { Campaign, CampaignDocument } from '../schema/campaign.schema';
@Injectable()
export class CampaignService {
  private logger = rootLogger.child({ logger: CampaignService.name });
  constructor(
    @InjectModel(Campaign.name)
    private campaignModel: Model<CampaignDocument>,
    @InjectModel(Campaign.name)
    private campaignAggregatePaginateModel: AggregatePaginateModel<CampaignDocument>,
    @InjectModel(Operator.name)
    private operatorModel: Model<OperatorDocument>,
    @InjectModel(CampaignVendorLog.name)
    private campaignVendorLogModel: Model<CampaignVendorLogDocument>,
    @InjectModel(Vendor.name)
    private vendorModel: Model<VendorDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private configService: ConfigService,
    private bunnyService: BunnyService,
  ) {}

  async campaignCreate(
    creatorId: string,
    request: CampaignCreateDto,
  ): Promise<CampaignCreateResponse> {
    const baseCampaignScheme = new this.campaignModel();
    const campaignScheme = Campaign.mapFromRequest(baseCampaignScheme, request);
    campaignScheme.creatorUserId = creatorId;
    campaignScheme.createdAt = dayjs().toISOString();

    let tmpPath: string[] = []; // for implementing db transaction later on
    try {
      const processImages = request.images.map(async (image, index) => {
        const path = await this.bunnyService.generatePath(
          request.organizationId,
          'campaign-photo',
          image.fullName,
          image.imageExtension,
          campaignScheme._id,
        );
        tmpPath.push(path);

        const base64Data = image.base64Data;
        const binary = Buffer.from(image.base64Data, 'base64');
        if (!binary) {
          const trimmedString = 56;
          base64Data.length > 40
            ? base64Data.substring(0, 40 - 3) + '...'
            : base64Data.substring(0, length);
          throw new BadRequestException(
            `Image payload on images[${index}] is not a valid base64 data: ${trimmedString}`,
          );
        }
        const imageUpload = await this.bunnyService.uploadImage(
          path,
          binary,
          campaignScheme.campaignName,
        );
        if (!imageUpload) {
          throw new InternalServerErrorException(
            `Error uploading image[${index}] to Bunny ${path} (${binary.length} bytes) while creating campaign: ${campaignScheme.campaignName}`,
          );
        }

        //set the number of maximum file uploaded = 4 (included coverImage)
        if (index == 0 && imageUpload) campaignScheme.coverImage = path;
        if (index == 1 && imageUpload) campaignScheme.image1 = path;
        if (index == 2 && imageUpload) campaignScheme.image2 = path;
        if (index == 3 && imageUpload) campaignScheme.image3 = path;
      });

      await Promise.all(processImages);
    } catch (error) {
      console.log('error', error);
      if (error.response) {
        throw new HttpException(
          error.response.message,
          error.response.statusCode,
        );
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    //insert into Campaign
    const createdCampaign = await campaignScheme.save();
    if (!createdCampaign) {
      throw new InternalServerErrorException(
        `Error creating campaign: ${campaignScheme.campaignName}`,
      );
    }

    //insert into Campaign Vendor Log
    let createdCampaignVendorLog: CampaignVendorLog | null = null;
    const campaignVendorLogSchema = new this.campaignVendorLogModel();
    if (createdCampaign) {
      campaignVendorLogSchema._id = new Types.ObjectId();
      campaignVendorLogSchema.campaignId = createdCampaign._id;
      campaignVendorLogSchema.createdAt = dayjs().toISOString();
      campaignVendorLogSchema.updatedAt = dayjs().toISOString();
      createdCampaignVendorLog = await campaignVendorLogSchema.save();

      if (!createdCampaignVendorLog) {
        throw new InternalServerErrorException(
          `Error creating campaign vendor log: ${campaignScheme.campaignName}`,
        );
      }
    }

    const response: CampaignCreateResponse = {
      createdCampaign,
      createdCampaignVendorLog,
    };

    return response;
  }

  /**
   * refactored from current updateCampaign (func above)
   */
  async campaignUpdate(
    userId: string,
    campaignId: string,
    request: CampaignUpdateDto,
  ): Promise<Campaign> {
    validateObjectId(campaignId);
    const currentCampaignData = await this.campaignModel.findById(
      new Types.ObjectId(campaignId),
    );
    if (!currentCampaignData) {
      throw new NotFoundException(`Campaign with id ${campaignId} not found`);
    }

    const updateCampaignData = Campaign.mapFromRequest(
      currentCampaignData,
      request,
    );

    updateCampaignData.updaterUserId = userId;
    updateCampaignData.updatedAt = dayjs().toISOString();

    let tmpPath: string[] = []; //for implement db transaction later
    try {
      const processImages = request.updatedImage.map(async (image, index) => {
        if (image.newImage) {
          const imagePath = await this.bunnyService.generatePath(
            request.organizationId,
            'campaign-photo',
            image.newImage.fullName,
            image.newImage.imageExtension,
            campaignId,
          );
          const binary = Buffer.from(image.newImage.base64Data, 'base64');
          const imageUpload = await this.bunnyService.uploadImage(
            imagePath,
            binary,
            request.campaignName,
          );
          if (!imageUpload) {
            throw new Error(`Failed to upload at updatedImage[${index}]`);
          }
          if (image.oldUrl) {
            const isExist = await this.bunnyService.checkIfImageExists(
              image.oldUrl,
            );
            if (isExist) {
              const deleteImages = await this.bunnyService.deleteImage(
                image.oldUrl,
              );
              if (!deleteImages) {
                throw new Error(`Failed to delete at updatedImage[${index}]`);
              }
            }
          }
          if (index === 0 && imageUpload)
            updateCampaignData.coverImage = imagePath;
          if (index === 1 && imageUpload) updateCampaignData.image1 = imagePath;
          if (index === 2 && imageUpload) updateCampaignData.image2 = imagePath;
          if (index === 3 && imageUpload) updateCampaignData.image3 = imagePath;
        }
      });
      await Promise.all(processImages);
    } catch (error) {
      console.log('error', error);
      if (error.response) {
        throw new HttpException(
          error.response.message,
          error.response.statusCode,
        );
      } else {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    //update campaign
    const updatedCampaign = await updateCampaignData.save();
    if (!updatedCampaign) {
      throw new Error('Failed to update campaign');
    }
    return updatedCampaign;
  }

  async findAll(
    organizationId: string,
    isFinished: string,
    publishedSort: string,
    finishedSort: string,
  ) {
    this.logger.debug(`getCampaignList organizationId=${organizationId}`);
    let sortData = {};
    if (publishedSort) {
      sortData = {
        isPublished: publishedSort == 'asc' ? 1 : -1,
      };
    } else if (finishedSort) {
      sortData = {
        isFinished: finishedSort == 'asc' ? 1 : -1,
        createdAt: -1,
      };
    } else {
      sortData = {
        createdAt: -1,
      };
    }

    let filter = {};

    const ObjectId = require('mongoose').Types.ObjectId;
    if (organizationId && organizationId) {
      filter = {
        isFinished: isFinished,
        organizationId: ObjectId(organizationId),
      };
    } else if (isFinished) {
      filter = { isFinished: isFinished };
    } else if (organizationId) {
      filter = { organizationId: ObjectId(organizationId) };
    }
    return await this.campaignModel.find(filter).sort(sortData).exec();
  }

  async getAllPublished(organizationId: string) {
    const ObjectId = require('mongoose').Types.ObjectId;
    const data = await this.campaignModel.aggregate([
      {
        $match: {
          organizationId: ObjectId(organizationId),
          isPublished: 'Y',
          isDeleted: 'N',
        },
      },
      {
        $addFields: {
          amountProgress: { $toDouble: '$amountProgress' },
          amountTarget: { $toDouble: '$amountTarget' },
        },
      },
      {
        $project: {
          amountProgress: 1,
          amountTarget: 1,
          coverImage: 1,
          createdAt: 1,
          updatedAt: 1,
          description: 1,
          organizationId: 1,
          campaignName: 1,
          currencyCode: 1,
          _id: 1,
        },
      },
    ]);

    return data;
  }

  async getAllByOrganizationId(organizationId: string) {
    const ObjectId = require('mongoose').Types.ObjectId;
    const campaignList = await this.campaignModel
      .aggregate([
        { $match: { organizationId: ObjectId(organizationId) } },
        {
          $project: {
            campaignName: 1,
            campaignType: 1,
            updatedAt: 1,
            createdAt: 1,
            status: 1,
            foo_count: { $size: '$milestone' },
          },
        },
        {
          $lookup: {
            from: 'campaignVendorLog',
            localField: '_id',
            foreignField: 'campaignId',
            as: 'campaignVendorLog',
          },
        },
        {
          $unwind: {
            path: '$campaignVendorLog',
          },
        },
        {
          $group: {
            _id: '$_id',
            name: { $first: '$campaignName' },
            type: { $first: '$campaignType' },
            updatedAt: { $first: '$updatedAt' },
            createdAt: { $first: '$createdAt' },
            status: { $first: '$campaignVendorLog.status' },
            milestone: { $first: '$foo_count' },
          },
        },
        { $sort: { _id: -1, createdAt: 1 } },
      ])
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return `DB error: ${err}`;
      });

    return campaignList;
  }

  async getAllByOperatorId(organizationId: string, operatorId: string) {
    const ObjectId = require('mongoose').Types.ObjectId;

    if (!operatorId) {
      throw new NotFoundException(`OperatorId must be not null`);
    }

    if (!organizationId) {
      throw new NotFoundException(`OrganizationId must be not null`);
    }

    const campaignList = await this.campaignModel.aggregate([
      {
        $match: {
          organizationId: ObjectId(organizationId),
          creatorUserId: operatorId,
          isDeleted: { $regex: 'n', $options: 'i' }, // hide deleted campaign
        },
      },
      {
        $project: {
          campaignName: 1,
          campaignType: 1,
          updatedAt: 1,
          createdAt: 1,
          status: 1,
          foo_count: { $size: '$milestone' },
        },
      },
      {
        $lookup: {
          from: 'campaignVendorLog',
          localField: '_id',
          foreignField: 'campaignId',
          as: 'campaignVendorLog',
        },
      },
      {
        $unwind: {
          path: '$campaignVendorLog',
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$campaignName' },
          type: { $first: '$campaignType' },
          updatedAt: { $first: '$updatedAt' },
          createdAt: { $first: '$createdAt' },
          status: { $first: '$campaignVendorLog.status' },
          milestone: { $first: '$foo_count' },
        },
      },
      { $sort: { _id: -1, creaatedAt: 1 } },
    ]);

    return campaignList;
  }

  async getCampaignDonorListOnOperatorDashboard(
    param: CampaignDonorOnOperatorDasboardParam,
    filter: CampaignDonorOnOperatorDasboardFilter,
  ): Promise<AggregatePaginateResult<CampaignDocument>> {
    const {
      page = 1,
      limit = 10,
      minDonationCount,
      maxDonationCount,
      minTotalDonation,
      maxTotalDonation,
    } = filter;

    let query: FilterQuery<any> = {};
    if (
      maxDonationCount < minDonationCount ||
      maxTotalDonation < minTotalDonation
    ) {
      throw new BadRequestException(
        'Max filter value must be greater than min filter value',
      );
    }
    if (minDonationCount) {
      query.donationCount = { $gte: minDonationCount };
    }
    if (maxDonationCount) {
      query.donationCount = { $lte: maxDonationCount };
    }
    if (minTotalDonation) {
      query.totalDonation = { $gte: minTotalDonation };
    }
    if (maxTotalDonation) {
      query.totalDonation = { $lte: maxTotalDonation };
    }

    const ObjectId = require('mongoose').Types.ObjectId;
    const aggregationQuery = this.campaignModel.aggregate([
      {
        $match: {
          _id: ObjectId(param.campaignId), // get spesific campaign
          organizationId: ObjectId(param.organizationId), // on spesific organization
          isDeleted: { $regex: 'n', $options: 'i' }, // and hide deleted campaign
        },
      },
      {
        $addFields: {
          campaignIdToString: { $toString: '$_id' }, // type of campaignId is a string on foreign table so we need to convert it
        },
      },
      {
        $lookup: {
          from: 'donationLog',
          localField: 'campaignIdToString',
          foreignField: 'campaignId',
          as: 'donateLog',
        },
      },
      { $unwind: { path: '$donateLog', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          'donateLog.type': 'campaign', // find donate log that is campaign type
          'donateLog.donationStatus': 'success', // and status equal to success
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'donateLog.donorId',
          foreignField: '_id',
          as: 'donationLog',
        },
      },
      { $unwind: { path: '$donationLog', preserveNullAndEmptyArrays: true } },
      {
        $addFields: { 'donationLog.donation': '$donateLog' }, // put the log of donation inside the user data (donationLog)
      },
      {
        $group: { _id: '$_id', donationLog: { $push: '$donationLog' } }, // show only donationLog (user and it's donation, not containing campaign data).
      },
      { $unwind: { path: '$donationLog', preserveNullAndEmptyArrays: true } }, // unwind donationLog to show each user, and the donation
      {
        $addFields: {
          amount: {
            $trunc: [{ $toDouble: '$donationLog.donation.amount' }, 2], // convert amount to double and round it to 2 decimal
          },
        },
      },
      {
        $group: {
          _id: '$donationLog._id', // group by userId
          firstname: { $first: '$donationLog.firstname' }, // user firstname.
          lastname: { $first: '$donationLog.lastname' }, // user lastname.
          type: { $first: '$donationLog.type' }, // user type (Role).
          email: { $first: '$donationLog.email' }, // user email.
          donation: { $push: '$donationLog.donation' }, // all donations data of user on this campaign (success only)
          totalDonation: { $sum: '$amount' }, // total donation of user on this campaign.
          donationCount: { $sum: 1 }, // donation count of user on this  campaign.
        },
      },
      {
        $match: {
          ...query, // filter by donation count and total donation
        },
      },
    ]);

    const donateList =
      await this.campaignAggregatePaginateModel.aggregatePaginate(
        aggregationQuery,
        {
          page,
          limit,
        },
      );

    return donateList;
  }

  async vendorApply(
    vendorUserId: string,
    request: CampaignApplyVendorDto,
  ): Promise<CampaignVendorLog> {
    /* validate the requester, is it a vendor/not */
    const vendorData = await this.vendorModel.findOne({
      ownerUserId: vendorUserId,
    });
    if (!vendorData) {
      throw new NotFoundException(
        `Vendor not found, please use a valid vendor account!`,
      );
    }

    /**
     * if this vendor already applied/processed/approved on this campaign (request.campaignId)
     * then the vendor can't apply again
     */
    const isExist = await this.campaignVendorLogModel.find({
      campaignId: new Types.ObjectId(request.campaignId), //campaign a
      vendorId: vendorData._id.toString(), //vendor 1
      status: {
        $nin: [CampaignStatus.NEW], //find campaign that not new (pending, approved, rejected, etc..)
      },
    });

    // if exist then it means vendor already apply for this campaign
    if (isExist.length > 0) {
      throw new BadRequestException(
        `Vendor already applied to this campaign before!`,
      );
    }

    const upsertedCampaignData =
      await this.campaignVendorLogModel.findOneAndUpdate(
        {
          campaignId: new Types.ObjectId(request.campaignId),
          vendorId: vendorData._id.toString(),
          status: CampaignStatus.PENDING_NEW,
        },
        {
          campaignId: new Types.ObjectId(request.campaignId),
          vendorId: vendorData._id.toString(),
          status: CampaignStatus.PENDING_NEW,
        },
        {
          upsert: true, // upsert(if exist update, if not exist insert)
          new: true, // return the created/updated data instead of the modified count details
        },
      );

    if (!upsertedCampaignData) {
      throw new InternalServerErrorException(
        `Error occured when upserting campaign data!`,
      );
    }

    return upsertedCampaignData;
  }

  async operatorApprove(
    request: UpdateCampaignStatusDto,
    userId: string,
  ): Promise<ApproveCampaignResponseDto> {
    //STEP 1: update initial campaign , change "new" to "approved"
    const approvedCampaignVendorRequest =
      await this.campaignVendorLogModel.findOneAndUpdate(
        {
          campaignId: new Types.ObjectId(request.campaignId),
          status: CampaignStatus.NEW,
        },
        {
          vendorId: request.vendorId,
          status: CampaignStatus.APPROVED,
          updatedBy: userId, // user who responsible for this approval
          updatedAt: dayjs().toISOString(),
        },
        { upsert: false, new: true },
      );
    if (!approvedCampaignVendorRequest) {
      throw new BadRequestException(`Campaign not found!`);
    }

    //STEP 2: update the rest of campaign set flag, change status
    //from "pending new" to "processed"
    const rejectedCampaignVendorRequest =
      await this.campaignVendorLogModel.find({
        campaignId: new Types.ObjectId(request.campaignId),
        status: CampaignStatus.PENDING_NEW,
      });
    if (!rejectedCampaignVendorRequest) {
      throw new BadRequestException(`Campaign not found!`);
    }

    const rejectResults = await this.campaignVendorLogModel.updateMany(
      {
        _id: {
          $in: rejectedCampaignVendorRequest.map((item) => item._id),
        },
      },
      {
        $set: {
          status: CampaignStatus.PROCESSED,
          updatedAt: dayjs().toISOString(),
          updatedBy: userId, // user who resposible for rejection (operator/manager)
        },
      },
    );
    if (!rejectResults) {
      throw new Error(`Campaign not found!`);
    }

    const response: ApproveCampaignResponseDto = {
      approvedCampaign: approvedCampaignVendorRequest,
      rejectedCampaign: rejectedCampaignVendorRequest,
      totalRejected: rejectResults.modifiedCount,
    };
    return response;
  }

  async operatorReject(
    request: UpdateCampaignStatusDto,
  ): Promise<CampaignVendorLog> {
    const campaignData = await this.campaignVendorLogModel.findOne({
      campaignId: new Types.ObjectId(request.campaignId),
      vendorId: request.vendorId,
    });
    if (!campaignData) {
      throw new NotFoundException(`Campaign not found`);
    }
    if (campaignData.status === CampaignStatus.PROCESSED) {
      throw new BadRequestException(`Campaign already processed!`);
    }
    campaignData.status = CampaignStatus.PROCESSED;
    campaignData.updatedAt = dayjs().toISOString();
    const updateCampaignStatus = await campaignData.save();
    if (!updateCampaignStatus) {
      throw new InternalServerErrorException(
        `Error occured when update campaign status!`,
      );
    }
    return updateCampaignStatus;
  }

  async getAllNewCampaign(organizationId: string) {
    const ObjectId = require('mongoose').Types.ObjectId;

    if (!organizationId) {
      throw new NotFoundException(`OperatorId must be not null`);
    }

    const data = await this.campaignModel.aggregate([
      {
        $match: {
          organizationId: ObjectId(organizationId),
          isFinished: { $exists: true },
          isDeleted: { $regex: 'n', $options: 'i' }, // hide deleted campaign
        },
      },
      {
        $lookup: {
          from: 'campaignVendorLog',
          localField: '_id',
          foreignField: 'campaignId',
          as: 'cp',
        },
      },
      { $unwind: { path: '$cp', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$_id',
          coverImage: { $first: '$coverImage' },
          description: { $first: '$description' },
          collectedAmount: { $first: '$collectedAmount' },
          remainingAmount: { $first: '$remainingAmount' },
          createdAt: { $first: '$createdAt' },
          title: { $first: '$campaignName' },
          condition: { $first: '$isFinished' },
          status: { $first: '$cp.status' },
        },
      },
      {
        $project: {
          _id: 1,
          coverImage: 1,
          description: 1,
          collectedAmount: 1,
          remainingAmount: 1,
          createdAt: 1,
          title: 1,
          condition: 1,
          status: 1,
        },
      },
      { $match: { status: 'new' } },
      { $sort: { _id: -1 } },
    ]);

    return data;
  }

  async getAllNewCampaignPaginated(
    organizationId: string,
    filter: GetAllNewCampaignFilter,
  ) {
    const { page, limit, isFinished, type, sortBy } = filter;
    const query: FilterQuery<CampaignDocument> = {};
    if (isFinished) {
      query.isFinished = { $regex: isFinished, $options: 'i' };
    }
    if (type) {
      query.campaignType = { $regex: type, $options: 'i' };
    }
    // default type of sort in mongodb
    let sort: { [key: string]: SortOrder } = {};
    if (sortBy) {
      if (sortBy === CampaignSortByEnum.NEWEST) {
        sort = { createdAt: -1 };
      }
      if (sortBy === CampaignSortByEnum.OLDEST) {
        sort = { createdAt: 1 };
      }
      if (sortBy === CampaignSortByEnum.TRANDING) {
        // TODO: filter sort by tranding
        sort = { createdAt: -1 }; // replace with tanding later on
      }
    } else {
      sort = { createdAt: -1 };
    }

    const aggregateQuerry = this.campaignModel.aggregate([
      {
        $match: {
          organizationId: new Types.ObjectId(organizationId),
          isFinished: { $exists: true }, // has isFinished field
          isDeleted: { $regex: 'n', $options: 'i' }, // hide deleted campaign
          ...query,
        },
      },
      {
        $lookup: {
          from: 'campaignVendorLog',
          localField: '_id',
          foreignField: 'campaignId',
          as: 'campaignLog',
        },
      },
      { $unwind: { path: '$campaignLog', preserveNullAndEmptyArrays: true } },
      // add this field(fix the amount of collected,targeted, and remaining amount, it was null before)
      {
        $addFields: {
          collectedAmount: {
            $toDouble: { $trunc: ['$amountProgress', 2] },
          },
          targetedAmount: {
            $toDouble: { $trunc: ['$amountTarget', 2] },
          },
          remainingAmount: {
            $toDouble: {
              $subtract: [
                { $toDouble: { $trunc: ['$amountTarget', 2] } },
                { $toDouble: { $trunc: ['$amountProgress', 2] } },
              ],
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          title: { $first: '$campaignName' },
          type: { $first: '$campaignType' },
          condition: { $first: '$isFinished' },
          status: { $first: '$campaignLog.status' },
          description: { $first: '$description' },
          collectedAmount: { $first: '$collectedAmount' },
          targetedAmount: { $first: '$targetedAmount' },
          remainingAmount: { $first: '$remainingAmount' },
          coverImage: { $first: '$coverImage' },
          createdAt: { $first: '$createdAt' },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          type: 1,
          condition: 1,
          status: 1,
          description: 1,
          collectedAmount: 1,
          targetedAmount: 1,
          remainingAmount: 1,
          coverImage: 1,
          createdAt: 1,
        },
      },
      { $match: { status: 'new' } },
    ]);

    const campaignList =
      await this.campaignAggregatePaginateModel.aggregatePaginate(
        aggregateQuerry,
        {
          page,
          limit,
          sort,
        },
      );

    return campaignList;
  }

  async getAllApprovedCampaign(organizationId: string, vendorId: string) {
    const ObjectId = require('mongoose').Types.ObjectId;
    const dataVendor = await this.vendorModel.findOne({
      ownerUserId: vendorId,
    });
    const realVdId = (dataVendor?._id).toString();
    if (!realVdId) {
      throw new NotFoundException(`VendorId must be not null`);
    }

    const campaignList = await this.campaignVendorLogModel.aggregate([
      {
        $lookup: {
          from: 'campaign',
          localField: 'campaignId',
          foreignField: '_id',
          as: 'cp',
        },
      },
      { $unwind: { path: '$cp', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'vendor',
          localField: 'vendorId',
          foreignField: '_id',
          as: 'pj',
        },
      },
      { $unwind: { path: '$pj', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          _id: '$campaignId',
          status: '$status',
          type: '$cp.campaignType',
          campaignName: '$cp.campaignName',
          orgId: '$cp.organizationId',
        },
      },
      {
        $project: {
          _id: 1,
          campaignName: 1,
          status: 1,
          type: 1,
          createdAt: 1,
          milestone: { $size: '$cp.milestone' },
          vendorId: 1,
          orgId: 1,
        },
      },
      {
        $match: {
          vendorId: realVdId,
          status: 'approved',
          orgId: ObjectId(organizationId),
        },
      },

      { $sort: { _id: 1 } },
    ]);

    return campaignList;
  }

  async getAllPendingCampaignByVendorId(
    organizationId: string,
    vendorId: string,
  ) {
    const ObjectId = require('mongoose').Types.ObjectId;
    const dataVendor = await this.vendorModel.findOne({
      ownerUserId: vendorId,
    });
    const realVdId = (dataVendor?._id).toString();
    if (!realVdId) {
      throw new NotFoundException(`VendorId must be not null`);
    }

    const campaignList = await this.campaignVendorLogModel.aggregate([
      {
        $lookup: {
          from: 'campaign',
          localField: 'campaignId',
          foreignField: '_id',
          as: 'cp',
        },
      },
      { $unwind: { path: '$cp', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'vendor',
          localField: 'vendorId',
          foreignField: '_id',
          as: 'pj',
        },
      },
      { $unwind: { path: '$pj', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          _id: '$campaignId',
          status: '$status',
          type: '$cp.campaignType',
          campaignName: '$cp.campaignName',
          orgId: '$cp.organizationId',
        },
      },
      {
        $project: {
          _id: 1,
          campaignName: 1,
          status: 1,
          type: 1,
          createdAt: 1,
          milestone: { $size: '$cp.milestone' },
          vendorId: 1,
          orgId: 1,
        },
      },
      {
        $match: {
          vendorId: realVdId,
          status: 'pending new',
          orgId: ObjectId(organizationId),
        },
      },

      { $sort: { _id: -1 } },
    ]);

    this.logger.debug(
      `list of my pending campaign=${JSON.stringify(campaignList)}`,
    );
    return campaignList;
  }

  async getAllCampaignVendorRequest(
    request: CampaignGetAllVendorRequestDto,
  ): Promise<AggregatePaginateResult<CampaignDocument>> {
    const { limit = 10, page = 1 } = request;
    const aggregateQuerry = this.campaignModel.aggregate([
      // STEP 1: vendor and all campaign that has been done by the vendor -------------------------------------------------------
      {
        $match: {
          isDeleted: { $regex: /.*n.*/, $options: 'i' }, // not deleted
          amountProgress: { $nin: ['', null, 0] }, // not null/""/0
          amountTarget: { $nin: ['', null, 0] }, // not null/""/0
          organizationId: new Types.ObjectId(request.organizationId),
        },
      },
      // add new field [is done, (boolan)], from matching progress and amount target, if progress >= target, then is done = true
      {
        $addFields: {
          isDone: {
            $gte: [
              { $toDouble: { $trunc: ['$amountProgress', 2] } },
              { $toDouble: { $trunc: ['$amountTarget', 2] } },
            ],
          },
        },
      },
      // find only campaign that is done
      { $match: { isDone: true } },
      // lookup from campaignVendorLog to get vendorId
      {
        $lookup: {
          from: 'campaignVendorLog',
          localField: '_id',
          foreignField: 'campaignId',
          as: 'vendorLog',
        },
      },
      { $unwind: { path: '$vendorLog', preserveNullAndEmptyArrays: true } },
      { $addFields: { vendorId: { $toObjectId: '$vendorLog.vendorId' } } }, // parse vendorId to ObjectId for lookup to vendor collection
      // find vendor from vendorId obtained from campaignVendorLog
      {
        $lookup: {
          from: 'vendor',
          localField: 'vendorId',
          foreignField: '_id',
          as: 'vendor',
        },
      },
      { $unwind: { path: '$vendor', preserveNullAndEmptyArrays: true } },
      // add field vendorName from vendor
      { $addFields: { vendorName: '$vendor.name' } },
      // group by vendorId
      {
        $group: {
          _id: '$vendorId',
          vendorName: { $first: '$vendorName' },
          completedCampaignId: { $push: '$_id' }, // as field so we can trace wether the campaign is completed or not
        },
      },
      {
        $addFields: {
          totalCampaignDone: { $size: '$completedCampaignId' },
          stringVendorId: { $toString: '$_id' },
          currentCampaignId: new Types.ObjectId(request.campaignId), // current id of page where we on
        },
      },
      // STEP 2: get all pending new  ------------------------------------------------------------------------------------------
      {
        $lookup: {
          from: 'campaignVendorLog',
          localField: 'stringVendorId',
          foreignField: 'vendorId',
          as: 'vendorLog',
        },
      },
      { $unwind: { path: '$vendorLog', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          'vendorLog.status': CampaignStatus.PENDING_NEW,
          'vendorLog.campaignId': new Types.ObjectId(request.campaignId),
        },
      },
      { $sort: { 'vendorLog.updatedAt': 1 } }, // sort by the last applied vendor
      {
        $project: {
          _id: 1, // id of the vendor
          vendorName: 1,
          completedCampaignId: 1,
          totalCampaignDone: 1,
          vendorLog: 1,
        },
      },
    ]);

    const campaignList =
      await this.campaignAggregatePaginateModel.aggregatePaginate(
        aggregateQuerry,
        {
          page,
          limit,
        },
      );
    return campaignList;
  }

  async getAllMyCampaign(
    userId: string,
    request: GetAllMyCampaignFilterDto,
  ): Promise<AggregatePaginateResult<CampaignDocument>> {
    const { limit = 10, page = 1, sortBy, sortMethod } = request;
    const filter: FilterQuery<CampaignDocument> = {};
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    // this api can only be accessed by operator & manager, if roles = operator, show only campaign that created by user
    if (user.type === RoleEnum.OPERATOR) filter.creatorUserId = userId;
    filter.isDeleted = { $regex: 'n', $options: 'i' };
    filter.organizationId = new Types.ObjectId(request.organizationId);
    request.campaignType && (filter.campaignType = request.campaignType);
    request.campaignId && (filter._id = new Types.ObjectId(request.campaignId));

    // default get the latest first
    const method: 1 | -1 = sortMethod === 'asc' ? 1 : -1;
    let sort: Record<string, 1 | -1> = {};
    if (sortBy) {
      if (sortBy === 'campaignName') sort = { campaignName: method };
      if (sortBy === 'campaignType') sort = { campaignType: method };
      if (sortBy === 'updatedAt') sort = { updatedAt: method };
      if (sortBy === 'status') sort = { status: method };
      if (sortBy === 'milestoneCount') sort = { milestoneCount: method };
    } else {
      sort = { updatedAt: method };
    }

    // objective, get CampaignName, Type, Last Update, Condition, Milestone (count).
    const aggregateQuerry = this.campaignModel.aggregate([
      { $match: filter },
      {
        $project: {
          campaignName: 1,
          campaignType: 1,
          updatedAt: 1,
          createdAt: 1,
          status: 1,
          milestoneCount: { $size: '$milestone' },
        },
      },
      {
        $lookup: {
          from: 'campaignVendorLog',
          localField: '_id',
          foreignField: 'campaignId',
          as: 'campaignVendorLog',
        },
      },
      {
        $unwind: {
          path: '$campaignVendorLog',
        },
      },
      {
        $group: {
          _id: '$_id',
          campaignName: { $first: '$campaignName' },
          campaignType: { $first: '$campaignType' },
          updatedAt: { $first: '$updatedAt' },
          createdAt: { $first: '$createdAt' },
          status: { $first: '$campaignVendorLog.status' },
          milestoneCount: { $first: '$milestoneCount' },
        },
      },
      { $sort: sort },
    ]);

    const campaignList =
      await this.campaignAggregatePaginateModel.aggregatePaginate(
        aggregateQuerry,
        {
          page,
          limit,
        },
      );

    return campaignList;
  }

  async getAllPendingCampaignByOperatorId(
    campaignId: string,
    operatorId: string,
  ) {
    const ObjectId = require('mongoose').Types.ObjectId;
    const dataOp = await this.operatorModel.findOne({
      ownerUserId: operatorId,
    });
    const realOpId = dataOp?.ownerUserId;

    // this.logger.debug(`realOpId ${realOpId}`);

    if (!realOpId) {
      throw new NotFoundException(`OperatorId not found`);
    }

    let data = await this.campaignVendorLogModel.aggregate([
      {
        $addFields: {
          newId: { $toObjectId: '$vendorId' },
        },
      },
      {
        $lookup: {
          from: 'campaign',
          localField: 'campaignId',
          foreignField: '_id',
          as: 'cp',
        },
      },
      { $unwind: { path: '$cp', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'vendor',
          localField: 'newId',
          foreignField: '_id',
          as: 'cq',
        },
      },
      { $unwind: { path: '$cq', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          _id: '$_id',
          status: '$status',
          creatorId: '$cp.creatorUserId',
          type: '$cp.campaignType',
          campaignName: '$cp.campaignName',
          vendorName: '$cq.name',
          orgId: '$cp.organizationId',
          campaignId: '$campaignId',
        },
      },
      {
        $project: {
          _id: 1,
          campaignName: 1,
          status: 1,
          type: 1,
          createdAt: 1,
          creatorId: 1,
          vendorId: 1,
          vendorName: 1,
          milestone: { $size: '$cp.milestone' },
          orgId: 1,
          campaignId: 1,
        },
      },
      {
        $match: {
          creatorId: realOpId,
          status: 'pending new',
          orgId: ObjectId('61b4794cfe52d41f557f1acc'),
          campaignId: ObjectId(campaignId),
        },
      },

      { $sort: { _id: -1 } },
    ]);

    //get history of vendor campaign completion
    let buff = [];
    for (let i = 0; i < data.length; i++) {
      let num = await this.campaignVendorLogModel.aggregate([
        { $match: { creatorUserId: data[i]['creatorId'], isFinished: 'N' } },
        { $group: { _id: null, count: { $count: {} } } },
      ]);

      this.logger.debug(num);
      buff[i] = {
        _id: data[i]['_id'],
        status: data[i]['status'],
        createdAt: data[i]['createdAt'],
        creatorId: data[i]['creatorId'],
        type: data[i]['type'],
        campaignName: data[i]['campaignName'],
        vendorName: data[i]['vendorName'],
        vendorId: data[i]['vendorId'],
        orgId: data[i]['orgId'],
        milestone: data[i]['milestone'],
        campaignId: data[i]['campaignId'],
        totalCamp: num.length,
      };
    }
    data = buff;

    //TO DO : Update campaign collection, add new field ownerUserId

    return data;
  }

  async getObjectId(createCampaignDto: CreateCampaignDto) {
    const ObjectId = require('mongoose').Types.ObjectId;
    const dataUser = await this.userModel.findOne({
      _id: createCampaignDto.userId,
    });
    const uid = dataUser?._id;
    const utype = dataUser?.type;

    if (!uid) {
      throw new NotFoundException(`user not found`);
    }

    if (utype) {
      if (!utype.match(/nonprofit|operator|superadmin/g)) {
        throw new BadRequestException(`User not allowed to generate ObjectId`);
      }
    }

    const newObjectId = new Types.ObjectId();

    return JSON.stringify(newObjectId);
  }

  async getCampaignDetailById(campaignId: string): Promise<Campaign> {
    if (!campaignId) throw new NotFoundException(`Please define campaignId`);
    validateObjectId(campaignId);

    const campaignData = await this.campaignModel.findById(
      new Types.ObjectId(campaignId),
    );
    if (!campaignData) throw new NotFoundException(`Campaign not found`);

    const campaignDetails = await this.campaignModel.aggregate([
      { $match: { _id: new Types.ObjectId(campaignId) } },
      {
        $lookup: {
          from: 'project',
          localField: 'projectId',
          foreignField: '_id',
          as: 'projectDetails',
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'creatorUserId',
          foreignField: '_id',
          as: 'createdBy',
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'updaterUserId',
          foreignField: '_id',
          as: 'updatedBy',
        },
      },
      {
        $addFields: {
          projectName: { $first: '$projectDetails.name' },
          createdBy: { $first: '$createdBy' },
          updatedBy: { $first: '$updatedBy' },
        },
      },
    ]);
    if (!campaignDetails || campaignDetails.length === 0) {
      throw new NotFoundException(`Campaign not found`);
    }

    return campaignDetails[0];
  }

  async getUnapprovalCampaignById(organizationId: string, campaignId: string) {
    let getCampaignDetail: any[] = [];
    const ObjectId = require('mongoose').Types.ObjectId;

    if (!organizationId) {
      throw new NotFoundException(`Organization not found`);
    }

    if (!campaignId) {
      throw new NotFoundException(`Campaign not found`);
    }

    try {
      getCampaignDetail = await this.campaignModel.aggregate([
        {
          $lookup: {
            from: 'campaignVendorLog',
            localField: '_id',
            foreignField: 'campaignId',
            as: 'a',
          },
        },
        {
          $unwind: {
            path: '$a',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$_id',
            title: { $first: '$campaignName' },
            income: { $first: '$amountProgress' },
            type: { $first: '$campaignType' },
            coverImage: { $first: '$coverImage' },
            image1: { $first: '$image1' },
            image2: { $first: '$image2' },
            image3: { $first: '$image3' },
            images: { $first: '$images' },
            starttDate: { $first: '$startDate' },
            endDate: { $first: '$endDate' },
            orgId: { $first: '$organizationId' },
            milestone: { $first: '$milestone' },
            status: { $first: '$a.status' },
            projectId: { $first: '$projectId' },
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            income: 1,
            coverImage: 1,
            image1: 1,
            image2: 1,
            image3: 1,
            images: 1,
            starttDate: 1,
            endDate: 1,
            orgId: 1,
            status: 1,
            milestone: 1,
            numMiles: { $size: '$milestone' },
            projectId: 1,
          },
        },
        {
          $match: {
            status: 'new',
            orgId: ObjectId(organizationId),
            _id: ObjectId(campaignId),
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);

      this.logger.debug(
        `getData unapproval campaign=${JSON.stringify(getCampaignDetail)}`,
      );
    } catch (error) {
      throw new InternalServerErrorException(`Error get Data - ${error}`);
    }

    return getCampaignDetail;
  }

  async setDeletedFlag(campaignId: string[]): Promise<string> {
    this.logger.debug(
      `setting ${campaignId.length} deleted flag to ${campaignId}`,
    );
    const updatedCampaign = await this.campaignModel.updateMany(
      { _id: { $in: campaignId } },
      { $set: { isDeleted: 'Y' } },
    );
    this.logger.debug(
      `${updatedCampaign.matchedCount} match, ${updatedCampaign.modifiedCount} data updated`,
    );
    return `${updatedCampaign.matchedCount} match, ${updatedCampaign.modifiedCount} data updated`;
  }
}
