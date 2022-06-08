import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { rootLogger } from '../logger';
import { Donor, DonorDocument } from './schema/donor.schema';
import { CampaignSetFavoriteDto } from '../campaign/dto';
import { DonorPaymentSubmitDto, DonorUpdateProfileDto } from './dto';
import {
  DonationLogs,
  DonationLogDocument as DonationLogsDocument,
} from './schema/donation_log.schema';
import { DonationLog, DonationLogDocument } from './schema/donation-log.schema';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { Anonymous, AnonymousDocument } from './schema/anonymous.schema';

@Injectable()
export class DonorService {
  private logger = rootLogger.child({ logger: DonorService.name });

  constructor(
    @InjectModel(Donor.name)
    private donorModel: Model<DonorDocument>,
    @InjectModel(DonationLog.name)
    private donationLogModel: Model<DonationLogDocument>,
    @InjectModel(DonationLogs.name)
    private donationLogsModel: Model<DonationLogsDocument>,
    @InjectModel(Anonymous.name)
    private anonymousModel: Model<AnonymousDocument>,
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

  async addAnonymousDonor(donorAddProfileDto: DonorUpdateProfileDto) {
    const newDonor = new this.anonymousModel(donorAddProfileDto);
    newDonor.save();

    if (!newDonor) {
      return {
        statusCode: 400,
        message: 'Failed',
      };
    }
    return {
      statusCode: 200,
      donor: newDonor,
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

  async getDonationLogs(donorUserId: string) {
    this.logger.debug('Get Donation logs...');
    const donationLogList = await this.donationLogsModel.aggregate([
      {
        $match: { donorUserId: donorUserId },
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
        $lookup: {
          from: 'organization',
          localField: 'nonprofitRealmId',
          foreignField: '_id',
          as: 'organization',
        },
      },
      {
        $unwind: {
          path: '$organization',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          createdAt: { $first: '$createdAt' },
          donationStatus: { $first: '$donationStatus' },
          amount: { $first: '$amount' },
          campaignName: { $first: '$campaign.campaignName' },
          campaignType: { $first: '$campaign.campaignType' },
          organizationName: { $first: '$organization.name' },
        },
      },
    ]);
    return donationLogList;
  }
}
