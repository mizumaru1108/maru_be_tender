import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateCampaignDto } from './dto';
import { Campaign, CampaignDocument } from './campaign.schema';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { rootLogger } from '../logger';
import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { Operator, OperatorDocument } from '../operator/schema/operator.schema';
import { User, UserDocument } from '../user/schema/user.schema';
import { 
  CampaignVendorLog,
   CampaignVendorLogDocument,
  Vendor,
   VendorDocument } from '../buying/vendor/vendor.schema';


@Injectable()
export class CampaignService {
  private logger = rootLogger.child({ logger: CampaignService.name });
  constructor(
    @InjectModel(Campaign.name)
    private campaignModel: Model<CampaignDocument>,
    @InjectModel(Operator.name)
    private operatorModel: Model<OperatorDocument>,
    @InjectModel(CampaignVendorLog.name)
    private campaignVendorLogModel: Model<CampaignVendorLogDocument>,
    @InjectModel(Vendor.name)
    private vendorModel: Model<VendorDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private configService: ConfigService,
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

  async upload(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    const createdCampaign = new this.campaignModel(createCampaignDto);
    createdCampaign.campaignId = uuidv4();
    createdCampaign.isFinished = 'N';
    createdCampaign.createdAt = moment().toISOString();
    createdCampaign.updatedAt = moment().toISOString();
    createdCampaign.isDeleted = 'N';
    createdCampaign.isPublished = 'Y';


    const imageBase64 = createCampaignDto.coverImage.replace(/^data:.*,/, '');
    const binary = Buffer.from(imageBase64, 'base64');
    const appEnv = this.configService.get('APP_ENV');

    const path = `tmra/${appEnv}/nonprofit-favicon/logo-${createCampaignDto.organizationId}.png`;
    const urlMedia = `${this.configService.get('BUNNY_STORAGE_URL_MEDIA')}/${path}`;

    const options: AxiosRequestConfig<any> = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
        AccessKey : `${this.configService.get('BUNNY_STORAGE_ACCESS_KEY_MEDIA')}`,
      },
      data: binary,
      url: urlMedia,
    };
    const uploadBunny = await axios(options);
    console.log(
      'Uploaded %s (%d bytes) to Bunny: %s %s %s',
      urlMedia,
      binary.length,
      uploadBunny.status,
      uploadBunny.statusText,
      JSON.stringify(uploadBunny.data, null, 2),
    );

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
    ]).then(data => {
      return data;
    }).catch(err => {
      return `DB error: ${err}`;
    });

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
    const ObjectId = require('mongoose').Types.ObjectId;
   
    if(!organizationId){
      throw new NotFoundException(`OperatorId must be not null`);
    }


    
    const data = await this.campaignModel.aggregate([
      {$match: {organizationId: ObjectId(organizationId), isFinished: {$exists: true}}},
      {$lookup: {from: 'campaignVendorLog',localField: '_id',foreignField: 'campaignId', as: 'cp'}},
         {$unwind: {path: '$cp',preserveNullAndEmptyArrays: true}},
         {$group: {_id:"$_id",collectedAmount:{$first:'$collectedAmount'},remainingAmount:{$first: '$remainingAmount' },
                   createdAt:{$first: '$createdAt'},title:{$first: '$campaignName'},condition:{$first: '$isFinished'},
                   status:{$first: '$cp.status'}}},
         {$project: {_id: 1,collectedAmount:1,remainingAmount:1,createdAt:1,title:1,condition:1,status:1}},
         {$match: {status: 'new'}},
         {$sort: {_id: 1}}
    ]);

    return data;
  }

  async getAllApprovedCampaign(organizationId: string, vendorId: string){
    const ObjectId = require('mongoose').Types.ObjectId;
    const dataVendor = await this.vendorModel.findOne({ ownerUserId: vendorId });
    const realVdId = (dataVendor?._id).toString();
    if(!realVdId){
      throw new NotFoundException(`VendorId must be not null`);
    }

    const campaignList = await this.campaignVendorLogModel.aggregate([
      {$lookup: {from: 'campaign',localField: 'campaignId',foreignField: '_id',as: 'cp'}},
      {$unwind: {path: '$cp',preserveNullAndEmptyArrays: true}},
      {$lookup: {from: 'vendor', localField: 'vendorId',foreignField: '_id',as: 'pj'}},
      {$unwind: {path: '$pj', preserveNullAndEmptyArrays: true}},
       {$addFields: { _id:'$campaignId',status: '$status', type: '$cp.campaignType', campaignName: '$cp.campaignName', orgId: '$cp.organizationId'}},
      {$project: {_id: 1,campaignName: 1,status:1,type:1,createdAt: 1, milestone: {$size:"$cp.milestone"},vendorId: 1,orgId:1}},
      {$match : {vendorId: (realVdId),status: 'approved', orgId: ObjectId(organizationId)}},
     
      {$sort: {_id: 1}}
    ]);
   
    return campaignList;
  }

  async getObjectId(organizationId: string, userId: string){

    const ObjectId = require('mongoose').Types.ObjectId;
    const dataUser = await this.userModel.findOne({ _id: userId });
    const uid = dataUser?._id;
    const utype  = dataUser?.type;

    if(!uid){
      throw new NotFoundException(`user not found`);
    }

    if(utype){
      if(!utype.match(/nonprofit|operator|superadmin/g)){
        throw new BadRequestException(`User not allowed to generate ObjectId`);
     }
    }

   

    const campaign = new this.campaignModel();
    campaign.organizationId = ObjectId(organizationId);
    campaign.milestone = [];

    const newCampaign = campaign.save();

    return newCampaign;
  }

}
