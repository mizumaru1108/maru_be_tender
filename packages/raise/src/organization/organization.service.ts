import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { rootLogger } from '../logger';
import { FusionAuthClient } from '@fusionauth/typescript-client';
import { ConfigService } from '@nestjs/config';
import { OrganizationDto } from './dto/organization.dto';
import moment from 'moment';
import {
  Organization,
  OrganizationDocument,
} from './schema/organization.schema';
import {
  DonationLogDocument,
  DonationLogs,
} from 'src/donor/schema/donation_log.schema';
import { Donor, DonorDocument } from 'src/donor/schema/donor.schema';
import {
  PaymentGateway,
  PaymentGatewayDocument,
} from 'src/payment-stripe/schema/paymentGateway.schema';
import { Campaign, CampaignDocument } from 'src/campaign/campaign.schema';
import { AppearancenDto } from './dto/appearance.dto';
import { Appearance, AppearanceDocument } from './schema/appearance.schema';
import {
  NotificationSettings,
  NotificationSettingsDocument,
} from './schema/notification_settings.schema';
import { NotificationSettingsDto } from './dto/notification_settings.dto';
import {
  Notifications,
  NotificationsDocument,
} from './schema/notifications.schema';

@Injectable()
export class OrganizationService {
  private logger = rootLogger.child({ logger: OrganizationService.name });

  constructor(
    @InjectModel(Appearance.name)
    private appearanceModel: Model<AppearanceDocument>,
    @InjectModel(Campaign.name)
    private campaignModel: Model<CampaignDocument>,
    @InjectModel(DonationLogs.name)
    private donationLogModel: Model<DonationLogDocument>,
    @InjectModel(Donor.name)
    private donorModel: Model<DonorDocument>,
    @InjectModel(Notifications.name)
    private notificationsModel: Model<NotificationsDocument>,
    @InjectModel(NotificationSettings.name)
    private notifSettingsModel: Model<NotificationSettingsDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    @InjectModel(PaymentGateway.name)
    private paymentGatewayModel: Model<PaymentGatewayDocument>,
    private configService: ConfigService,
  ) {}

  async findAll() {
    this.logger.debug('findAll...');
    return await this.organizationModel.find({}, {}, { sort: { name: 1 } });
  }

  async getOrganization(organizationId: string) {
    this.logger.debug('Get Organization...');
    const organization = await this.organizationModel.findOne({
      _id: organizationId,
    });
    if (!organization) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }
    return {
      statusCode: 200,
      organization,
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

  async updateOrganization(
    organizationId: string,
    organization: OrganizationDto,
  ) {
    const orgUpdated = await this.organizationModel.findOneAndUpdate(
      { _id: organizationId },
      organization,
      { new: true },
    );

    if (orgUpdated && organization.aboutPicture) {
      this.updateUserProfile(orgUpdated.ownerUserId, organization.aboutPicture);
    }

    if (!orgUpdated) {
      return {
        statusCode: 400,
        message: 'Failed',
      };
    }
    return {
      statusCode: 200,
      organization: orgUpdated,
    };
  }

  async getAppearance(organizationId: string) {
    this.logger.debug('Get Organization...');
    const organization = await this.organizationModel.findOne({
      _id: organizationId,
    });
    if (!organization) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }

    const appearance = await this.appearanceModel.findOne({
      ownerUserId: organization.ownerUserId,
    });
    if (!appearance) {
      return {
        statusCode: 404,
        message: 'Appearance not found',
      };
    }
    return {
      statusCode: 200,
      appearance,
    };
  }

  async createAppearance(
    organizationId: string,
    appearanceDto: AppearancenDto,
  ) {
    this.logger.debug('Get Organization...');
    const organization = await this.organizationModel.findOne({
      _id: new Types.ObjectId(organizationId),
    });
    console.log(organizationId);
    if (!organization) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }

