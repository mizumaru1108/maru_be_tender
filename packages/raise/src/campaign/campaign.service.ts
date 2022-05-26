import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCampaignDto } from './dto';
import { Campaign, CampaignDocument } from './campaign.schema';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { rootLogger } from '../logger';

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
}
