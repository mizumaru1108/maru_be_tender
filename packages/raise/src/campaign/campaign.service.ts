import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateCampaignDto } from './dto';
import { Campaign, CampaignDocument } from './campaign.schema';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { rootLogger } from '../logger';
import * as mongoose from 'mongoose';
import { Operator, OperatorDocument } from '../operator/schema/operator.schema';


@Injectable()
export class CampaignService {
  private logger = rootLogger.child({ logger: CampaignService.name });
  constructor(
    @InjectModel(Campaign.name)
    private campaignModel: Model<CampaignDocument>,
    @InjectModel(Operator.name)
    private operatorModel: Model<OperatorDocument>,
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
    const dataOperator = await this.operatorModel.findOne({ ownerUserId: operatorId });
    const realOpId = dataOperator?._id;
    if(!realOpId){
      throw new NotFoundException(`OperatorId must be not null`);
    }

    if(!ObjectId.isValid(realOpId)){
      throw new BadRequestException(`OperatorId is invalid ObjectId`);
    }
    
    const campaignList = await this.campaignModel.aggregate([
      {$match:{campaignName: {$exists: true},campaignType: {$exists: true},projectId : {$exists: true}}},
      {$lookup: {from: 'project',localField: 'projectId',foreignField: '_id',as: 'cp'}},
      {$unwind: {path: '$cp',preserveNullAndEmptyArrays: true}},
      {$lookup: {from: 'projectOperatorMap', localField: 'projectId',foreignField: 'projectId',as: 'pj'}},
      {$unwind: {path: '$pj', preserveNullAndEmptyArrays: true}},
      {$lookup: {from: 'campaignVendorLog',localField: '_id',foreignField: 'campaignId',as: 'cpv'}},
      {$unwind: {path: '$cpv'}},
      {$addFields: { operatorId: '$pj.operatorId', status: '$cpv.status', type: '$campaignType'}},
      {$project: {_id: 1,campaignName: 1,status:1,type:1, createdAt: 1,milestone: {$size:"$milestone"},projectId: 1,operatorId: 1}},
      {$match : {operatorId: ObjectId(realOpId)}},
      {$sort: {_id: 1}}
    ]);

    return campaignList;
  }

  async getAllNewCampaign(organizationId: string){
    console.log('debug');
    const ObjectId = require('mongoose').Types.ObjectId;
   
    if(!organizationId){
      throw new NotFoundException(`OperatorId must be not null`);
    }


    
    const data = await this.campaignModel.aggregate([
      {$match: {organizationId: ObjectId(organizationId), isFinished: {$exists: true}}},
      {$lookup: {from: 'campaignVendorLog',localField: '_id',foreignField: 'campaignId', as: 'cp'}},
         {$unwind: {path: '$cp',preserveNullAndEmptyArrays: true}},
         {$group: {_id:"$_id",collectedAmount:{$first:'collectedAmount'},remainingAmount:{$first: 'remainingAmount' },
                   createdAt:{$first: '$createdAt'},title:{$first: '$campaignName'},condition:{$first: '$isFinished'},
                   status:{$first: '$cp.status'}}},
         {$project: {_id: 1,collectedAmount:1,remainingAmount:1,createdAt:1,title:1,condition:1,status:1}},
         {$match: {status: 'new'}},
         {$sort: {_id: 1}}
    ]);

    console.log('debug', data);
    return data;
  }

}