    appearanceDto.ownerUserId = organization.ownerUserId;
    appearanceDto.ownerRealmId = organization.ownerRealmId;
    const appearanceCreated = await this.appearanceModel.create(appearanceDto);
    // const appearance = createdExpense.save();
    return {
      statusCode: 200,
      appearance: appearanceCreated,
    };
  }

  async updateAppearance(organizationId: string, appearance: AppearancenDto) {
    this.logger.debug('Get Organization...');
    const organization = await this.organizationModel.findOne({
      _id: organizationId,
    });
    if (!organization) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }

    const appearanceUpdated = await this.appearanceModel.findOneAndUpdate(
      { ownerUserId: organization.ownerUserId },
      appearance,
      { new: true },
    );

    if (appearanceUpdated && appearance.favIcon) {
      organization.favicon = appearance.favIcon;
      organization.save();
    }

    if (!appearanceUpdated) {
      return {
        statusCode: 400,
        message: 'Failed',
      };
    }
    return {
      statusCode: 200,
      appearance: appearanceUpdated,
    };
  }

  async getDonorList(organizationId: string) {
    this.logger.debug(`getDonorList organizationId=${organizationId}`);
    // const donorUserIds = await this.donationLogModel
    //   .find({
    //     nonprofitRealmId: new Types.ObjectId(organizationId),
    //     donationStatus: 'PENDING',
    //     donorUserId: { $ne: null },
    //   })
    //   .distinct('donorUserId');
    // return await this.donorModel.find({ ownerUserId: { $in: donorUserIds } });
    return await this.donationLogModel.aggregate([
      {
        $match: {
          nonprofitRealmId: new Types.ObjectId(organizationId),
          donationStatus: 'SUCCESS',
          donorUserId: { $ne: null },
        },
      },
      {
        $lookup: {
          from: 'donor',
          localField: 'donorUserId',
          foreignField: 'ownerUserId',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
        },
      },
      {
        $group: {
          _id: '$donorUserId',
          donorId: { $first: '$user._id' },
          firstName: { $first: '$user.firstName' },
          lastName: { $first: '$user.lastName' },
          email: { $first: '$user.email' },
          country: { $first: '$user.country' },
          mobile: { $first: '$user.mobile' },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);
  }

  async getPaymentGatewayList(organizationId: string) {
    this.logger.debug(`getPaymentGatewayList organizationId=${organizationId}`);
    return await this.paymentGatewayModel.find(
      {
        organizationId: new Types.ObjectId(organizationId),
        isDeleted: 'N',
        isActive: 'Y',
      },
      'name defaultCurrency',
    );
  }

  async getInsightSummary(organizationId: string) {
    this.logger.debug(`getInsightSummary organizationId=${organizationId}`);
    const getOrganization = await this.organizationModel.findOne({
      _id: organizationId,
    });
    if (!getOrganization) {
      const txtMessage = `request rejected organizationId not found`;
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

    const totalProgram = await this.campaignModel
      .where({ organizationId: new Types.ObjectId(organizationId) })
      .count();

    const totalDonor = await this.donorModel
      .where({ organizationId: new Types.ObjectId(organizationId) })
      .count();

    const donationList = await this.donationLogModel.aggregate([
      {
        $match: {
          nonprofitRealmId: new Types.ObjectId(organizationId),
          donationStatus: 'SUCCESS',
        },
      },
      {
        $group: {
          _id: { nonprofitRealmId: '$nonprofitRealmId' },
          total: { $sum: '$amount' },
        },
      },
    ]);

    const totalDonation = donationList.length == 0 ? 0 : donationList[0].total;

    const returningDonorAgg = await this.donationLogModel.aggregate([
      {
        $match: {
          nonprofitRealmId: new Types.ObjectId(organizationId),
          donationStatus: 'SUCCESS',
          donorUserId: { $ne: null },
        },
      },
      {
        $lookup: {
          from: 'donor',
          localField: 'donorUserId',
          foreignField: 'ownerUserId',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
        },
      },
      {
        $group: {
          _id: '$donorUserId',
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ]);
    // console.log(totalReturningDonor);

    const mostPopularProgramsDiagram = await this.donationLogModel.aggregate([
      {
        $match: {
          nonprofitRealmId: new Types.ObjectId(organizationId),
          donationStatus: 'SUCCESS',
          donorUserId: { $ne: null },
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
        },
      },
      {
        $addFields: {
          name: {
            $cond: {
              if: { $eq: [{ $ifNull: ['$campaign.title', 0] }, 0] },
              then: '$campaign.campaignName',
              else: '$campaign.title',
            },
          },
        },
      },
      {
        $group: {
          _id: '$campaign._id',
          campaignName: { $first: '$name' },
          count: { $sum: 1 },
        },
      },
    ]);
    console.log(mostPopularProgramsDiagram);

    const totalDonationPerProgram = await this.donationLogModel.aggregate([
      {
        $match: {
          nonprofitRealmId: new Types.ObjectId(organizationId),
          donationStatus: 'SUCCESS',
          donorUserId: { $ne: null },
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
        },
      },
      {
        $addFields: {
          name: {
            $cond: {
              if: { $eq: [{ $ifNull: ['$campaign.title', 0] }, 0] },
              then: '$campaign.campaignName',
              else: '$campaign.title',
            },
          },
        },
      },
      {
        $group: {
          _id: '$campaign._id',
          campaignName: { $first: '$name' },
          total_donation: { $sum: '$amount' },
        },
      },
    ]);

    const campaignPerType = await this.campaignModel
      .where({
        organizationId: new Types.ObjectId(organizationId),
      })
      .select({
        _id: 1,
        title: 1,
        campaignType: 1,
        amountProgress: 1,
        amountTarget: 1,
      });
    const donorList = await this.getDonorList(organizationId);

    return {
      total_donation: totalDonation,
      total_program: totalProgram,
      total_donor: totalDonor,
      total_returning_donor: returningDonorAgg.length,
      most_popular_programs: mostPopularProgramsDiagram,
      total_donation_program: totalDonationPerProgram,
      campaign_per_type: campaignPerType.slice(0, 5),
      donor_list: donorList,
    };
  }

  async createNotificationSettings(notifSettingsDto: NotificationSettingsDto) {
    this.logger.debug('Get Organization...');
    const organization = await this.organizationModel.findOne({
      _id: new Types.ObjectId(notifSettingsDto.organizationId),
    });
    if (!organization) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }

    const notifCreated = await this.notifSettingsModel.create(notifSettingsDto);
    return {
      statusCode: 200,
      notificationSettings: notifCreated,
    };
  }

  async updateNotifSettings(
    organizationId: string,
    notifSettingsDto: NotificationSettingsDto,
  ) {
    this.logger.debug('Get Organization...');
    const organization = await this.organizationModel.findOne({
      _id: organizationId,
    });
    if (!organization) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }

    const notifSettingsUpdated = await this.notifSettingsModel.findOneAndUpdate(
      { organizationId: new Types.ObjectId(organizationId) },
      notifSettingsDto,
      { new: true },
    );

    if (!notifSettingsUpdated) {
      return {
        statusCode: 400,
        message: 'Failed',
      };
    }
    return {
      statusCode: 200,
      notificationSettings: notifSettingsUpdated,
    };
  }

  async getNotifSettings(organizationId: string) {
    this.logger.debug('Get Organization...');
    const organization = await this.organizationModel.findOne({
      _id: organizationId,
    });
    if (!organization) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }

    const notifSettings = await this.notifSettingsModel.findOne({
      organizationId: new Types.ObjectId(organizationId),
    });

    if (!notifSettings) {
      return {
        statusCode: 400,
        message: 'Failed',
      };
    }
    return {
      statusCode: 200,
      notificationSettings: notifSettings,
    };
  }

  async getNotificationList(organizationId: string, type: string) {
    this.logger.debug(`getNotificationList organizationId=${organizationId}`);
    // this.notificationsModel.create({
    //   organizationId: new Types.ObjectId(organizationId),
    //   type: 'activity',
    //   createdAt: moment().toISOString(),
    //   title: 'New Campaign 2',
    //   body: 'New Campaign 2 has been added successfully',
    //   icon: 'new',
    //   markAsRead: false,
    // });
    // this.notificationsModel.create({
    //   organizationId: new Types.ObjectId(organizationId),
    //   type: 'activity',
    //   createdAt: moment().toISOString(),
    //   title: 'New Campaign 2',
    //   body: 'New Campaign 2 has been updated successfully',
    //   icon: 'edit',
    //   markAsRead: false,
    // });
    // this.notificationsModel.create({
    //   organizationId: new Types.ObjectId(organizationId),
    //   type: 'general',
    //   createdAt: moment().toISOString(),
    //   title: 'New Message From Donor',
    //   body: 'Hello ....',
    //   icon: 'message',
    //   markAsRead: false,
    // });

    var filterData = {};
    console.log(type);
    if (type) {
      filterData = {
        organizationId: new Types.ObjectId(organizationId),
        markAsread: false,
        type: type,
      };
    } else {
      filterData = {
        organizationId: new Types.ObjectId(organizationId),
        markAsread: false,
      };
    }
    console.log(filterData);
    return await this.notificationsModel.find(filterData);
  }
}
