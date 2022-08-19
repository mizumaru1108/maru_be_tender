import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { rootLogger } from '../logger';
import moment from 'moment';
import { Basket, BasketDocument } from './schemas/basket.schema';
import { BasketDto, BasketProjectDto } from './dto';
import { Donor, DonorDocument } from 'src/donor/schema/donor.schema';
import { Campaign, CampaignDocument } from 'src/campaign/campaign.schema';
import { ProjectService } from '../project/project.service';

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
    private projectServices: ProjectService,
  ) { }

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

    const basketList = await this.basketModel.aggregate([
      {
        $match: {
          donorId: new Types.ObjectId(donorId),
          isDeleted: false,
          isExpired: false,
        },
      },
      {
        $lookup: {
          from: 'campaign',
          localField: 'campaignId',
          foreignField: '_id',
          as: 'campaign',
        },
      },
      {
        $unwind: {
          path: '$campaign',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          donationType: { $first: '$donationType' },
          currency: { $first: '$currency' },
          amount: { $first: '$amount' },
          unit: { $first: '$unit' },
          campaignName: { $first: '$campaign.campaignName' },
          campaignImage: { $first: '$campaign.campaignImage' },
        },
      },
    ]);
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
    let now: Date = new Date();
    createdBasket.createdAt = now;
    createdBasket.updatedAt = now;
    createdBasket.donorId = new Types.ObjectId(basketDto.donorId);
    createdBasket.campaignId = new Types.ObjectId(basketDto.campaignId);
    createdBasket.isDeleted = false;

    // const dateIsAfter = moment(now).isAfter(moment(getCampaign.endDate));
    createdBasket.isExpired = false; // or getCampaign.isFinished ???
    return createdBasket.save();
  }


  async updateBasket(basketId: string, basketDto: BasketDto) {
    const updates: {
      isDeleted?: boolean;
      currency?: string;
      amount?: number;
      unit?: number;
    } = {};

    if (basketDto.isDeleted) updates.isDeleted = basketDto.isDeleted;
    if (basketDto.currency) updates.currency = basketDto.currency;
    if (basketDto.amount) updates.amount = basketDto.amount;
    if (basketDto.unit) updates.unit = basketDto.unit;
    let now: Date = new Date();
    basketDto.updatedAt = now.toISOString();

    const basketUpdated = await this.basketModel.findOneAndUpdate(
      { _id: basketId, isDeleted: false, isExpired: false },
      basketDto,
      { new: true },
    );

    if (!basketUpdated) {
      return {
        statusCode: 400,
        message: 'Failed',
      };
    }
    return {
      statusCode: 200,
      basket: basketUpdated,
    };
  }

  /**
   * Basket Cart Project 
   */
  async createProjectBasket(basketProjectDto: BasketProjectDto) {
    const getDonor = await this.donorModel.findOne({
      _id: basketProjectDto.donorId,
    });

    //const getProject = await this.projectServices.getListAll();


    // const getProject = await this.campaignModel.findOne({
    //   _id: basketProjectDto.campaignId,
    // });

    // if (!getProject) {
    //   const txtMessage = `request rejected project not found`;
    //   return {
    //     statusCode: 514,
    //     headers: {
    //       'Access-Control-Allow-Origin': '*',
    //     },
    //     body: JSON.stringify({
    //       message: txtMessage,
    //     }),
    //   };
    // }

    const updates: {
      isDeleted?: boolean;
      currency?: string;
      amount?: number;
      unit?: number;
      donorId?: Types.ObjectId;
    } = {};

    if (basketProjectDto.isDeleted) updates.isDeleted = basketProjectDto.isDeleted;
    if (basketProjectDto.currency) updates.currency = basketProjectDto.currency;
    if (basketProjectDto.amount) updates.amount = basketProjectDto.amount;
    if (basketProjectDto.unit) updates.unit = basketProjectDto.unit;
    if (basketProjectDto.donorId) updates.donorId = basketProjectDto.donorId;

    const createdBasket = new this.basketModel(basketProjectDto);
    let now: Date = new Date();
    createdBasket.createdAt = now;
    createdBasket.updatedAt = now;
    createdBasket.donorId = new Types.ObjectId(basketProjectDto.donorId);
    createdBasket.campaignId = new Types.ObjectId(basketProjectDto.campaignId);
    createdBasket.isDeleted = false;
    createdBasket.isExpired = false;
    return createdBasket.save();
  }

  async updateProjectBasket(basketId: string, basketProjectDto: BasketProjectDto) {
    const updates: {
      isDeleted?: boolean;
      currency?: string;
      amount?: number;
      unit?: number;
      donorId?: Types.ObjectId;
    } = {};

    if (basketProjectDto.isDeleted) updates.isDeleted = basketProjectDto.isDeleted;
    if (basketProjectDto.currency) updates.currency = basketProjectDto.currency;
    if (basketProjectDto.amount) updates.amount = basketProjectDto.amount;
    if (basketProjectDto.unit) updates.unit = basketProjectDto.unit;
    if (basketProjectDto.donorId) updates.donorId = basketProjectDto.donorId;

    const basketUpdated = await this.basketModel.findOneAndUpdate(
      { _id: basketId, isDeleted: false, isExpired: false },
      basketProjectDto,
      { new: true },
    );

    if (!basketUpdated) {
      return {
        statusCode: 400,
        message: 'Failed',
      };
    }
    return {
      statusCode: 200,
      basket: basketUpdated,
    };
  }

  // async getBasketProjectList(donorId: string) {
  //   this.logger.debug(`getBasketList donorId=${donorId}`);
  //   const getDonor = await this.donorModel.findOne({
  //     _id: donorId,
  //   });

  //   if (!getDonor) {
  //     const txtMessage = `request rejected donorId not found`;
  //     return {
  //       statusCode: 514,
  //       headers: {
  //         'Access-Control-Allow-Origin': '*',
  //       },
  //       body: JSON.stringify({
  //         message: txtMessage,
  //       }),
  //     };
  //   }

  //   const basketList = await this.basketModel.aggregate([
  //     {
  //       $match: {
  //         donorId: new Types.ObjectId(donorId),
  //         isDeleted: false,
  //         isExpired: false,
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'campaign',
  //         localField: 'campaignId',
  //         foreignField: '_id',
  //         as: 'campaign',
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$campaign',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: '$_id',
  //         donationType: { $first: '$donationType' },
  //         currency: { $first: '$currency' },
  //         amount: { $first: '$amount' },
  //         unit: { $first: '$unit' },
  //         campaignName: { $first: '$campaign.campaignName' },
  //         campaignImage: { $first: '$campaign.campaignImage' },
  //       },
  //     },
  //   ]);
  //   return basketList;
  // }
  /** ------------------------------------------------------- */

}
