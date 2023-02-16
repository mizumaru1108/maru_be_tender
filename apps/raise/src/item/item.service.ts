import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateItemDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { Item, ItemDocument } from './item.schema';
import { ROOT_LOGGER } from '../libs/root-logger';
import { Operator, OperatorDocument } from '../operator/schema/operator.schema';
import axios, { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import slugify from 'slugify';
import { UpdateItemDto } from './dto/update-item.dto';
import { z } from 'zod';
import { BunnyService } from '../libs/bunny/services/bunny.service';

@Injectable()
export class ItemService {
  private readonly logger = ROOT_LOGGER.child({ logger: ItemService.name });

  constructor(
    @InjectModel(Item.name)
    private itemModel: Model<ItemDocument>,
    @InjectModel(Operator.name)
    private operatorModel: Model<OperatorDocument>,
    private configService: ConfigService,
    private bunnyService: BunnyService,
  ) {}

  async create(rawCreateItemDto: CreateItemDto): Promise<Item> {
    let createItemDto: CreateItemDto;
    const decimal = require('mongoose').Types.Decimal128;
    try {
      createItemDto = CreateItemDto.parse(rawCreateItemDto);
    } catch (err) {
      console.error(`Invalid Create Item Input:`, err);
      throw new BadRequestException(
        {
          statusCode: 400,
          message: `Invalid Create Item Input`,
          error: 'Bad Request',
          data: err.format(),
        },
        `Invalid Create Item Input`,
      );
    }

    const itemId = new Types.ObjectId();
    const createdItem = new this.itemModel({
      _id: itemId,
      name: createItemDto.name,
    });
    // const createdProjectVendorLog = new this.projectModel(createProjectDto);
    const appEnv = this.configService.get('APP_ENV');
    const path: string[] = [];

    let folderType = '';

    createdItem.category = createItemDto.category;
    createdItem.projectId = createItemDto.projectId;
    createdItem.defaultPrice = createItemDto.defaultPrice;
    createdItem.currency = 'SAR';
    createdItem.totalNeed = createItemDto.totalNeed;
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

      const random = Math.random().toString().substr(2, 4);
      // folder type is the same because any campaign image can be "Set as Cover"
      if (i == 0) {
        folderType = 'item-photo';
      } else {
        folderType = 'item-photo';
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
        this.logger.info(
          `Uploading to Bunny: ${urlMedia} (${binary.length} bytes)...`,
        );
        const response = await axios(options);
        this.logger.info(
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
    //   createdProjectVendorLog.itemId = dataProject._id;
    //   createdProjectVendorLog.status = 'new';
    //   createdProjectVendorLog.vendorId = '';
    //   createdProjectVendorLog.createdAt = dayjs().toISOString();
    //   createdProjectVendorLog.updatedAt = dayjs().toISOString();
    //   createdProjectVendorLog.save();
    // }

    return dataItem;
  }

  async getListAll() {
    this.logger.debug('Get item list ...');
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
        $group: {
          _id: '$_id',
          itemName: { $first: '$name' },
          itemFee: { $first: '$defaultPrice' },
          totalNeed: { $first: '$totalNeed' },
          category: { $first: '$category' },
          createdAt: { $first: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 1,
          itemName: 1,
          itemFee: 1,
          totalNeed: 1,
          category: 1,
          createdAt: 1,
          campaignCount: '$count',
        },
      },
      { $sort: { _id: -1 } },
    ]);

    const dataItem = await this.itemModel.aggregate([
      {
        $lookup: {
          from: 'project',
          localField: '_id',
          foreignField: 'projectId',
          as: 'cp',
        },
      },
      { $unwind: { path: '$cp', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$_id',
          itemName: { $first: '$name' },
          createdAt: { $first: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 1, itemCount: '$count' } },
      { $sort: { _id: -1 } },
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

  async setDeletedFlag(itemIds: string[]) {
    this.logger.debug(`setting ${itemIds.length} deleted flag to ${itemIds}`);
    const updatedItems = await this.itemModel.updateMany(
      { _id: { $in: itemIds } },
      { $set: { isDeleted: 'Y' } },
    );
    this.logger.debug(
      `${updatedItems.matchedCount} match, ${updatedItems.modifiedCount} data updated`,
    );
    return `${updatedItems.matchedCount} match, ${updatedItems.modifiedCount} data updated`;
  }

  async updateItem(itemId: string, rawDto: UpdateItemDto): Promise<Item> {
    const currentItemData = await this.itemModel.findById(itemId);
    if (!currentItemData) {
      throw new NotFoundException(`Campaign with id ${itemId} not found`);
    }

    let validatedDto: UpdateItemDto;
    try {
      validatedDto = UpdateItemDto.parse(rawDto); // validate with zod
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

    const updateItemData = Item.compare(currentItemData, validatedDto!);

    /**
     * maximum file uploaded = 4 (included coverImage)
     * images [0] = coverImage
     * images [1] = image1
     * images [2] = image2
     * images [3] = image3
     */
    //!TODO: refactor for better performance
    /* if there's new campaign images */
    if (
      updateItemData &&
      validatedDto! &&
      validatedDto!.images &&
      validatedDto!.images.length > 0
    ) {
      for (let i = 0; i < validatedDto!.images.length; i++) {
        /* if image data on current index not empty */
        if (
          updateItemData &&
          validatedDto!.images[i]! &&
          validatedDto!.images[i]!.base64Data!
        ) {
          const path = await this.bunnyService.generatePath(
            updateItemData.organizationId.toString(),
            'item-photo',
            validatedDto!.images[i]!.fullName!,
            validatedDto!.images[i]!.imageExtension!,
            itemId,
          );
          const base64Data = validatedDto!.images[i]!.base64Data!;
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
            updateItemData.name,
          );

          /* if current campaign has old image, and the upload process has been done */
          if (i === 0 && imageUpload) {
            if (updateItemData.coverImage) {
              this.logger.info(
                'Old cover image seems to be exist in the old record',
              );
              const isExist = await this.bunnyService.checkIfImageExists(
                updateItemData.coverImage,
              );
              if (isExist) {
                await this.bunnyService.deleteMedia(
                  updateItemData.coverImage,
                  false,
                );
              }
            }
            this.logger.info('Cover image has been replaced');
            updateItemData.coverImage = path;
          }

          if (i === 1 && imageUpload) {
            if (updateItemData.image1) {
              this.logger.info(
                'Old image 1 seems to be exist in the old record',
              );
              const isExist = await this.bunnyService.checkIfImageExists(
                updateItemData.image1,
              );
              if (isExist) {
                await this.bunnyService.deleteMedia(
                  updateItemData.image1,
                  false,
                );
              }
            }
            this.logger.info('Image 1 has been replaced');
            updateItemData.image1 = path;
          }

          if (i === 2 && imageUpload) {
            if (updateItemData.image2) {
              this.logger.info(
                'Old image 2 seems to be exist in the old record',
              );
              const isExist = await this.bunnyService.checkIfImageExists(
                updateItemData.image2,
              );
              if (isExist) {
                await this.bunnyService.deleteMedia(
                  updateItemData.image2,
                  false,
                );
              }
            }
            this.logger.info('Image 2 has been replaced');
            updateItemData.image2 = path;
          }

          if (i === 3 && imageUpload) {
            if (updateItemData.image3) {
              this.logger.info(
                'Old image 3 seems to be exist in the old record',
              );
              const isExist = await this.bunnyService.checkIfImageExists(
                updateItemData.image3,
              );
              if (isExist) {
                await this.bunnyService.deleteMedia(
                  updateItemData.image3,
                  false,
                );
              }
            }
            this.logger.info('Image 3 has been replaced');
            updateItemData.image3 = path;
          }
        }
      }
    }

    return await updateItemData.save();
  }
}
