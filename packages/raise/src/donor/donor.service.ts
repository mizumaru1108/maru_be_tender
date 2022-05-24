import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { rootLogger } from '../logger';
import { Donor, DonorDocument } from './schema/donor.schema';
import { CampaignSetFavoriteDto } from '../campaign/dto';
import { DonorPaymentSubmitDto, DonorUpdateProfileDto } from './dto';
import { DonationLog, DonationLogDocument } from './schema/donation-log.schema';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DonorService {
  private logger = rootLogger.child({ logger: DonorService.name });

  constructor(
    @InjectModel(Donor.name)
    private donorModel: Model<DonorDocument>,
    @InjectModel(DonationLog.name)
    private donationLogModel: Model<DonationLogDocument>,
  ) {}

  async setFavoriteCampaign(campaignSetFavoriteDto: CampaignSetFavoriteDto) {
    const filter = { donorId: campaignSetFavoriteDto.donorId };
    const update = { favoriteCampaignIds: campaignSetFavoriteDto.campaignIds };

    this.logger.debug(
      `update donor ${campaignSetFavoriteDto.donorId} favorite campaigns: ${campaignSetFavoriteDto.campaignIds}`,
    );
    return await this.donorModel.findOneAndUpdate(filter, update, {
      new: true,
    });
  }

  async submitPayment(
    donorPaymentSubmitDto: DonorPaymentSubmitDto,
  ): Promise<DonationLog> {
    const log = new this.donationLogModel(donorPaymentSubmitDto);
    log.donationLogId = uuidv4();
    log.createdAt = moment().toISOString();
    log.updatedAt = moment().toISOString();
    return log.save();
  }

  async getDonor(donorId: string) {
    this.logger.debug('Get Donor...');
    const donor = await this.donorModel.findOne({
      _id: donorId,
    });
    if (!donor) {
      return {
        statusCode: 404,
        message: 'Donor not found',
      };
    }
    return {
      statusCode: 200,
      donor,
    };
  }

  async updateDonor(
    donorId: string,
    donorUpdateProfileDto: DonorUpdateProfileDto,
  ) {
    const donorUpdated = await this.donorModel.findOneAndUpdate(
      { _id: donorId },
      donorUpdateProfileDto,
      { new: true },
    );

    if (!donorUpdated) {
      return {
        statusCode: 400,
        message: 'Failed',
      };
    }
    return {
      statusCode: 200,
      donor: donorUpdated,
    };
  }
}
