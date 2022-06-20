import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { rootLogger } from '../logger';
import moment from 'moment';
import { Basket, BasketDocument } from './schemas/basket.schema';
import { BasketDto } from './dto/basket.dto';
import { Donor, DonorDocument } from 'src/donor/schema/donor.schema';
import { Campaign, CampaignDocument } from 'src/campaign/campaign.schema';

@Injectable()
export class WidgetsService {
  private logger = rootLogger.child({ logger: WidgetsService.name });
  constructor(
    @InjectModel(Basket.name)
    private basketModel: Model<BasketDocument>,
    @InjectModel(Campaign.name)
    private campaignModel: Model<CampaignDocument>,
    @InjectModel(Donor.name)
    private donorModel: Model<DonorDocument>,
  ) {}

  async getBasketList(donorId: string) {
    this.logger.debug(`getBasketList donorId=${donorId}`);
    const getDonor = await this.donorModel.findOne({
      _id: donorId,
    });

    if (!getDonor) {
      const txtMessage = `request rejected donorId not found`;
      return {
        statusCode: 514,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: txtMessage,
        }),
      };
    }

    const basketList = await this.basketModel.find({
      donorId: new Types.ObjectId(donorId),
      isDeleted: false,
      isExpired: false,
    });
    return basketList;
  }

  async createBasket(basketDto: BasketDto) {
    const getDonor = await this.donorModel.findOne({
      _id: basketDto.donorId,
    });

    if (!getDonor) {
      const txtMessage = `request rejected donorId not found`;
      return {
        statusCode: 514,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: txtMessage,
        }),
      };
    }

    const getCampaign = await this.campaignModel.findOne({
      _id: basketDto.campaignId,
    });

    if (!getCampaign) {
      const txtMessage = `request rejected campaign not found`;
      return {
        statusCode: 514,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: txtMessage,
        }),
      };
    }

    const createdBasket = new this.basketModel(basketDto);
    const now = moment().toISOString();
    createdBasket.createdAt = now;
    createdBasket.updatedAt = now;
    createdBasket.donorId = new Types.ObjectId(basketDto.donorId);
    createdBasket.campaignId = new Types.ObjectId(basketDto.campaignId);
    createdBasket.isDeleted = false;

    // const dateIsAfter = moment(now).isAfter(moment(getCampaign.endDate));
    createdBasket.isExpired = false; // or getCampaign.isFinished ???
    return createdBasket.save();
  }
}
