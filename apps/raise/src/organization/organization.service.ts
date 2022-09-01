import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AggregatePaginateModel, AggregatePaginateResult, Model, Types } from 'mongoose';
import { rootLogger } from '../logger';
import { FusionAuthClient } from '@fusionauth/typescript-client';
import { ConfigService } from '@nestjs/config';
import { OrganizationDto } from './dto/organization.dto';
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
import { FaqDto } from './dto/faq.dto';
import { Faq, FaqDocument } from './schema/faq.schema';
import { PaymentGateWayDto } from 'src/payment-stripe/dto/paymentGateway.dto';
import { NotificationDto } from './dto/notification.dto';
import {
  AppearanceNavigation,
  AppearanceNavigationDocument,
} from './schema/nonprofit_appearance_navigation.schema';
import {
  AppearancePage,
  AppearancePageDocument,
} from './schema/nonprofit_appearance_page.schema';
import {
  NonProfitAppearancePageDto,
  EditNonProfitAppearancePageDto,
} from './dto/nonprofit_appearance_page.dto';
import {
  NonProfitAppearanceNavigationDto,
  NonProfitAppearanceNavigationAboutUsDto,
  NonProfitAppearanceNavigationBlogDto,
  EditNonProfitAppearanceNavigationAboutUsDto,
  EditNonProfitAppearanceNavigationBlogDto,
  EditNonProfitAppearanceNavigationDto,
} from './dto/nonprofit_appearance_navigation.dto';

