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
import axios, { AxiosRequestConfig , AxiosError } from 'axios';
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
    let createdCampaign = new this.campaignModel(createCampaignDto);
    let createdCampaignVendorLog = new this.campaignVendorLogModel(createCampaignDto);
    let decimal = require('mongoose').Types.Decimal128;
    let ObjectId = require('mongoose').Types.ObjectId;
    const appEnv      = this.configService.get('APP_ENV');
    var slugify       = require('slugify');
    let sanitizedName : string = ''; 
    let path          : any = [];
    let imageBase64   : string = '';
    


    createdCampaign._id = ObjectId();
    createdCampaign.campaignId = uuidv4();
    createdCampaign.amountProgress = decimal.fromString("0");
    createdCampaign.amountTarget = decimal.fromString("0");
    createdCampaign.isFinished = 'N';
    createdCampaign.createdAt =  moment().toISOString(); 
    createdCampaign.updatedAt =  moment().toISOString(); 
    createdCampaign.isDeleted = 'N';
    createdCampaign.isPublished = 'N';
    createdCampaign.isMoney = 'Y';
    createdCampaign.milestone = createCampaignDto.milestone;
    createdCampaign.campaignName = createCampaignDto.name;
    createdCampaign.campaignType = createCampaignDto.campaignType;
    createdCampaign.organizationId = ObjectId(createCampaignDto.organizationId);
    createdCampaign.projectId = ObjectId(createCampaignDto.projectId);

 

    for(let i=0; i < createCampaignDto.imagePayload.length; i++){
      sanitizedName = slugify(createCampaignDto.imagePayload[i].fullName,{lower: true, 
        remove: /[*+~.()'"!:@]/g});
      
      
      if(i==0){
        console.log('imageName =',createCampaignDto.imagePayload[i].imageName);
        console.log('imagePrefix =',createCampaignDto.imagePayload[i].imagePrefix);
        console.log('fullName =',createCampaignDto.imagePayload[i].fullName);
        console.log('imageExtension =',createCampaignDto.imagePayload[i].imageExtension);
        path[i] = `tmra/${appEnv}/organization/${createCampaignDto.organizationId}`+
                      `/coverImage/${sanitizedName}-${createCampaignDto.imagePayload[i].imageName}`+
                      `${createCampaignDto.imagePayload[i].imageExtension}`;
        console.log('path=', path[i]);
        createdCampaign.coverImage = path[i];
        
      }else{
        console.log('imageName =',createCampaignDto.imagePayload[i].imageName);
        console.log('imagePrefix =',createCampaignDto.imagePayload[i].imagePrefix);
        console.log('fullName =',createCampaignDto.imagePayload[i].fullName);
        console.log('imageExtension =',createCampaignDto.imagePayload[i].imageExtension);
        path[i] = `tmra/${appEnv}/organization/${createCampaignDto.organizationId}`+
                      `/image/${sanitizedName}-${createCampaignDto.imagePayload[i].imageName}`+
                      `${createCampaignDto.imagePayload[i].imageExtension}`;
        console.log('path=', path[i]);

        //set the number of maximum file uploaded = 4 (included coverImage)
        if(i == 1) createdCampaign.image1 = path[i];
        if(i == 2) createdCampaign.image2 = path[i];
        if(i == 3) createdCampaign.image3 = path[i];

      }

      imageBase64 = createCampaignDto.imagePayload[i].imageUrl;
      const binary = Buffer.from(imageBase64, 'base64');
      const urlMedia = `${this.configService.get('BUNNY_STORAGE_URL_MEDIA')}/${path[i]}`;

      const options: AxiosRequestConfig<any> = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream',
          AccessKey : `${this.configService.get('BUNNY_STORAGE_ACCESS_KEY_MEDIA')}`,
        },
        data: binary,
        url: urlMedia,
      };

      //const uploadBunny = await axios(options);
      
      axios(options)
      .then((response) => {

        console.log(
          'Uploaded %s (%d bytes) to Bunny: %s %s %s',
          urlMedia,
          binary.length,
          response.status,
          response.statusText,
          JSON.stringify(response.data, null, 2),
        );

      })
      .catch(function (error) {
        // const err = error as AxiosError;
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      });

      

    }

    //insert into Campaign
    const dataCampaign =  await createdCampaign.save();


    //insert into Campaign Vendor Log
    if(dataCampaign){
        createdCampaignVendorLog._id = new ObjectId();
        createdCampaignVendorLog.campaignId = dataCampaign._id;
        createdCampaignVendorLog.status = 'new';
        createdCampaignVendorLog.vendorId = '';
        createdCampaignVendorLog.createdAt = moment().toISOString();
        createdCampaignVendorLog.updatedAt = moment().toISOString();
        createdCampaignVendorLog.save();
    }

    return dataCampaign;
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

  async getObjectId (createCampaignDto: CreateCampaignDto){

    const ObjectId = require('mongoose').Types.ObjectId;
    const dataUser = await this.userModel.findOne({ _id: createCampaignDto.userId });
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

    const newObjectId = ObjectId(); 

    return JSON.stringify(newObjectId);
  }

}
