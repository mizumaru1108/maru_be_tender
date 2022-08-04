import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { rootLogger } from '../logger';
import { Donor, DonorDocument } from './schema/donor.schema';
import { Volunteer, VolunteerDocument } from './schema/volunteer.schema';
import { CampaignSetFavoriteDto } from '../campaign/dto';
import { DonorPaymentSubmitDto, DonorUpdateProfileDto } from './dto';
import {
  DonationLogs,
  DonationLogDocument as DonationLogsDocument,
} from './schema/donation_log.schema';
import { DonationLog, DonationLogDocument } from './schema/donation-log.schema';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { FusionAuthClient } from '@fusionauth/typescript-client';
import { ConfigService } from '@nestjs/config';
import { Anonymous, AnonymousDocument } from './schema/anonymous.schema';
import { Types } from 'mongoose';
import { ApiOperation } from '@nestjs/swagger';
import { CampaignVendorLog, CampaignVendorLogDocument } from '../buying/vendor/vendor.schema';
import { CampaignService } from '../campaign/campaign.service';
import { Campaign, CampaignDocument } from '../campaign/campaign.schema';

@Injectable()
export class DonorService {
  private logger = rootLogger.child({ logger: DonorService.name });

  constructor(
    @InjectModel(Donor.name)
    private donorModel: Model<DonorDocument>,
    @InjectModel(Volunteer.name)
    private volunteerModel: Model<VolunteerDocument>,
    @InjectModel(DonationLog.name)
    private donationLogModel: Model<DonationLogDocument>,
    @InjectModel(DonationLogs.name)
    private donationLogsModel: Model<DonationLogsDocument>,
    @InjectModel(Anonymous.name)
    private anonymousModel: Model<AnonymousDocument>,
    private configService: ConfigService,
    // private organizationService: OrganizationService,
    @InjectModel(CampaignVendorLog.name)
    private campaignVendorLogDocument: Model<CampaignVendorLogDocument>,
    @InjectModel(Campaign.name)
    private campaignModel: Model<CampaignDocument>,
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
    this.logger.debug(`Get Donor ${donorId}...`);
    let donor = null;
    if (!Types.ObjectId.isValid(donorId)) {
      donor = await this.donorModel.findOne({
        ownerUserId: donorId,
      });
    } else {
      donor = await this.donorModel.findOne({
        _id: donorId,
      });
    }
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

  async getDonorListAll(organizationId: string) {
    this.logger.debug('Get donor who participating in volunteer..');
    const data = await this.volunteerModel.aggregate([
      {
        $lookup: {
          from: 'donor',
          localField: 'donorId',
          foreignField: 'ownerUserId',
          as: 'a',
        },
      },
      {
        $unwind: {
          path: '$a',
        },
      },
      {
        $lookup: {
          from: 'volunteerTaskLog',
          localField: '_id',
          foreignField: 'volunteerId',
          as: 'b',
        },
      },
      {
        $unwind: {
          path: '$b',
        },
      },
      {
        $group: {
          _id: '$a._id',
          firstName: { $first: '$a.firstName' },
          lastName: { $first: '$a.lastName' },
          dateJoin: { $first: '$createdAt' },
          orgId: { $first: '$a.organizationId' },
          status: { $first: '$b.status' },
          lastUpdate: { $max: '$b.updatedAt' },
        },
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          dateJoin: 1,
          orgId: 1,
          status: 1,
        },
      },
      {
        $match: {
          orgId: organizationId,
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    if (!data) {
      return {
        statusCode: 404,
        message: 'Donor not found',
      };
    }
    return {
      statusCode: 200,
      data,
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

  async updateUserProfile(userId: string, imageUrl: string) {
    const fusionauth = new FusionAuthClient(
      this.configService.get('FUSIONAUTH_ADMIN_KEY', ''),
      this.configService.get('FUSIONAUTH_URL', ''),
      this.configService.get('FUSIONAUTH_TENANT_ID', ''),
    );
    console.log(this.configService.get('FUSIONAUTH_URL', ''));
    try {
      await fusionauth.patchUser(userId, {
        user: {
          imageUrl: imageUrl,
        },
      });
      this.logger.debug('Successfully changed profile');
    } catch (err) {
      const errMessage = err.exception
        ? err.exception
        : `Sorry, we couldn't update your profile picture`;
      this.logger.debug(errMessage);
    }
  }

  async updateDonor(
    donorId: string,
    donorUpdateProfileDto: DonorUpdateProfileDto,
  ) {
    this.logger.debug(`Get Donor ${donorId}...`);
    this.logger.debug(Types.ObjectId.isValid(donorId));
    let donorUpdated = null;
    if (Types.ObjectId.isValid(donorId)) {
      donorUpdated = await this.donorModel.findOneAndUpdate(
        { _id: donorId },
        donorUpdateProfileDto,
        { new: true },
      );
    } else {
      donorUpdated = await this.donorModel.findOneAndUpdate(
        { ownerUserId: donorId },
        donorUpdateProfileDto,
        { new: true },
      );
    }

    if (!donorUpdated) {
      return {
        statusCode: 400,
        message: 'Failed',
      };
    }

    if (donorUpdated && donorUpdateProfileDto.profilePic) {
      this.updateUserProfile(
        donorUpdated.ownerUserId,
        donorUpdateProfileDto.profilePic,
      );
    }
    return {
      statusCode: 200,
      donor: donorUpdated,
    };
  }

  async getDonationLogs(
    donorUserId: string,
    sortDate: string,
    sortStatus: string,
  ) {
    this.logger.debug('Get Donation logs...');
    let sortData = {};
    if (sortDate) {
      sortData = {
        createdAt: sortDate == 'asc' ? 1 : -1,
      };
    } else if (sortStatus) {
      sortData = {
        donationStatus: sortStatus == 'asc' ? 1 : -1,
        createdAt: -1,
      };
    } else {
      sortData = {
        createdAt: -1,
      };
    }
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
      {
        $sort: sortData,
      },
    ]);
    return donationLogList;
  }

  @ApiOperation({ summary: 'Get Total donationbyId' })
  async getTotalDonation(
    donorUserId: string,
    ){
      this.logger.debug('Get Donation logs...');
      const donationId = await this.donorModel.findOne({ownerUserId: donorUserId,});
    if (!donationId) {
      throw new NotFoundException(`donorUserId must be valid`);
    }
      const totalDonation = await this.donationLogsModel.aggregate([
     {
        $match: { donationStatus: "SUCCESS", donorUserId}
      },
      {
        $group: {
          _id: '$donorUserId',
          totalPersonDonation: {
            $sum: {
              $toDouble:"$amount"
            }
          },
          personDonation:{
            $first: {
              $toDouble:"$amount"
            }
          }
        },
      },
    ]);     

    const totalFundDonation = await this.donationLogsModel.aggregate([
      {
        $match: {donationStatus: "SUCCESS"}
      },
      {
        $group: {
           _id: '$donationStatus',
          amountTotalDonation: { $sum: "$amount" }
        },
      },
    ]);

    const campaignLogs = await this.campaignModel.aggregate([
      {$match: { isPublished: 'Y' }},
      {
        $group:{
          _id: 'isPublished',
          totalProgram: {$sum :
          '$amountTarget'
          }
        }
      }
    ]);
    
    return  {totalDonation,totalFundDonation, programFund:campaignLogs}; 
  }
}
