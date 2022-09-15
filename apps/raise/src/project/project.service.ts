import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage, Types } from 'mongoose';
import { CreateProjectDto } from './dto';
import { ConfigService } from '@nestjs/config';
import {
  Project,
  ProjectDocument,
  ProjectOperatorLog,
  ProjectOperatorLogDocument,
} from './project.schema';
import { rootLogger } from '../logger';
import { Operator, OperatorDocument } from '../operator/schema/operator.schema';
import axios, { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import slugify from 'slugify';
import { UpdateProjectDto } from './dto/update-project.dto';
import { z } from 'zod';
import { BunnyService } from '../libs/bunny/services/bunny.service';
import { ProjectFilterRequest } from './dto/project-filter.request';
import {
  isBooleanStringN,
  isBooleanStringY,
} from '../commons/utils/is-boolean-string';
import { validateObjectId } from '../commons/utils/validateObjectId';

/**
 * basicly project all value from project schema, but parse diameter,prayer, and toilet value to int
 */
const defaultProjectPipelineParseInt: PipelineStage[] = [
  {
    $project: {
      _id: 1,
      organizationId: 1,
      name: 1,
      address: 1,
      description: 1,
      location: 1,
      diameterSize: { $toInt: '$diameterSize' },
      prayerSize: { $toInt: '$prayerSize' },
      toiletSize: { $toInt: '$toiletSize' },
      hasAc: 1,
      hasClassroom: 1,
      hasParking: 1,
      hasGreenSpace: 1,
      hasFemaleSection: 1,
      createdAt: 1,
      updatedAt: 1,
      ipAddress: 1,
      isDeleted: 1,
      isPublished: 1,
      projectId: 1,
      coverImage: 1,
      image1: 1,
      image2: 1,
      image3: 1,
      projectAvatar: 1,
      nearByPlaces: 1,
    },
  },
];

const baseProjectGrouping = {
  _id: '$_id',
  organizationId: { $first: '$organizationId' },
  name: { $first: '$name' },
  address: { $first: '$address' },
  description: { $first: '$description' },
  location: { $first: '$location' },
  diameterSize: { $first: '$diameterSize' },
  prayerSize: { $first: '$prayerSize' },
  toiletSize: { $first: '$toiletSize' },
  hasAc: { $first: '$hasAc' },
  hasClassroom: { $first: '$hasClassroom' },
  hasParking: { $first: '$hasParking' },
  hasGreenSpace: { $first: '$hasGreenSpace' },
  hasFemaleSection: { $first: '$hasFemaleSection' },
  createdAt: { $first: '$createdAt' },
  updatedAt: { $first: '$updatedAt' },
  ipAddress: { $first: '$ipAddress' },
  isDeleted: { $first: '$isDeleted' },
  isPublished: { $first: '$isPublished' },
  projectId: { $first: '$projectId' },
  coverImage: { $first: '$coverImage' },
  image1: { $first: '$image1' },
  image2: { $first: '$image2' },
  image3: { $first: '$image3' },
  projectAvatar: { $first: '$projectAvatar' },
  nearByPlaces: { $first: '$nearByPlaces' },
};

@Injectable()
export class ProjectService {
  private logger = rootLogger.child({ logger: ProjectService.name });

  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
    @InjectModel(Operator.name)
    private operatorModel: Model<OperatorDocument>,
    @InjectModel(ProjectOperatorLog.name)
    private projectOperatorLogModel: Model<ProjectOperatorLogDocument>,
    private configService: ConfigService,
    private bunnyService: BunnyService,
  ) {}

  async create(
    rawCreateProjectDto: CreateProjectDto,
    operatorId: string,
  ): Promise<Project> {
    let createProjectDto: CreateProjectDto;
    let decimal = require('mongoose').Types.Decimal128;
    try {
      createProjectDto = CreateProjectDto.parse(rawCreateProjectDto);
    } catch (err) {
      console.error(`Invalid Create Project Input:`, err);
      throw new BadRequestException(
        {
          statusCode: 400,
          message: `Invalid Create Project Input`,
          error: 'Bad Request',
          data: err.format(),
        },
        `Invalid Create Project Input`,
      );
    }

    const projectId = new Types.ObjectId();
    const createdProject = new this.projectModel({
      _id: projectId,
      name: createProjectDto.name,
      location: createProjectDto.location,
      operatorId,
    });
    const createdProjectOperatorLog = new this.projectOperatorLogModel(
      createProjectDto,
    );
    const appEnv = this.configService.get('APP_ENV');
    const path: string[] = [];

    let folderType: string = '';

    createdProject.hasAc = 'N';
    createdProject.hasClassroom = createProjectDto.hasAc;
    createdProject.hasParking = createProjectDto.hasParking;
    createdProject.hasGreenSpace = createProjectDto.hasGreenSpace;
    createdProject.hasFemaleSection = createProjectDto.hasFemaleSection;
    createdProject.toiletSize = createProjectDto.toiletSize;
    createdProject.diameterSize = createProjectDto.diameterSize;
    createdProject.prayerSize = createProjectDto.prayerSize;
    createdProject.address = createProjectDto.address;
    createdProject.createdAt = dayjs().toISOString();
    createdProject.updatedAt = dayjs().toISOString();
    createdProject.isDeleted = 'N';
    createdProject.isPublished = 'N';
    createdProject.description = createProjectDto.description;
    if (createProjectDto.nearByPlaces) {
      createdProject.nearByPlaces = createProjectDto.nearByPlaces;
    }

    createdProject.organizationId = new Types.ObjectId(
      createProjectDto.organizationId,
    );

    // createdProject.projectId = createProjectDto.projectId
    // ? new Types.ObjectId(createProjectDto.projectId)
    // : undefined;

    for (let i = 0; i < createProjectDto.images.length; i++) {
      const sanitizedName = slugify(createProjectDto.images[i].fullName, {
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
        `tmra/${appEnv}/organization/${createProjectDto.organizationId}` +
        `/${folderType}/${sanitizedName}-${projectId}-${random}` +
        `${createProjectDto.images[i].imageExtension}`;

      //set the number of maximum file uploaded = 4 (included coverImage)
      if (i == 0) createdProject.coverImage = path[i];
      if (i == 1) createdProject.image1 = path[i];
      if (i == 2) createdProject.image2 = path[i];
      if (i == 3) createdProject.image3 = path[i];
      if (i == 4) createdProject.projectAvatar = path[i];

      const base64Data = createProjectDto.images[i].base64Data;
      const binary = Buffer.from(
        createProjectDto.images[i].base64Data,
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
          `Error uploading image file to Bunny ${urlMedia} (${binary.length} bytes) while creating campaign: ${createProjectDto.name} - ${error}`,
        );
      }
    }

    //insert into Project
    const dataProject = await createdProject.save();

    //insert into Project Vendor Log
    if (dataProject) {
      createdProjectOperatorLog._id = new Types.ObjectId();
      createdProjectOperatorLog.projectId = dataProject._id;
      createdProjectOperatorLog.status = 'new';
      createdProjectOperatorLog.operatorId = '';
      createdProjectOperatorLog.createdAt = dayjs().toISOString();
      createdProjectOperatorLog.updatedAt = dayjs().toISOString();
      createdProjectOperatorLog.save();
    }

    return dataProject;
  }

  async updateProject(projectId: string, rawDto: UpdateProjectDto) {
    const currentProjectData = await this.projectModel.findById(projectId);
    if (!currentProjectData) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }

    let validatedDto: UpdateProjectDto;
    try {
      validatedDto = UpdateProjectDto.parse(rawDto); // validate with zod
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.log(err);
        throw new BadRequestException(
          {
            statusCode: 400,
            message: `Invalid Update Project Input`,
            data: err.issues,
          },
          `Invalid Update Project Input`,
        );
      }
    }

    const updateProjectData = Project.compare(
      currentProjectData,
      validatedDto!,
    );

    /**
     * maximum file uploaded = 4 (included coverImage and projectAvatar)
     * images [0] = coverImage
     * images [1] = image1
     * images [2] = image2
     * images [3] = image3
     * images [4] = projectAvatar
     */
    //!TODO: refactor for better performance
    /* if there's new campaign images */
    if (
      updateProjectData &&
      validatedDto! &&
      validatedDto!.images! &&
      validatedDto!.images!.length > 0
    ) {
      for (let i = 0; i < validatedDto!.images!.length; i++) {
        /* if image data on current index not empty */
        if (
          updateProjectData &&
          validatedDto!.images[i]! &&
          validatedDto!.images[i]!.base64Data!
        ) {
          const path = await this.bunnyService.generatePath(
            updateProjectData.organizationId.toString(),
            'project-photo',
            validatedDto!.images[i]!.fullName!,
            validatedDto!.images[i]!.imageExtension!,
            projectId,
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
            updateProjectData.name,
          );

          /* if current campaign has old image, and the upload process has been done */
          if (i === 0 && imageUpload) {
            if (updateProjectData.coverImage) {
              console.info(
                'Old cover image seems to be exist in the old record',
              );
              const isExist = await this.bunnyService.checkIfImageExists(
                updateProjectData.coverImage,
              );
              if (isExist) {
                await this.bunnyService.deleteImage(
                  updateProjectData.coverImage,
                );
              }
            }
            console.info('Cover image has been replaced');
            updateProjectData.coverImage = path;
          }

          if (i === 1 && imageUpload) {
            if (updateProjectData.image1) {
              console.info('Old image 1 seems to be exist in the old record');
              const isExist = await this.bunnyService.checkIfImageExists(
                updateProjectData.image1,
              );
              if (isExist) {
                await this.bunnyService.deleteImage(updateProjectData.image1);
              }
            }
            console.info('Image 1 has been replaced');
            updateProjectData.image1 = path;
          }

          if (i === 2 && imageUpload) {
            if (updateProjectData.image2) {
              console.info('Old image 2 seems to be exist in the old record');
              const isExist = await this.bunnyService.checkIfImageExists(
                updateProjectData.image2,
              );
              if (isExist) {
                await this.bunnyService.deleteImage(updateProjectData.image2);
              }
            }
            console.info('Image 2 has been replaced');
            updateProjectData.image2 = path;
          }

          if (i === 3 && imageUpload) {
            if (updateProjectData.image3) {
              console.info('Old image 3 seems to be exist in the old record');
              const isExist = await this.bunnyService.checkIfImageExists(
                updateProjectData.image3,
              );
              if (isExist) {
                await this.bunnyService.deleteImage(updateProjectData.image3);
              }
            }
            console.info('Image 3 has been replaced');
            updateProjectData.image3 = path;
          }

          if (i === 4 && imageUpload) {
            if (updateProjectData.projectAvatar) {
              console.info('Deleting old project avatar ...');
              const isExist = await this.bunnyService.checkIfImageExists(
                updateProjectData.projectAvatar,
              );
              if (isExist) {
                await this.bunnyService.deleteImage(
                  updateProjectData.projectAvatar,
                );
              }
            }
            console.info('Project avatar has been replaced');
            updateProjectData.projectAvatar = path;
          }
        }
      }
    }

    return await updateProjectData.save();
  }

  async applyFilter(
    filter: ProjectFilterRequest,
  ): Promise<FilterQuery<ProjectDocument>> {
    const filterQuery: FilterQuery<ProjectDocument> = {};
    const {
      minDiameterSize,
      maxDiameterSize,
      toiletSize,
      prayerMinCapacity,
      prayerMaxCapacity,
      hasAc,
      hasClassroom,
      hasGreenSpace,
      hasFemaleSection,
      hasParking,
      isDeleted,
      isPublished,
    } = filter;

    if (maxDiameterSize) {
      filterQuery.diameterSize = { $lte: maxDiameterSize };
    }

    if (minDiameterSize) {
      filterQuery.diameterSize = { $gte: minDiameterSize };
    }

    if (toiletSize) {
      filterQuery.toiletSize = { $gte: toiletSize };
    }

    if (prayerMinCapacity) {
      filterQuery.prayerSize = { $gte: prayerMinCapacity };
    }

    if (prayerMaxCapacity) {
      filterQuery.prayerSize = { $lte: prayerMaxCapacity };
    }

    if (hasAc) {
      const isY = await isBooleanStringY(hasAc);
      if (isY) {
        filterQuery.hasAc = { $regex: 'y', $options: 'i' };
      } else {
        const isN = await isBooleanStringN(hasAc);
        if (!isN) {
          throw new BadRequestException(
            'hasAc value is not valid Boolean String!',
          );
        }
        filterQuery.hasAc = { $regex: 'n', $options: 'i' };
      }
    }

    if (hasClassroom) {
      const isY = await isBooleanStringY(hasClassroom);
      if (isY) {
        filterQuery.hasClassroom = { $regex: 'y', $options: 'i' };
      } else {
        const isN = await isBooleanStringN(hasClassroom);
        if (!isN) {
          throw new BadRequestException(
            'hasClassroom value is not valid Boolean String!',
          );
        }
        filterQuery.hasClassroom = { $regex: 'n', $options: 'i' };
      }
    }

    if (hasClassroom) {
      const isY = await isBooleanStringY(hasClassroom);
      if (isY) {
        filterQuery.hasClassroom = { $regex: 'y', $options: 'i' };
      } else {
        const isN = await isBooleanStringN(hasClassroom);
        if (!isN) {
          throw new BadRequestException(
            'hasClassroom value is not valid Boolean String!',
          );
        }
        filterQuery.hasClassroom = { $regex: 'n', $options: 'i' };
      }
    }

    if (hasGreenSpace) {
      const isY = await isBooleanStringY(hasGreenSpace);
      if (isY) {
        filterQuery.hasGreenSpace = { $regex: 'y', $options: 'i' };
      } else {
        const isN = await isBooleanStringN(hasGreenSpace);
        if (!isN) {
          throw new BadRequestException(
            'hasGreenSpace value is not valid Boolean String!',
          );
        }
        filterQuery.hasGreenSpace = { $regex: 'n', $options: 'i' };
      }
    }

    if (hasFemaleSection) {
      const isY = await isBooleanStringY(hasFemaleSection);
      if (isY) {
        filterQuery.hasFemaleSection = { $regex: 'y', $options: 'i' };
      } else {
        const isN = await isBooleanStringN(hasFemaleSection);
        if (!isN) {
          throw new BadRequestException(
            'hasFemaleSection value must be valid Boolean String!',
          );
        }
        filterQuery.hasFemaleSection = { $regex: 'n', $options: 'i' };
      }
    }

    if (hasParking) {
      const isY = await isBooleanStringY(hasParking);
      if (isY) {
        filterQuery.hasParking = { $regex: 'y', $options: 'i' };
      } else {
        const isN = await isBooleanStringN(hasParking);
        if (!isN) {
          throw new BadRequestException(
            'hasParking value must be valid Boolean String!',
          );
        }
        filterQuery.hasParking = { $regex: 'n', $options: 'i' };
      }
    }

    if (isPublished) {
      const isY = await isBooleanStringY(isPublished);
      if (isY) {
        filterQuery.isPublished = { $regex: 'y', $options: 'i' };
      } else {
        const isN = await isBooleanStringN(isPublished);
        if (!isN) {
          throw new BadRequestException(
            'isPublished value must be valid Boolean String!',
          );
        }
        filterQuery.isPublished = { $regex: 'n', $options: 'i' };
      }
    }

    if (isDeleted) {
      const isY = await isBooleanStringY(isDeleted);
      if (isY) {
        filterQuery.isDeleted = { $regex: 'y', $options: 'i' };
      } else {
        const isN = await isBooleanStringN(isDeleted);
        if (!isN) {
          throw new BadRequestException(
            'isDeleted value must be valid Boolean String!',
          );
        }
        filterQuery.isDeleted = { $regex: 'n', $options: 'i' };
      }
    }

    return filterQuery;
  }

  async getProjectList(filterRequest: ProjectFilterRequest) {
    const filterQuery = await this.applyFilter(filterRequest);
    const projectList = await this.projectModel.aggregate([
      ...defaultProjectPipelineParseInt,
      {
        $match: filterQuery,
      },
      {
        $lookup: {
          from: 'campaign',
          localField: '_id',
          foreignField: 'projectId',
          as: 'campaignDatas',
        },
      },
      {
        $unwind: { path: '$campaignDatas', preserveNullAndEmptyArrays: false },
      },
      {
        $group: {
          ...baseProjectGrouping,
          // raw decimal (will output as string, not a number) first error case
          // (target: $numberDecimal: xxx.xxx) not (target: xxx.xxx)
          // solve with parse to double and trunc, decimal after comma to 2 digits
          target: {
            $sum: { $toDouble: { $trunc: ['$campaignDatas.amountTarget', 2] } },
          },
          collected: {
            $sum: {
              $toDouble: { $trunc: ['$campaignDatas.amountProgress', 2] },
            },
          },

          campaignCount: { $sum: 1 },
        },
      },
      {
        $addFields: {
          remainings: {
            $trunc: [
              {
                $subtract: [
                  { $toDouble: { $trunc: ['$target', 2] } },
                  { $toDouble: { $trunc: ['$collected', 2] } },
                ],
              },
              2,
            ],
          },
        },
      },
      {
        $lookup: {
          from: 'item',
          localField: '_id',
          foreignField: 'projectId',
          as: 'itemDatas',
        },
      },
      {
        $unwind: { path: '$itemDatas', preserveNullAndEmptyArrays: false },
      },
      {
        $group: {
          ...baseProjectGrouping,
          target: { $first: '$target' },
          collected: { $first: '$collected' },
          remainings: { $first: '$remainings' },
          campaignCount: { $first: '$campaignCount' },
          itemCount: { $sum: 1 },
        },
      },
    ]);
    return projectList;
  }

  async getListAll() {
    this.logger.debug('Get project list ...');
    const dataProject = await this.projectModel.aggregate([
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
          projectName: { $first: '$name' },
          createdAt: { $first: '$createdAt' },
          campaignId: { $first: '$cp._id' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 1,
          projectName: 1,
          createdAt: 1,
          campaignCount: '$count',
          campaignId: 1,
        },
      },
      { $sort: { _id: -1 } },
    ]);

    const dataItem = await this.projectModel.aggregate([
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
        $group: {
          _id: '$_id',
          projectName: { $first: '$name' },
          createdAt: { $first: '$createdAt' },
          itemId: { $first: '$cp._id' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 1,
          itemCount: '$count',
          itemId: 1,
        },
      },
      { $sort: { _id: -1 } },
    ]);

    const data = dataProject.map((item, i) =>
      Object.assign({}, item, dataItem[i]),
    );
    return data;
  }

  async getAllProjectPublished(organizationId: string) {
    const ObjectId = require('mongoose').Types.ObjectId;
    let data: any = {};

    const dataProject = await this.projectModel.aggregate([
      { $match: { organizationId: ObjectId(organizationId) } },
      {
        $addFields: {
          collectedAmount: { $toString: '$amountProgress' },
          remainingAmount: { $toString: '$amountTarget' },
          title: '$name',
        },
      },
      {
        $project: {
          projectId: '$_id',
          collectedAmount: 1,
          remainingAmount: 1,
          title: 1,
          coverImage: 1,
          image1: 1,
          image2: 1,
          image3: 1,
          createdAt: 1,
          updatedAt: 1,
          diameterSize: 1,
          hasAc: 1,
          hasClassroom: 1,
          hasFemaleSection: 1,
          hasGreenSpace: 1,
          hasParking: 1,
          prayerSize: 1,
          toiletSize: 1,
        },
      },
    ]);

    data.project = dataProject;
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

    const dataProject = await this.projectModel.aggregate([
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

    const dataItem = await this.projectModel.aggregate([
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

    const data: any = dataProject.map((item, i) =>
      Object.assign({}, item, dataItem[i]),
    );
    return data;
  }

  async getProjectDetailById(projectId: string): Promise<Project> {
    if (!projectId) throw new BadRequestException('Project Id is required');
    validateObjectId(projectId);
    const project = await this.projectModel.findById(
      new Types.ObjectId(projectId),
    );
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async setDeletedFlag(projectIds: string[]): Promise<string> {
    this.logger.debug(
      `setting ${projectIds.length} deleted flag to ${projectIds}`,
    );
    const updatedProject = await this.projectModel.updateMany(
      { _id: { $in: projectIds } },
      { $set: { isDeleted: 'N' } },
    );
    this.logger.debug(
      `${updatedProject.matchedCount} match, ${updatedProject.modifiedCount} data updated`,
    );
    return `${updatedProject.matchedCount} match, ${updatedProject.modifiedCount} data updated`;
  }
}