import { DonorsFilterDto, FilterDonorDashboardDto } from './dto';
import { FilterQueryDonorDashboard } from './enums';
import { EmailService } from '../libs/email/email.service';

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
    @InjectModel(Faq.name)
    private faqModel: Model<FaqDocument>,
    @InjectModel(Notifications.name)
    private notificationsModel: Model<NotificationsDocument>,
    @InjectModel(NotificationSettings.name)
    private notifSettingsModel: Model<NotificationSettingsDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    @InjectModel(PaymentGateway.name)
    private paymentGatewayModel: Model<PaymentGatewayDocument>,
    private configService: ConfigService,
    @InjectModel(AppearanceNavigation.name)
    private appearanceNavigationModel: Model<AppearanceNavigationDocument>,
    @InjectModel(AppearancePage.name)
    private appearancePageModel: Model<AppearancePageDocument>,
    private readonly emailService: EmailService,
    @InjectModel(DonationLogs.name)
    private campaignAggregatePaginateModel: AggregatePaginateModel<DonationLogDocument>,
  ) { }

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

    const emailData = { name: orgUpdated.name };
    await this.emailService.sendMailWTemplate(
      orgUpdated.contactEmail,
      'Giving Sadaqah Updates',
      'account_update',
      emailData,
      'hello@tmra.io', // optional, you can delete it, when new identity is provided, we can use other identity ex: ommar.net
    );
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

    const appearance = await this.appearanceModel.find({
      organizationId: organization._id,
    });
    if (appearance) {
      return {
        statusCode: 400,
        message: 'Appearance is already exist.',
      };
    }
    appearanceDto.ownerUserId = organization.ownerUserId;
    appearanceDto.ownerRealmId = organization.ownerRealmId;
    const appearanceCreated = await this.appearanceModel.create(appearanceDto);
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
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: 'anonymous',
          localField: '_id',
          foreignField: 'donationLogId',
          as: 'user_anonymous',
        },
      },
      {
        $unwind: {
          path: '$user_anonymous',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          // donorName: {
          //   $cond: [
          //     { $eq: [{ $ifNull: ['$user', 0] }, 0] },
          //     {
          //       $cond: {
          //         if: {
          //           $eq: [{ $ifNull: ['$user_anonymous.lastName', 0] }, 0],
          //         },
          //         then: '$user_anonymous.firstName',
          //         else: {
          //           $concat: [
          //             '$user_anonymous.firstName',
          //             ' ',
          //             '$user_anonymous.lastName',
          //           ],
          //         },
          //       },
          //     },
          //     {
          //       $cond: {
          //         if: {
          //           $eq: [{ $ifNull: ['$user.lastName', 0] }, 0],
          //         },
          //         then: '$user.firstName',
          //         else: {
          //           $concat: ['$user.firstName', ' ', '$user.lastName'],
          //         },
          //       },
          //     },
          //   ],
          // },
          userId: {
            $cond: [
              { $eq: [{ $ifNull: ['$user', 0] }, 0] },
              '$user_anonymous._id',
              '$user._id',
            ],
          },
          firstName: {
            $cond: [
              { $eq: [{ $ifNull: ['$user', 0] }, 0] },
              '$user_anonymous.firstName',
              '$user.firstName',
            ],
          },
          lastName: {
            $cond: [
              { $eq: [{ $ifNull: ['$user', 0] }, 0] },
              '$user_anonymous.lastName',
              '$user.lastName',
            ],
          },
          email: {
            $cond: [
              { $eq: [{ $ifNull: ['$user', 0] }, 0] },
              '$user_anonymous.email',
              '$user.email',
            ],
          },
          createdAt: {
            $cond: [
              { $eq: [{ $ifNull: ['$user', 0] }, 0] },
              '$user_anonymous.createdAt',
              '$user.createdAt',
            ],
          },
        },
      },
      {
        $group: {
          _id: '$userId',
          donorId: { $first: '$user._id' },
          firstName: { $first: '$firstName' },
          lastName: { $first: '$lastName' },
          email: { $first: '$email' },
          country: { $first: '$user.country' },
          mobile: { $first: '$user.mobile' },
          totalAmount: { $sum: '$amount' },
          createdAt: { $first: '$createdAt' },
        },
      },
    ]);
  }
  async getDonorsList(filter: DonorsFilterDto)
    : Promise<AggregatePaginateResult<DonationLogDocument>> {
    this.logger.debug(`getDonorsList organizationId=${filter}`);
    const { limit = 10, page = 1 } = filter;

    let sortData = {};
    sortData = {
      donorId: filter.donor == 'asc' ? 1 : -1
    };
    if (filter.donorName) {
      sortData = {
        firstName: filter.donorName == 'asc' ? 1 : -1,
        lastName: filter.donorName == 'asc' ? 1 : -1
      };
    }
    if (filter.email) {
      sortData = {
        email: filter.email == 'asc' ? 1 : -1
      };
    }
    if (filter.country) {
      sortData = {
        country: filter.country == 'asc' ? 1 : -1
      };
    }
    if (filter.phoneNumber) {
      sortData = {
        mobile: filter.phoneNumber == 'asc' ? 1 : -1
      };
    }
    if (filter.amount) {
      sortData = {
        totalAmount: filter.amount == 'asc' ? 1 : -1
      };
    }
    if (filter.transactionDate) {
      sortData = {
        createdAt: filter.transactionDate == 'asc' ? 1 : -1
      };
    }
    if (filter.email) {
      sortData = {
        email: filter.email == 'asc' ? 1 : -1
      };
    }

    const aggregateQuerry = this.donationLogModel.aggregate([
      {
        $match: {
          nonprofitRealmId: new Types.ObjectId(filter.organizationId),
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
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: 'anonymous',
          localField: '_id',
          foreignField: 'donationLogId',
          as: 'user_anonymous',
        },
      },
      {
        $unwind: {
          path: '$user_anonymous',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          userId: {
            $cond: [
              { $eq: [{ $ifNull: ['$user', 0] }, 0] },
              '$user_anonymous._id',
              '$user._id',
            ],
          },
          firstName: {
            $cond: [
              { $eq: [{ $ifNull: ['$user', 0] }, 0] },
              '$user_anonymous.firstName',
              '$user.firstName',
            ],
          },
          lastName: {
            $cond: [
              { $eq: [{ $ifNull: ['$user', 0] }, 0] },
              '$user_anonymous.lastName',
              '$user.lastName',
            ],
          },
          email: {
            $cond: [
              { $eq: [{ $ifNull: ['$user', 0] }, 0] },
              '$user_anonymous.email',
              '$user.email',
            ],
          },
          createdAt: {
            $cond: [
              { $eq: [{ $ifNull: ['$user', 0] }, 0] },
              '$user_anonymous.createdAt',
              '$user.createdAt',
            ],
          },
        },
      },
      {
        $group: {
          _id: '$userId',
          donorId: { $first: '$user._id' },
          firstName: { $first: '$firstName' },
          lastName: { $first: '$lastName' },
          email: { $first: '$email' },
          country: { $first: '$user.country' },
          mobile: { $first: '$user.mobile' },
          totalAmount: { $sum: '$amount' },
          createdAt: { $first: '$createdAt' },
        },
      },
    ]);

    const donorList =
      await this.campaignAggregatePaginateModel.aggregatePaginate(
        aggregateQuerry,
        {
          page,
          limit,
          sort: sortData
        },
      );
    return donorList;
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

  async addNewPaymentGateWay(
    organizationId: string,
    paymentGatewayDto: PaymentGateWayDto,
  ) {
    this.logger.debug('Get Organization...');
    const organization = await this.organizationModel.findOne({
      _id: new Types.ObjectId(organizationId),
    });
    if (!organization) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }

    paymentGatewayDto.name = paymentGatewayDto.name.toUpperCase();
    const paymentGateway = await this.paymentGatewayModel.findOne({
      organizationId: new Types.ObjectId(organizationId),
      name: paymentGatewayDto.name,
    });

    if (paymentGateway) {
      return {
        statusCode: 400,
        message: 'Name is already exist',
      };
    }

    const paymentGatewayCreated = new this.paymentGatewayModel(
      paymentGatewayDto,
    );
    let now: Date = new Date();
    paymentGatewayDto.createdAt = now;
    paymentGatewayDto.updatedAt = now;
    paymentGatewayDto.organizationId = new Types.ObjectId(organizationId);
    paymentGatewayCreated.save();

    return {
      statusCode: 200,
      paymentGateway: paymentGatewayCreated,
    };
  }

  async getInsightSummary(organizationId: string, period: string) {
    this.logger.debug(`getInsightSummary organizationId=${organizationId}`);
    const getOrganization = await this.organizationModel.findOne({
      _id: organizationId,
    });
    if (!period) period = '7days';
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

    const getDateQuery = (filterBy: string) => {
      const today = new Date();
      // const tomorrow = new Date(today.getDate() + 1);

      switch (filterBy) {
        case 'year':
          const thisYear = new Date();
          thisYear.setDate(1);
          thisYear.setMonth(1);
          return {
            $exists: true,
            $gte: thisYear,
          };
        case '12months':
          const twelveMonthsAgo: Date = new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
          );
          return {
            $exists: true,
            $gte: twelveMonthsAgo,
          };
        case '90days':
          const ninetyDaysAgo: Date = new Date(
            Date.now() - 90 * 24 * 60 * 60 * 1000,
          );
          return {
            $exists: true,
            $gte: ninetyDaysAgo,
          };
        case '30days':
          const thirtyDaysAgo: Date = new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000,
          );
          return {
            $exists: true,
            $gte: thirtyDaysAgo,
          };
        case '28days':
          const twentyEightDaysAgo: Date = new Date(
            Date.now() - 28 * 24 * 60 * 60 * 1000,
          );
          return {
            $exists: true,
            $gte: twentyEightDaysAgo,
          };
        case 'yesterday':
          const yesterday: Date = new Date(
            Date.now() - 1 * 24 * 60 * 60 * 1000,
          );
          return {
            $exists: true,
            $gte: yesterday,
          };
        case 'today':
          return {
            $exists: true,
            $gte: today,
          };
        default:
          const sevenDaysAgo: Date = new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
          );
          return {
            $gte: sevenDaysAgo,
          };
      }
    };
    const totalProgram = await this.campaignModel
      .where({
        organizationId: new Types.ObjectId(organizationId),
        createdAt: getDateQuery(period),
      })
      .count();

    const totalDonor = await this.donorModel
      .where({
        organizationId: new Types.ObjectId(organizationId),
        createdAt: getDateQuery(period),
      })
      .count();

    const donationList = await this.donationLogModel.aggregate([
      {
        $match: {
          nonprofitRealmId: new Types.ObjectId(organizationId),
          donationStatus: 'SUCCESS',
          createdAt: getDateQuery(period),
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
          createdAt: getDateQuery(period),
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
          createdAt: getDateQuery(period),
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
          createdAt: getDateQuery(period),
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
      // {
      //   $group: {
      //     _id: '$campaign._id',
      //     campaignName: { $first: '$name' },
      //     total_donation: { $sum: '$amount' },
      //   },
      // },

      {
        $group: {
          // _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          _id: '$_id',
          // created: {
          //   $first: {
          //     dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          //   },
          // },
          createdAt: { $first: '$createdAt' },
          campaignName: { $first: '$name' },
          total_donation: { $sum: '$amount' },
        },
      },
      {
        $project: {
          campaignName: 1,
          total_donation: 1,
          created: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
        },
      },
    ]);

    const campaignPerType = await this.campaignModel
      .where({
        organizationId: new Types.ObjectId(organizationId),
        createdAt: getDateQuery(period),
      })
      .select({
        _id: 1,
        title: 1,
        campaignType: 1,
        amountProgress: 1,
        amountTarget: 1,
      });
    const donorList = await this.donationLogModel.aggregate([
      {
        $match: {
          nonprofitRealmId: new Types.ObjectId(organizationId),
          donationStatus: 'SUCCESS',
          donorUserId: { $ne: null },
          createdAt: getDateQuery(period),
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

    const chartData: any = {};
    for (let i = 0; i < totalDonationPerProgram.length; i++) {
      const campaignData = totalDonationPerProgram[i];
      const year = campaignData['created'].substring(0, 4);
      if (!chartData[year]) {
        chartData[year] = {
          [campaignData['campaignName']]: [campaignData['total_donation']],
        };
      } else if (!chartData[year][campaignData['campaignName']]) {
        chartData[year][campaignData['campaignName']] = [
          campaignData['total_donation'],
        ];
      } else {
        chartData[year][campaignData['campaignName']].push(
          campaignData['total_donation'],
        );
      }
    }

    const periodList: object[] = [];
    for (const dt in chartData) {
      const dataList: object[] = [];
      for (const dt2 in chartData[dt]) {
        console.log(dt2);
        console.log(chartData[dt][dt2]);
        let dataEl: any = {};
        dataEl[dt2] = chartData[dt][dt2];
        dataList.push(dataEl);
      }
      periodList.push({
        period: dt,
        data: dataList,
      });
    }

    console.log(periodList);
    return {
      total_donation: totalDonation,
      total_program: totalProgram,
      total_donor: totalDonor,
      total_returning_donor: returningDonorAgg.length,
      most_popular_programs: mostPopularProgramsDiagram,
      total_donation_program: periodList,
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

    const notifSettings = await this.notifSettingsModel.find({
      organizationId: organization._id,
    });
    if (notifSettings) {
      return {
        statusCode: 400,
        message: 'Notification Settings is already exist.',
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

  async getFaqList(organizationId: string) {
    this.logger.debug(`getFaqList organizationId=${organizationId}`);
    return await this.notificationsModel.find({
      organizationId: new Types.ObjectId(organizationId),
    });
  }

  async createFaq(faqDto: FaqDto) {
    this.logger.debug('Get Organization...');
    const organization = await this.organizationModel.findOne({
      _id: new Types.ObjectId(faqDto.organizationId),
    });
    if (!organization) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }

    const faqCreated = await this.faqModel.create(faqDto);
    return {
      statusCode: 200,
      faq: faqCreated,
    };
  }

  async updateFaq(faqId: string, faqDto: FaqDto) {
    const faqUpdated = await this.faqModel.findOneAndUpdate(
      { _id: faqId },
      faqDto,
      { new: true },
    );

    if (!faqUpdated) {
      return {
        statusCode: 400,
        message: 'Failed',
      };
    }
    return {
      statusCode: 200,
      faq: faqUpdated,
    };
  }

  async addNotification(
    organizationId: string,
    notificationDto: NotificationDto,
  ) {
    this.logger.debug(`Get Organization ${organizationId}...`);
    const organization = await this.organizationModel.findOne({
      _id: new Types.ObjectId(organizationId),
    });
    if (!organization) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }

    const notifCreated = await this.notificationsModel.create(notificationDto);
    let now: Date = new Date();
    notifCreated.organizationId = new Types.ObjectId(organizationId);
    notifCreated.createdAt = now;
    notifCreated.updatedAt = now;
    notifCreated.markAsRead = false;
    notifCreated.save();
    return {
      statusCode: 200,
      notification: notifCreated,
    };
  }

  /** Nonprofit_appearance_navigation */
  async createLandingPage(
    organizationId: string,
    nonProfitAppearanceNavigationDto: NonProfitAppearanceNavigationDto,
  ) {
    this.logger.debug(`Get Organization ${organizationId}...`);
    const getOrgsId = await this.getOrganization(organizationId);
    if (getOrgsId.statusCode === 404) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }

    this.logger.debug('Create Landingpage Organization...');
    nonProfitAppearanceNavigationDto.organizationId = organizationId;
    nonProfitAppearanceNavigationDto.page = 'LANDINGPAGE';
    let now: Date = new Date();
    nonProfitAppearanceNavigationDto.createdAt = now.toISOString();
    nonProfitAppearanceNavigationDto.updatedAt = now.toISOString();
    const appearanceCreateLandingPage =
      await this.appearanceNavigationModel.create(
        nonProfitAppearanceNavigationDto,
      );
    return {
      statusCode: 200,
      appearancelandingpage: appearanceCreateLandingPage,
    };
  }

  async createAboutUs(
    organizationId: string,
    nonProfitAppearanceNavigationAboutUsDto: NonProfitAppearanceNavigationAboutUsDto,
  ) {
    this.logger.debug(`Get Organization ${organizationId}...`);
    const getOrgsId = await this.getOrganization(organizationId);
    if (getOrgsId.statusCode === 404) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }

    this.logger.debug('Create AboutUs Organization...');
    nonProfitAppearanceNavigationAboutUsDto.organizationId = organizationId;
    nonProfitAppearanceNavigationAboutUsDto.page = 'ABOUTUS';
    let now: Date = new Date();
    nonProfitAppearanceNavigationAboutUsDto.createdAt = now.toISOString();
    nonProfitAppearanceNavigationAboutUsDto.updatedAt = now.toISOString();
    const appearanceCreateAboutUs = await this.appearanceNavigationModel.create(
      nonProfitAppearanceNavigationAboutUsDto,
    );
    return {
      statusCode: 200,
      appearanceaboutus: appearanceCreateAboutUs,
    };
  }

  async createBlog(
    organizationId: string,
    nonProfitAppearanceNavigationBlogDto: NonProfitAppearanceNavigationBlogDto,
  ) {
    this.logger.debug(`Get Organization ${organizationId}...`);
    const getOrgsId = await this.getOrganization(organizationId);
    if (getOrgsId.statusCode === 404) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }
    this.logger.debug('Create createBlog Organization...');
    nonProfitAppearanceNavigationBlogDto.organizationId = organizationId;
    nonProfitAppearanceNavigationBlogDto.page = 'BLOG';
    let now: Date = new Date();
    nonProfitAppearanceNavigationBlogDto.createdAt = now.toISOString();
    nonProfitAppearanceNavigationBlogDto.updatedAt = now.toISOString();
    const appearanceCreateBlog = await this.appearanceNavigationModel.create(
      nonProfitAppearanceNavigationBlogDto,
    );
    return {
      statusCode: 200,
      appearanceblog: appearanceCreateBlog,
    };
  }
  async editLandingPage(
    organizationId: string,
    editNonProfitAppearanceNavigationDto: EditNonProfitAppearanceNavigationDto,
  ) {
    this.logger.debug(`Get Organization ${organizationId}...`);
    const getOrgsId = await this.getOrganization(organizationId);
    if (getOrgsId.statusCode === 404) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }

    let now: Date = new Date();
    editNonProfitAppearanceNavigationDto.organizationId = organizationId;
    editNonProfitAppearanceNavigationDto.updatedAt = now.toISOString();

    this.logger.debug('Edit Landingpage Organization...');
    const landingPageUpdated =
      await this.appearanceNavigationModel.findOneAndUpdate(
        { organizationId: organizationId, page: 'LANDINGPAGE' },
        editNonProfitAppearanceNavigationDto,
        { new: true },
      );

    if (!landingPageUpdated) {
      return {
        statusCode: 400,
        message: 'Failed',
      };
    }

    return {
      statusCode: 200,
      notification: landingPageUpdated,
    };
  }

  async editAboutUs(
    organizationId: string,
    editNonProfitAppearanceNavigationAboutUsDto: EditNonProfitAppearanceNavigationAboutUsDto,
  ) {
    this.logger.debug(`Get Organization ${organizationId}...`);
    const getOrgsId = await this.getOrganization(organizationId);
    if (getOrgsId.statusCode === 404) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }

    this.logger.debug('Edit AboutUs Organization...');
    let now: Date = new Date();
    editNonProfitAppearanceNavigationAboutUsDto.updatedAt = now.toISOString();
    const abouUsPageUpdated =
      await this.appearanceNavigationModel.findOneAndUpdate(
        { organizationId: organizationId, page: 'ABOUTUS' },
        editNonProfitAppearanceNavigationAboutUsDto,
        { new: true },
      );

    if (!abouUsPageUpdated) {
      return {
        statusCode: 400,
        message: 'Failed',
      };
    }

    return {
      statusCode: 200,
      notification: abouUsPageUpdated,
    };
  }

  async editBlog(
    organizationId: string,
    editNonProfitAppearanceNavigationBlogDto: EditNonProfitAppearanceNavigationBlogDto,
  ) {
    this.logger.debug(`Get Organization ${organizationId}...`);
    const getOrgsId = await this.getOrganization(organizationId);
    if (getOrgsId.statusCode === 404) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }
    this.logger.debug('Edit AboutUs Organization...');
    let now: Date = new Date();
    editNonProfitAppearanceNavigationBlogDto.updatedAt = now.toISOString();
    const blogUpdated = await this.appearanceNavigationModel.findOneAndUpdate(
      { organizationId: organizationId, page: 'BLOG' },
      editNonProfitAppearanceNavigationBlogDto,
      { new: true },
    );

    if (!blogUpdated) {
      return {
        statusCode: 400,
        message: 'Failed',
      };
    }

    return {
      statusCode: 200,
      notification: blogUpdated,
    };
  }

  async getLandingPage(organizationId: string) {
    this.logger.debug(`Get Organization ${organizationId}...`);
    const getOrgsId = await this.getOrganization(organizationId);
    if (getOrgsId.statusCode === 404) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }
    this.logger.debug('Get Landingpage Organization...');
    return await this.appearanceNavigationModel.find({
      organizationId: new Types.ObjectId(organizationId),
      page: 'LANDINGPAGE',
    });
  }

  async getAboutUs(organizationId: string) {
    this.logger.debug(`Get Organization ${organizationId}...`);
    const getOrgsId = await this.getOrganization(organizationId);
    if (getOrgsId.statusCode === 404) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }

    this.logger.debug('Get AboutUs Organization...');
    return await this.appearanceNavigationModel.find({
      organizationId: new Types.ObjectId(organizationId),
      page: 'ABOUTUS',
    });
  }

  async getBlog(organizationId: string) {
    this.logger.debug(`Get Organization ${organizationId}...`);
    const getOrgsId = await this.getOrganization(organizationId);
    if (getOrgsId.statusCode === 404) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }
    this.logger.debug('Create createBlog Organization...');
    return await this.appearanceNavigationModel.find({
      organizationId: new Types.ObjectId(organizationId),
      page: 'BLOG',
    });
  }
  /** ------------------------------- */

  /** Nonprofit_appearance_navigation */
  async createContactUs(
    organizationId: string,
    nonProfitAppearancePageDto: NonProfitAppearancePageDto,
  ) {
    this.logger.debug(`Get Organization ${organizationId}...`);
    const getOrgsId = await this.getOrganization(organizationId);
    if (getOrgsId.statusCode === 404) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }

    nonProfitAppearancePageDto.organizationId = organizationId;
    let now: Date = new Date();
    nonProfitAppearancePageDto.createdAt = now.toISOString();
    nonProfitAppearancePageDto.updatedAt = now.toISOString();
    this.logger.debug('Create ContactUs Organization...');
    const appearanceCreateContactUs = await this.appearancePageModel.create(
      nonProfitAppearancePageDto,
    );
    return {
      statusCode: 200,
      appearancecontactus: appearanceCreateContactUs,
    };
  }

  async editContactUs(
    organizationId: string,
    editNonProfitAppearancePageDto: EditNonProfitAppearancePageDto,
  ) {
    this.logger.debug(`Get Organization ${organizationId}...`);
    const getOrgsId = await this.getOrganization(organizationId);
    if (getOrgsId.statusCode === 404) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }

    this.logger.debug('Edit ContactUs Organization...');
    let now: Date = new Date();
    editNonProfitAppearancePageDto.updatedAt = now.toISOString();
    const appearanceEditContactUs =
      await this.appearancePageModel.findOneAndUpdate(
        { organizationId },
        editNonProfitAppearancePageDto,
      );

    if (!appearanceEditContactUs) {
      return {
        statusCode: 400,
        message: 'Failed',
      };
    }

    return {
      statusCode: 200,
      appearancecontactus: appearanceEditContactUs,
    };
  }

  async getContactUs(organizationId: string) {
    this.logger.debug(`Get Organization ${organizationId}...`);
    const getOrgsId = await this.getOrganization(organizationId);
    if (getOrgsId.statusCode === 404) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }
    this.logger.debug('Get ContactUs Organization...');
    return await this.appearancePageModel.find({
      organizationId: new Types.ObjectId(organizationId),
    });
  }
  /** ------------------------------- */

  /**
   * Get Data Donor Dashboard
   */
  async getInsightSummaryDonorId(
    organizationId: string,
    donorId: string,
    period: string,
    filter: FilterDonorDashboardDto,
  ) {
    this.logger.debug(`getInsightSummary organizationId=${organizationId}`);
    const getOrganization = await this.getOrganization(organizationId);
    if (getOrganization.statusCode === 404) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }
    this.logger.debug(`getInsightSummary donorId=${donorId}`);
    const getDonorId = await this.donorModel.findOne({
      ownerUserId: donorId,
    });

    // if (!period) period = '7days';
    // console.log('filter=>', filter);

    if (!filter.priode) filter.priode = FilterQueryDonorDashboard.DAYS;

    if (!getDonorId) {
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

    const getDateQuery = (filterBy: FilterQueryDonorDashboard) => {
      const today = new Date();

      switch (filterBy) {
        case FilterQueryDonorDashboard.YEAR:
          const thisYear = new Date();
          thisYear.setDate(1);
          thisYear.setMonth(1);
          return {
            $exists: true,
            $gte: thisYear,
          };

        case FilterQueryDonorDashboard.MONTH:
          // case '30days':
          const thirtyDaysAgo: Date = new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000,
          );
          return {
            $exists: true,
            $gte: thirtyDaysAgo,
          };

        default:
          const sevenDaysAgo: Date = new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
          );
          return {
            $gte: sevenDaysAgo,
          };
      }
    };

    const filterCampaigns = {
      campaignId: filter.campaignId
        ? filter.campaignId
        : '6299ed6a9f1ad428563563ed',
      donationStatus: 'SUCCESS',
      donorUserId: donorId,
      currency: filter.currency ? filter.currency : 'GBP',
      nonprofitRealmId: filter.nonprofitRealmId
        ? filter.nonprofitRealmId
        : '62414373cf00cca3a830814a',
    };

    const totalZakatCampaigns = await this.donationLogModel
      .find({
        campaignId: new Types.ObjectId(filterCampaigns.campaignId),
        donationStatus: filterCampaigns.donationStatus,
        donorUserId: filterCampaigns.donorUserId,
        currency: filterCampaigns.currency,
        nonprofitRealmId: new Types.ObjectId(filterCampaigns.nonprofitRealmId),
      })
      .count();

    // const listZakatCampaigns = await this.donationLogModel.aggregate([
    //   {
    //     $match: {
    //       campaignId: new Types.ObjectId(filterCampaigns.campaignId),
    //       donationStatus: filterCampaigns.donationStatus,
    //       donorUserId: filterCampaigns.donorUserId,
    //       currency: filterCampaigns.currency,
    //       nonprofitRealmId: new Types.ObjectId(filterCampaigns.nonprofitRealmId),
    //       createdAt: getDateQuery(period),
    //     }
    //   },
    //   {
    //     $group: {
    //       _id: '$campaignId',
    //       amountOfZakatCampaigns: { $sum: '$amount' },
    //     }
    //   }
    // ]);

    // const listCampaigns = await this.donationLogModel.aggregate([
    //   {
    //     $match: {
    //       campaignId: { $ne: new Types.ObjectId(filterCampaigns.campaignId) },
    //       donationStatus: filterCampaigns.donationStatus,
    //       donorUserId: filterCampaigns.donorUserId,
    //       currency: filterCampaigns.currency,
    //       nonprofitRealmId: new Types.ObjectId(filterCampaigns.nonprofitRealmId),
    //       createdAt: getDateQuery(period),
    //     }
    //   },
    //   {
    //     $group: {
    //       _id: '$campaignId',
    //       amountOfZakatCampaigns: { $sum: '$amount' },
    //       currency: { $first: '$currency' }
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: 'campaign',
    //       localField: 'campaignId',
    //       foreignField: '_id',
    //       as: 'campaign',
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: '$campaign',
    //     },
    //   },
    //   {
    //     $addFields: {
    //       name: {
    //         $cond: {
    //           if: { $eq: [{ $ifNull: ['$campaign.title', 0] }, 0] },
    //           then: '$campaign.campaignName',
    //           else: '$campaign.title',
    //         },
    //       },
    //     },
    //   },

    //   {
    //     $group: {
    //       _id: '$_id',
    //       createdAt: { $first: '$createdAt' },
    //       campaignName: { $first: '$name' },
    //       total_donation: { $sum: '$amount' },
    //     },
    //   },
    //   {
    //     $project: {
    //       campaignName: 1,
    //       total_donation: 1,
    //       created: {
    //         $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
    //       },
    //     },
    //   },

    // ]);

    // console.log('list Zakat Campaign', listZakatCampaigns, 'list Campaign', listCampaigns);

    const totalCampaigns = await this.donationLogModel
      .find({
        campaignId: { $ne: new Types.ObjectId(filterCampaigns.campaignId) },
        donationStatus: filterCampaigns.donationStatus,
        donorUserId: filterCampaigns.donorUserId,
        currency: filterCampaigns.currency,
        nonprofitRealmId: new Types.ObjectId(filterCampaigns.nonprofitRealmId),
      })
      .count();

    const amountCampaigns = await this.donationLogModel.aggregate([
      {
        $match: {
          campaignId: { $ne: new Types.ObjectId(filterCampaigns.campaignId) },
          donationStatus: 'SUCCESS',
          donorUserId: donorId,
          currency: filterCampaigns.currency,
          nonprofitRealmId: new Types.ObjectId(organizationId),
        },
      },
      {
        $group: {
          // _id: '$campaignId',
          _id: '$donorUserId',
          amountOfCampaigns: { $sum: '$amount' },
          currency: { $first: '$currency' },
        },
      },
    ]);

    const amountZakatCampaigns = await this.donationLogModel.aggregate([
      {
        $match: {
          campaignId: new Types.ObjectId(filterCampaigns.campaignId),
          donationStatus: 'SUCCESS',
          donorUserId: donorId,
          currency: filterCampaigns.currency,
          nonprofitRealmId: new Types.ObjectId(organizationId),
        },
      },
      {
        $group: {
          // _id: '$campaignId',
          _id: '$donorUserId',
          amountOfZakat: { $sum: '$amount' },
          currency: { $first: '$currency' },
        },
      },
    ]);

    const totalDonationPerProgram = await this.donationLogModel.aggregate([
      {
        $match: {
          nonprofitRealmId: new Types.ObjectId(organizationId),
          donationStatus: 'SUCCESS',
          // donorUserId: { $ne: null },
          donorUserId: donorId,
          // createdAt: getDateQuery(period),
          createdAt: getDateQuery(filter.priode),
          campaignId: { $ne: new Types.ObjectId(filterCampaigns.campaignId) },
          currency: filterCampaigns.currency,
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
          _id: '$_id',
          createdAt: { $first: '$createdAt' },
          campaignName: { $first: '$name' },
          total_donation: { $sum: '$amount' },
        },
      },
      {
        $project: {
          campaignName: 1,
          total_donation: 1,
          created: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
        },
      },
    ]);

    const totalDonationZakatPerProgram = await this.donationLogModel.aggregate([
      {
        $match: {
          nonprofitRealmId: new Types.ObjectId(organizationId),
          donationStatus: 'SUCCESS',
          donorUserId: donorId,
          createdAt: getDateQuery(filter.priode),
          campaignId: new Types.ObjectId(filterCampaigns.campaignId),
          currency: filterCampaigns.currency,
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
          _id: '$_id',
          createdAt: { $first: '$createdAt' },
          campaignName: { $first: '$name' },
          total_donation: { $sum: '$amount' },
        },
      },
      {
        $project: {
          campaignName: 1,
          total_donation: 1,
          created: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
        },
      },
    ]);

    const chartData: any = {};
    for (let i = 0; i < totalDonationPerProgram.length; i++) {
      const campaignData = totalDonationPerProgram[i];
      const year = campaignData['created'].substring(0, 4);
      if (!chartData[year]) {
        chartData[year] = {
          [campaignData['campaignName']]: [campaignData['total_donation']],
        };
      } else if (!chartData[year][campaignData['campaignName']]) {
        chartData[year][campaignData['campaignName']] = [
          campaignData['total_donation'],
        ];
      } else {
        chartData[year][campaignData['campaignName']].push(
          campaignData['total_donation'],
        );
      }
    }

    const periodList: object[] = [];
    for (const dt in chartData) {
      const dataList: object[] = [];
      for (const dt2 in chartData[dt]) {
        let dataEl: any = {};
        dataEl[dt2] = chartData[dt][dt2];
        dataList.push(dataEl);
      }
      periodList.push({
        period: filter.priode,
        data: dataList,
      });
    }
    const chartDataZakat: any = {};
    for (let i = 0; i < totalDonationZakatPerProgram.length; i++) {
      const campaignData = totalDonationZakatPerProgram[i];
      const year = campaignData['created'].substring(0, 4);
      if (!chartDataZakat[year]) {
        chartDataZakat[year] = {
          [campaignData['campaignName']]: [campaignData['total_donation']],
        };
      } else if (!chartDataZakat[year][campaignData['campaignName']]) {
        chartDataZakat[year][campaignData['campaignName']] = [
          campaignData['total_donation'],
        ];
      } else {
        chartDataZakat[year][campaignData['campaignName']].push(
          campaignData['total_donation'],
        );
      }
    }

    const periodListZakat: object[] = [];
    for (const dt in chartDataZakat) {
      const dataListZakat: object[] = [];
      for (const dt2 in chartDataZakat[dt]) {
        let dataEl: any = {};
        dataEl[dt2] = chartDataZakat[dt][dt2];
        dataListZakat.push(dataEl);
      }
      periodListZakat.push({
        period: filter.priode,
        data: dataListZakat,
      });
    }

    return {
      total_donation:
        totalZakatCampaigns || totalCampaigns
          ? (totalZakatCampaigns ? totalZakatCampaigns : 0) +
          (totalCampaigns ? totalCampaigns : 0)
          : 0,
      campaigns: totalCampaigns ? totalCampaigns : 0,
      amount_ofcampaigns: amountCampaigns ? amountCampaigns : 0,
      zakat: totalZakatCampaigns ? totalZakatCampaigns : 0,
      amount_ofzakat_campaigns: amountZakatCampaigns ? amountZakatCampaigns : 0,
      total_amount_donations: periodList,
      total_amount_zakat: periodListZakat,
      // campaign_per_type: campaignPerType.slice(0, 5),
      // donor_list: donorList,
    };
  }
}
