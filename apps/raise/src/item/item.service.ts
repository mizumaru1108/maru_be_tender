import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateItemDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { Item, ItemDocument } from './item.schema';
import { rootLogger } from '../logger';
import { Operator, OperatorDocument } from '../operator/schema/operator.schema';
import axios, { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import slugify from 'slugify';

@Injectable()
export class ItemService {
  private logger = rootLogger.child({ logger: ItemService.name });

  constructor(
    @InjectModel(Item.name)
    private itemModel: Model<ItemDocument>,
    @InjectModel(Operator.name)
    private operatorModel: Model<OperatorDocument>,
    private configService: ConfigService,
  ) {}

  async create(rawCreateItemDto: CreateItemDto): Promise<Item> {
    let createItemDto: CreateItemDto;
    let decimal = require('mongoose').Types.Decimal128;
    try {
      createItemDto = CreateItemDto.parse(rawCreateItemDto);
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

    const itemId = new Types.ObjectId();
    const createdItem = new this.itemModel({
      _id: itemId,
      name: createItemDto.name,
      location: createItemDto.location,
    });
    // const createdProjectVendorLog = new this.projectModel(createProjectDto);
    const appEnv = this.configService.get('APP_ENV');
    const path: string[] = [];

    let folderType: string = '';

    createdItem.hasAc = 'N';
    createdItem.hasClassroom = createItemDto.hasAc;
    createdItem.hasParking = createItemDto.hasParking;
    createdItem.hasGreenSpace = createItemDto.hasGreenSpace;
    createdItem.hasFemaleSection = createItemDto.hasFemaleSection;
    createdItem.toiletSize = createItemDto.toiletSize;
    createdItem.createdAt = dayjs().toISOString();
    createdItem.updatedAt = dayjs().toISOString();
    createdItem.isDeleted = 'N';
    createdItem.isPublished = 'N';
    createdItem.description = createItemDto.description;

    createdItem.organizationId = new Types.ObjectId(
      createItemDto.organizationId,
    );

    // createdProject.projectId = createProjectDto.projectId
    // ? new Types.ObjectId(createProjectDto.projectId)
    // : undefined;

    for (let i = 0; i < createItemDto.images.length; i++) {
      const sanitizedName = slugify(createItemDto.images[i].fullName, {
        lower: true,
        remove: /[*+~.()'"!:@]/g,
      });

      let random = Math.random().toString().substr(2, 4);
      // folder type is the same because any campaign image can be "Set as Cover"
      if (i == 0) {
        folderType = 'project-photo';
      } else {
        folderType = 'project-photo';
      }

      path[i] =
        `tmra/${appEnv}/organization/${createItemDto.organizationId}` +
        `/${folderType}/${sanitizedName}-${itemId}-${random}` +
        `${createItemDto.images[i].imageExtension}`;

      //set the number of maximum file uploaded = 4 (included coverImage)
      if (i == 0) createdItem.coverImage = path[i];
      if (i == 1) createdItem.image1 = path[i];
      if (i == 2) createdItem.image2 = path[i];
      if (i == 3) createdItem.image3 = path[i];

      const base64Data = createItemDto.images[i].base64Data;
      const binary = Buffer.from(createItemDto.images[i].base64Data, 'base64');
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
          `Error uploading image file to Bunny ${urlMedia} (${binary.length} bytes) while creating campaign: ${createItemDto.name} - ${error}`,
        );
      }
    }

    //insert into item
    const dataItem = await createdItem.save();

    //insert into Campaign Vendor Log
    // if (dataProject) {
    //   createdProjectVendorLog._id = new Types.ObjectId();
    //   createdProjectVendorLog.campaignId = dataProject._id;
    //   createdProjectVendorLog.status = 'new';
    //   createdProjectVendorLog.vendorId = '';
    //   createdProjectVendorLog.createdAt = dayjs().toISOString();
    //   createdProjectVendorLog.updatedAt = dayjs().toISOString();
    //   createdProjectVendorLog.save();
    // }

    return dataItem;
  }

  async getListAll() {
    this.logger.debug('Get project list ...');
    const dataProject = await this.itemModel.aggregate([
      {
        $lookup: {
          from: 'campaign',
          localField: '_id',
          foreignField: 'projectId',
          as: 'cp',
        },
      },
      { $unwind: { path: '$cp', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'item',
          localField: 'projectId',
          foreignField: '_id',
          as: 'item',
        },
      },
      { $unwind: { path: '$item', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$_id',
          projectName: { $first: '$name' },
          createdAt: { $first: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 1,
          projectName: 1,
          createdAt: 1,
          campaignCount: '$count',
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dataItem = await this.itemModel.aggregate([
      {
        $lookup: {
          from: 'item',
          localField: '_id',
          foreignField: 'projectId',
          as: 'cp',
        },
      },
      { $unwind: { path: '$cp', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'item',
          localField: 'projectId',
          foreignField: '_id',
          as: 'item',
        },
      },
      { $unwind: { path: '$item', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$_id',
          projectName: { $first: '$name' },
          createdAt: { $first: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 1, itemCount: '$count' } },
      { $sort: { _id: 1 } },
    ]);

    const data = dataProject.map((item, i) =>
      Object.assign({}, item, dataItem[i]),
    );
    return data;
  }

  async getListAllByOperatorId(operatorId: string) {
    const ObjectId = require('mongoose').Types.ObjectId;
    this.logger.debug('Get project list ...');

    const dataOperator = await this.operatorModel.findOne({
      ownerUserId: operatorId,
    });
    const realOpId = dataOperator?._id;

    if (!realOpId) {
      throw new NotFoundException(`user not found`);
    }

    console.log('debug:', realOpId);

    const dataProject = await this.itemModel.aggregate([
      {
        $lookup: {
          from: 'campaign',
          localField: '_id',
          foreignField: 'projectId',
          as: 'cp',
        },
      },
      { $unwind: { path: '$cp', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'item',
          localField: 'projectId',
          foreignField: '_id',
          as: 'item',
        },
      },
      { $unwind: { path: '$item', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'projectOperatorLog',
          localField: '_id',
          foreignField: 'projectId',
          as: 'pom',
        },
      },
      { $unwind: { path: '$pom', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$_id',
          projectName: { $first: '$name' },
          createdAt: { $first: '$createdAt' },
          operatorId: { $first: '$pom.operatorId' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 1,
          projectName: 1,
          createdAt: 1,
          operatorId: 1,
          campaignCount: '$count',
        },
      },
      { $match: { operatorId: ObjectId(realOpId) } },
      { $sort: { _id: 1 } },
    ]);

    const dataItem = await this.itemModel.aggregate([
      {
        $lookup: {
          from: 'item',
          localField: '_id',
          foreignField: 'projectId',
          as: 'cp',
        },
      },
      { $unwind: { path: '$cp', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'item',
          localField: 'projectId',
          foreignField: '_id',
          as: 'item',
        },
      },
      { $unwind: { path: '$item', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'projectOperatorLog',
          localField: '_id',
          foreignField: 'projectId',
          as: 'pom',
        },
      },
      { $unwind: { path: '$pom', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$_id',
          projectName: { $first: '$name' },
          createdAt: { $first: '$createdAt' },
          operatorId: { $first: '$pom.operatorId' },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 1, operatorId: 1, itemCount: '$count' } },
      { $match: { operatorId: ObjectId(realOpId) } },
      { $sort: { _id: 1 } },
    ]);

    const data = dataProject.map((item, i) =>
      Object.assign({}, item, dataItem[i]),
    );
    return data;
  }
}
