import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCampaignDto } from './dto';
import { Campaign, CampaignDocument } from './campaign.schema';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { rootLogger } from '../logger';
import { ObjectAndRelation } from '@authzed/authzed-node/dist/src/v0';

@Injectable()
export class CampaignService {
  private logger = rootLogger.child({ logger: CampaignService.name });
  constructor(
    @InjectModel(Campaign.name)
    private campaignModel: Model<CampaignDocument>,
  ) {}

  async create(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    const createdCampaign = new this.campaignModel(createCampaignDto);
    createdCampaign.campaignId = uuidv4();
    createdCampaign.isFinished = 'N';
    createdCampaign.createdAt = moment().toISOString();
    createdCampaign.updatedAt = moment().toISOString();
    createdCampaign.isDeleted = 'N';
    createdCampaign.isPublished = 'Y';
    return createdCampaign.save();
  }

  async findAll(organizationId: string) {
    this.logger.debug(`getCampaignList organizationId=${organizationId}`);
    let filter = {};

    const ObjectId = require('mongoose').Types.ObjectId;
    if (organizationId) filter = { organizationId: ObjectId(organizationId) };
    return await this.campaignModel.find(filter).exec();
  }

  async getAllByOrganizationId(organizationId: string){
    const ObjectId = require('mongoose').Types.ObjectId;
    const campaignList = await this.campaignModel.aggregate([
      {$match: {organizationId : ObjectId(organizationId)}},
      {
        $project: {
            campaignName: 1,
            campaignType: 1,
            updatedAt: 1,
            status: 1,
            foo_count:{$size:"$milestone"},
        }
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
          status: { $first: '$campaignVendorLog.status' },
          milestone:  {$first: '$foo_count'}
        },
      },
    ]);
    return campaignList;
  }

  async getAllByOperatorId(operatorId: string){
    const ObjectId = require('mongoose').Types.ObjectId;
    const operatorList = await this.campaignModel.aggregate([
      {$match:{campaignName: {$exists: true},campaignType: {$exists: true},projectId : {$exists: true}}},
      {$lookup: {from: 'project',localField: 'projectId',foreignField: '_id',as: 'cp'}},
      {$unwind: {path: '$cp',preserveNullAndEmptyArrays: true}},
      {$lookup: {from: 'projectOperatorMap', localField: 'projectId',foreignField: 'projectId',as: 'pj'}},
      {$unwind: {path: '$pj', preserveNullAndEmptyArrays: true}},
      {$addFields: { operatorId: '$pj.operatorId'}},
      {$project: {_id: 1,campaignName: 1,createdAt: 1,milestone: 1,projectId: 1,operatorId: 1}},
      {$match : {operatorId: ObjectId(operatorId)}},
      {$sort: {_id: 1}}
    ]);
    return operatorList;
  }
}
