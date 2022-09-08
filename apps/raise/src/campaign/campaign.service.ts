import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import {
  AggregatePaginateModel,
  AggregatePaginateResult,
  FilterQuery,
  Model,
  SortOrder,
  Types,
} from 'mongoose';
import slugify from 'slugify';

import { z } from 'zod';
import {
  CampaignVendorLog,
  CampaignVendorLogDocument,
  Vendor,
  VendorDocument,
} from '../buying/vendor/vendor.schema';
import { BunnyService } from '../libs/bunny/services/bunny.service';
import { rootLogger } from '../logger';
import { Operator, OperatorDocument } from '../operator/schema/operator.schema';
import { User, UserDocument } from '../user/schema/user.schema';
import { Campaign, CampaignDocument } from './campaign.schema';
import { CreateCampaignDto } from './dto';
import { CampaignApplyVendorDto } from './dto/apply-vendor.dto';
import { CampaignCreateDto } from './dto/campaign-create.dto';
import { CampaignDonorOnOperatorDasboardFilter } from './dto/campaign-donor-on-operator-dashboard-filter.dto';
import { CampaignDonorOnOperatorDasboardParam } from './dto/campaign-donor-on-operator-dashboard-param.dto';
import { GetAllMypendingCampaignFromVendorIdRequest } from './dto/get-all-my-pending-campaign-from-vendor-id.request';
import { GetAllNewCampaignFilter } from './dto/get-all-new-campaign-filter.dto';
import { UpdateCampaignDto } from './dto/update-campaign-dto';
import { UpdateCampaignStatusDto } from './dto/update-campaign-status.dto';
import { CampaignSortByEnum } from './enums/campaign-sortby-enum';
import { CampaignStatus } from './enums/campaign-status.enum';
// import { catchError } from 'rxjs';
// import { ObjectId } from 'mongodb';
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

  /**
   * Create the campaign document in MongoDB, and uploads all the image files to Bunny.
   * @param createCampaignDto
   * @returns
   */
  async create(rawCreateCampaignDto: CreateCampaignDto): Promise<Campaign> {
    let createCampaignDto: CreateCampaignDto;
    let decimal = require('mongoose').Types.Decimal128;
    try {
      createCampaignDto = CreateCampaignDto.parse(rawCreateCampaignDto);
    } catch (err) {
      console.error(`Invalid Create Campaign Input:`, err);
      throw new BadRequestException(
        {
          statusCode: 400,
          message: `Invalid Create Campaign Input`,
          error: 'Bad Request',
          data: err.format(),
        },
        `Invalid Create Campaign Input`,
      );
    }

    const campaignId = new Types.ObjectId();
    const createdCampaign = new this.campaignModel({
      _id: campaignId,
      methods: createCampaignDto.methods,
      amountProgress: Types.Decimal128.fromString(
        createCampaignDto.amountProgress,
      ),
      amountTarget: Types.Decimal128.fromString(createCampaignDto.amountTarget),
    });
    const createdCampaignVendorLog = new this.campaignVendorLogModel(
      createCampaignDto,
    );
    const appEnv = this.configService.get('APP_ENV');
    const path: string[] = [];

    let folderType: string = '';

    createdCampaign.isFinished = 'N';
    createdCampaign.createdAt = dayjs().toISOString();
    createdCampaign.updatedAt = dayjs().toISOString();
    createdCampaign.isDeleted = 'N';
    createdCampaign.isPublished = 'N';
    createdCampaign.isMoney = 'Y';
    createdCampaign.amountProgress = decimal.fromString('0');
    createdCampaign.amountTarget = decimal.fromString('0');
    createdCampaign.milestone = createCampaignDto.milestone;
    createdCampaign.description = createCampaignDto.description;
    createdCampaign.campaignName = createCampaignDto.campaignName;
    createdCampaign.campaignType = createCampaignDto.campaignType;
    createdCampaign.creatorUserId = createCampaignDto.userId;
    createdCampaign.organizationId = new Types.ObjectId(
      createCampaignDto.organizationId,
    );
    createdCampaign.projectId = createCampaignDto.projectId
      ? new Types.ObjectId(createCampaignDto.projectId)
      : undefined;

    for (let i = 0; i < createCampaignDto.images.length; i++) {
      const sanitizedName = slugify(createCampaignDto.images[i].fullName, {
        lower: true,
        remove: /[*+~.()'"!:@]/g,
      });

      let random = Math.random().toString().substr(2, 4);
      // folder type is the same because any campaign image can be "Set as Cover"
      if (i == 0) {
        folderType = 'campaign-photo';
      } else {
        folderType = 'campaign-photo';
      }

      path[i] =
        `tmra/${appEnv}/organization/${createCampaignDto.organizationId}` +
        `/${folderType}/${sanitizedName}-${campaignId}-${random}` +
        `${createCampaignDto.images[i].imageExtension}`;

      //set the number of maximum file uploaded = 4 (included coverImage)
      if (i == 0) createdCampaign.coverImage = path[i];
      if (i == 1) createdCampaign.image1 = path[i];
      if (i == 2) createdCampaign.image2 = path[i];
      if (i == 3) createdCampaign.image3 = path[i];

      const base64Data = createCampaignDto.images[i].base64Data;
      const binary = Buffer.from(
        createCampaignDto.images[i].base64Data,
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
      const urlMedia = `${this.configService.get('BUNNY_STORAGE_URL_MEDIA')}/${
        path[i]
      }`;

      const options: AxiosRequestConfig<any> = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream',
          AccessKey: `${this.configService.get(
            'BUNNY_STORAGE_ACCESS_KEY_MEDIA',
          )}`,
        },
        data: binary,
        url: urlMedia,
      };

      try {
        console.info(
          `Uploading to Bunny: ${urlMedia} (${binary.length} bytes)...`,
        );
        const response = await axios(options);
        console.info(
          'Uploaded %s (%d bytes) to Bunny: %s %s %s',
          urlMedia,
          binary.length,
          response.status,
          response.statusText,
          JSON.stringify(response.data, null, 2),
        );
      } catch (error) {
        throw new InternalServerErrorException(
          `Error uploading image file to Bunny ${urlMedia} (${binary.length} bytes) while creating campaign: ${createCampaignDto.campaignName} - ${error}`,
        );
      }
    }

    //insert into Campaign
    const dataCampaign = await createdCampaign.save();

    //insert into Campaign Vendor Log
    if (dataCampaign) {
      createdCampaignVendorLog._id = new Types.ObjectId();
      createdCampaignVendorLog.campaignId = dataCampaign._id;
      // createdCampaignVendorLog.status = 'new'; // will be auto filled (default value in schema "CamapaignStatus.NEW ('new')")
      createdCampaignVendorLog.vendorId = '';
      createdCampaignVendorLog.createdAt = dayjs().toISOString();
      createdCampaignVendorLog.updatedAt = dayjs().toISOString();
      createdCampaignVendorLog.save();
    }

    return dataCampaign;
  }

  /**
   * refactored
   */
  async campaignCreate(creatorId: string, request: CampaignCreateDto) {
    const baseCampaignScheme = new this.campaignModel();
    const campaignScheme = Campaign.mapFromCreateRequest(
      baseCampaignScheme,
      request,
    );
    campaignScheme.creatorUserId = creatorId;
    const createdCampaignVendorLog = new this.campaignVendorLogModel(request);

    try {
      let path: string[] = [];
      const processImages = request.images.map(async (image, index) => {
        const tmpPath = await this.bunnyService.generatePath(
          request.organizationId,
          'campaign-photo',
          request.images[index]!.fullName,
          request.images[index]!.imageExtension,
          campaignScheme._id,
        );
        path.push(tmpPath);

        const base64Data = request.images[index].base64Data;
        const binary = Buffer.from(request.images[index].base64Data, 'base64');
        if (!binary) {
          const trimmedString = 56;
          base64Data.length > 40
            ? base64Data.substring(0, 40 - 3) + '...'
            : base64Data.substring(0, length);
          throw new BadRequestException(
            `Image payload ${index} is not a valid base64 data: ${trimmedString}`,
          );
        }
        const imageUpload = await this.bunnyService.uploadImage(
          path[index],
          binary,
          campaignScheme.campaignName,
        );

        //set the number of maximum file uploaded = 4 (included coverImage)
        if (index == 0 && imageUpload) campaignScheme.coverImage = path[index];
        if (index == 1 && imageUpload) campaignScheme.image1 = path[index];
        if (index == 2 && imageUpload) campaignScheme.image2 = path[index];
        if (index == 3 && imageUpload) campaignScheme.image3 = path[index];
      });

      await Promise.all(processImages);

      //insert into Campaign
      const dataCampaign = await campaignScheme.save();

      //insert into Campaign Vendor Log
      if (dataCampaign) {
        createdCampaignVendorLog._id = new Types.ObjectId();
        createdCampaignVendorLog.campaignId = dataCampaign._id;
        createdCampaignVendorLog.vendorId = '';
        createdCampaignVendorLog.createdAt = dayjs().toISOString();
        createdCampaignVendorLog.updatedAt = dayjs().toISOString();
        createdCampaignVendorLog.save();
      }

      return dataCampaign;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating campaign: ${request.campaignName} - ${error}`,
      );
    }
  }

  async updateCampaign(
    campaignId: string,
    rawUpdateCampaignDto: UpdateCampaignDto,
  ): Promise<Campaign> {
    const currentCampaignData = await this.campaignModel.findById(campaignId);
    if (!currentCampaignData) {
      throw new NotFoundException(`Campaign with id ${campaignId} not found`);
    }

    let validatedDto: UpdateCampaignDto;
    try {
      validatedDto = UpdateCampaignDto.parse(rawUpdateCampaignDto); // validate with zod
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.log(err);
        throw new BadRequestException(
          {
            statusCode: 400,
            message: `Invalid Update Campaign Input`,
            data: err.issues,
          },
          `Invalid Update Campaign Input`,
        );
      }
    }

    const updateCampaignData = Campaign.compare(
      currentCampaignData,
      validatedDto!,
    );

    /**
     * maximum file uploaded = 4 (included coverImage)
     * images [0] = coverImage
     * images [1] = image1
     * images [2] = image2
     * images [3] = image3
     */
    /* if there's new campaign images */
    if (
      updateCampaignData &&
      validatedDto! &&
      validatedDto!.images! &&
      validatedDto!.images!.length > 0
    ) {
      for (let i = 0; i < validatedDto!.images!.length; i++) {
        /* if image data on current index not empty */
        if (
          updateCampaignData &&
          validatedDto!.images[i]! &&
          validatedDto!.images[i]!.base64Data!
        ) {
          const path = await this.bunnyService.generatePath(
            updateCampaignData.organizationId.toString(),
            'campaign-photo',
            validatedDto!.images[i]!.fullName!,
            validatedDto!.images[i]!.imageExtension!,
            campaignId,
          );
          const base64Data = validatedDto!.images[i].base64Data!;
          const binary = Buffer.from(
            validatedDto!.images[i]!.base64Data!,
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
            updateCampaignData.campaignName,
          );

          /* if current campaign has old image, and the upload process has been done */
          if (i === 0 && imageUpload) {
            if (updateCampaignData.coverImage) {
              console.info(
                'Old cover image seems to be exist in the old record',
              );
              const isExist = await this.bunnyService.checkIfImageExists(
                updateCampaignData.coverImage,
              );
              if (isExist) {
                await this.bunnyService.deleteImage(
                  updateCampaignData.coverImage,
                );
              }
            }
            console.info('Cover image has been replaced');
            updateCampaignData.coverImage = path;
          }

          if (i === 1 && imageUpload) {
            if (updateCampaignData.image1) {
              console.info('Old image 1 seems to be exist in the old record');
              const isExist = await this.bunnyService.checkIfImageExists(
                updateCampaignData.image1,
              );
              if (isExist) {
                await this.bunnyService.deleteImage(updateCampaignData.image1);
              }
            }
            console.info('Image 1 has been replaced');
            updateCampaignData.image1 = path;
          }

          if (i === 2 && imageUpload) {
            if (updateCampaignData.image2) {
              console.info('Old image 2 seems to be exist in the old record');
              const isExist = await this.bunnyService.checkIfImageExists(
                updateCampaignData.image2,
              );
              if (isExist) {
                await this.bunnyService.deleteImage(updateCampaignData.image2);
              }
            }
            console.info('Image 2 has been replaced');
            updateCampaignData.image2 = path;
          }

          if (i === 3 && imageUpload) {
            if (updateCampaignData.image3) {
              console.info('Old image 3 seems to be exist in the old record');
              const isExist = await this.bunnyService.checkIfImageExists(
                updateCampaignData.image3,
              );
              if (isExist) {
                await this.bunnyService.deleteImage(updateCampaignData.image3);
              }
            }
            console.info('Image 3 has been replaced');
            updateCampaignData.image3 = path;
          }
        }
      }
    }

    return await updateCampaignData.save();
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

  // async vendorApply(createCampaignDto: CreateCampaignDto) {
  //   let vendorData: any = new Vendor();
  //   let data: any;
  //   const ObjectId = require('mongoose').Types.ObjectId;

  //   this.logger.debug(`userId=${createCampaignDto.userId}`);

  //   let dataVendor = await this.vendorModel.findOne({
  //     ownerUserId: createCampaignDto.userId,
  //   });

  //   this.logger.debug(`_id=${dataVendor?._id}`);

  //   if (!dataVendor) {
  //     throw new NotFoundException(`Vendor not found`);
  //   }

  //   if (!createCampaignDto.campaignId) {
  //     throw new NotFoundException(`Campaign not found`);
  //   }

  //   this.logger.debug(`campaignId=${createCampaignDto?.campaignId}`);
  //   try {
  //     data = await this.campaignVendorLogModel.findOneAndUpdate(
  //       {
  //         campaignId: new ObjectId(createCampaignDto?.campaignId),
  //         status: 'something',
  //         vendorId: '',
  //       },
  //       {
  //         vendorId: dataVendor?._id,
  //         status: 'pending new',
  //         campaignId: new ObjectId(createCampaignDto?.campaignId),
  //         createdAt: dayjs().toISOString(),
  //         updatedAt: dayjs().toISOString(),
  //       },
  //       { upsert: true, overwrite: false, rawResult: true },
  //     );
  //   } catch (error) {
  //     throw new InternalServerErrorException(`Error get Data - ${error}`);
  //   }

  //   return data;
  // }

  async vendorApply(
    vendorUserId: string,
    request: CampaignApplyVendorDto,
  ): Promise<CampaignVendorLog> {
    const vendorData = await this.vendorModel.findOne({
      ownerUserId: vendorUserId,
    });
    if (!vendorData) {
      throw new NotFoundException(`Vendor not found`);
    }
    const isExist = await this.campaignVendorLogModel.find({
      campaignId: new Types.ObjectId(request.campaignId),
      vendorId: vendorData._id.toString(),
      status: {
        $nin: [CampaignStatus.NEW], //find campaign that not new (pending, approved, rejected, etc..)
      },
    });
    // if exist then it means vendor already apply for this campaign
    if (isExist) {
      throw new BadRequestException(`Vendor already applied to this campaign!`);
    }
    const appliedCampaignData = await this.campaignVendorLogModel.findOne({
      campaignId: new Types.ObjectId(request.campaignId),
      status: CampaignStatus.NEW,
    });
    if (!appliedCampaignData) {
      throw new BadRequestException(`Campaign not found!`);
    }
    appliedCampaignData.status = CampaignStatus.PENDING_NEW; // change status from new to pending new
    appliedCampaignData.vendorId = vendorData._id.toString();
    appliedCampaignData.updatedAt = dayjs().toISOString();
    const updatedCampaignData = await appliedCampaignData.save();
    if (!updatedCampaignData) {
      throw new InternalServerErrorException(
        `Error occured when updating campaign data!`,
      );
    }
    return updatedCampaignData;
  }

  async operatorApprove(request: UpdateCampaignStatusDto) {
    let data: any;
    const ObjectId = require('mongoose').Types.ObjectId;
    try {
      //STEP 1: update initial campaign , change "new" to "approved"
      data = await this.campaignVendorLogModel.findOneAndUpdate(
        {
          campaignId: new ObjectId(request.campaignId),
          status: CampaignStatus.NEW,
        },
        {
          vendorId: request.vendorId,
          status: CampaignStatus.APPROVED,
          updatedAt: dayjs().toISOString(),
        },
        { upsert: false, overwrite: false, rawResult: true },
      );

      //STEP 2: update the rest of campaign set flag, change status
      //from "pending new" to "processed"
      data = await this.campaignVendorLogModel.updateMany(
        {
          campaignId: new ObjectId(request.campaignId),
          status: CampaignStatus.PENDING_NEW,
        },
        {
          $set: {
            status: CampaignStatus.PROCESSED,
            updatedAt: dayjs().toISOString(),
          },
        },
        {
          upsert: false,
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(`Error get Data - ${error}`);
    }
    return data;
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

  async getAllMyPendingCampaignByOrganizationId(
    request: GetAllMypendingCampaignFromVendorIdRequest,
  ): Promise<AggregatePaginateResult<CampaignDocument>> {
    const { limit = 10, page = 1 } = request;
    const ObjectId = require('mongoose').Types.ObjectId;
    const aggregateQuerry = this.campaignModel.aggregate([
      {
        $lookup: {
          from: 'campaignVendorLog',
          localField: '_id',
          foreignField: 'campaignId',
          as: 'campaignDatasInVendorLog',
        },
      },
      {
        $unwind: {
          path: '$campaignDatasInVendorLog',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $addFields: {
          isDone: {
            $eq: [
              { $toDouble: { $trunc: ['$amountProgress', 2] } },
              { $toDouble: { $trunc: ['$amountTarget', 2] } },
            ],
          },
        },
      },
      {
        $match: {
          amountProgress: { $nin: ['', null, 0] },
          amountTarget: { $nin: ['', null, 0] },
          isDone: true,
          organizationId: ObjectId(request.organizationId),
          'campaignDatasInVendorLog.status': 'pending',
        },
      },
      {
        $addFields: {
          'campaignDatasInVendorLog.vendorId': {
            $toObjectId: '$campaignDatasInVendorLog.vendorId',
          },
        },
      },
      {
        $lookup: {
          from: 'vendor',
          localField: 'campaignDatasInVendorLog.vendorId',
          foreignField: '_id',
          as: 'vendorDatas',
        },
      },
      {
        $unwind: {
          path: '$vendorDatas',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          campaignId: { $first: '$campaignDatasInVendorLog.campaignId' },
          vendorId: { $first: '$campaignDatasInVendorLog.vendorId' },
          vendorName: { $first: '$vendorDatas.name' },
          campaignType: { $first: '$campaignType' },
          campaignDone: { $sum: 1 },
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

  async getCampaignDetailById(campaignId: String) {
    let data: any = [];
    const ObjectId = require('mongoose').Types.ObjectId;

    if (!campaignId) {
      throw new NotFoundException(`user not found`);
    }

    try {
      data = await this.campaignModel.findOne({
        _id: ObjectId(campaignId),
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error get Data - ${error}`);
    }

    return data;
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
