import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  HttpStatus,
  ConflictException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AggregatePaginateModel,
  AggregatePaginateResult,
  Model,
  Types,
} from 'mongoose';
import { ROOT_LOGGER } from '../libs/root-logger';
import { FusionAuthClient } from '@fusionauth/typescript-client';
import { ConfigService } from '@nestjs/config';

import { OrganizationDto } from './dto/organization.dto';
import { RegisterOrganizationDto } from 'src/auth/dtos';
import {
  Organization,
  OrganizationDocument,
} from './schema/organization.schema';
import { Donor, DonorDocument } from 'src/donor/schema/donor.schema';
import {
  PaymentGateway,
  PaymentGatewayDocument,
} from 'src/donation/schema/paymentGateway.schema';
import {
  Campaign,
  CampaignDocument,
} from 'src/campaign/schema/campaign.schema';
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
  EditNonProfitAppearanceNavigationBlogDto,
  EditNonProfApperNavDto,
  EditNonProfApperNavAboutUsDto,
} from './dto/nonprofit_appearance_navigation.dto';
import { DonorsFilterDto, FilterDonorDashboardDto } from './dto';
import { FilterQueryDonorDashboard } from './enums';
import { EmailService } from '../libs/email/email.service';
import { BunnyService } from '../libs/bunny/services/bunny.service';
import {
  DonationLogs,
  DonationLogsDocument,
} from '../donation/schema/donation_log.schema';
import {
  DonationLog,
  DonationLogDocument,
} from '../donation/schema/donation-log.schema';
import { SendEmailDto } from '../libs/email/dtos/requests/send-email.dto';
import moment from 'moment';

//
import { ZakatLog, ZakatLogDocument } from 'src/zakat/schemas/zakat_log.schema';
import { FileMimeTypeEnum } from 'src/commons/enums/file-mimetype.enum';
import { generateFileName } from 'src/tender-commons/utils/generate-filename';
import { validateAllowedExtension } from 'src/commons/utils/validate-allowed-extension';
import { validateFileSize } from 'src/commons/utils/validate-file-size';
import { RegisterFileUpload } from 'src/auth/dtos';
import { envLoadErrorHelper } from 'src/commons/helpers/env-loaderror-helper';
import { CreateNewOrganizationMappers } from './mappers/organization.mappers';
import { CreateNewAppearance } from './mappers/apperance.mappers';
import { CreateNewPaymentGateway } from './mappers/payment-gateway.mappers';

@Injectable()
export class OrganizationService {
  private readonly appEnv: string;
  private readonly logger = ROOT_LOGGER.child({
    logger: OrganizationService.name,
  });

  constructor(
    private readonly emailService: EmailService,
    private bunnyService: BunnyService,
    @InjectModel(Appearance.name)
    private appearanceModel: Model<AppearanceDocument>,
    @InjectModel(Campaign.name)
    private campaignModel: Model<CampaignDocument>,
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
    @InjectModel(DonationLogs.name)
    private donationLogsModel: Model<DonationLogsDocument>,
    @InjectModel(DonationLogs.name)
    private donationLogsAggregatePaginateModel: AggregatePaginateModel<DonationLogsDocument>,
    @InjectModel(DonationLog.name)
    private donationLogModel: Model<DonationLogDocument>,
    @InjectModel(DonationLog.name)
    private donationLogAggregatePaginateModel: AggregatePaginateModel<DonationLogDocument>,
    @InjectModel(ZakatLog.name)
    private zakatLogModel: Model<ZakatLogDocument>,
  ) {
    const environment = this.configService.get('APP_ENV');
    if (!environment) envLoadErrorHelper('APP_ENV');
    this.appEnv = environment;
  }

  async findAll() {
    this.logger.debug('findAll...');
    return await this.organizationModel.find(
      {},
      {
        _id: true,
        name: true,
        organizationEmail: true,
        contactEmail: true,
        organizationType: true,
      },
      { sort: { name: 1 } },
    );
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

    if (!orgUpdated) {
      throw new BadRequestException('Update failed');
    }

    try {
      if (orgUpdated && organization.aboutPicture) {
        this.updateUserProfile(
          orgUpdated.ownerUserId,
          organization.aboutPicture,
        );
      }

      // const emailData = { name: orgUpdated.name };

      // const emailParams: SendEmailDto = {
      //   to: orgUpdated.contactEmail, // change to your email to test, ex: rdanang.dev@gmail.com, default value is registeredUser.email
      //   subject: 'Giving Sadaqah Updates',
      //   mailType: 'template',
      //   templatePath: 'account_update',
      //   templateContext: {
      //     name: orgUpdated.name,
      //   },
      //   from: 'hello@tmra.io', // we can make it dynamic when new AWS SESW identity available
      // };

      // await this.emailService.sendMail(emailParams);

      return {
        statusCode: 200,
        organization: orgUpdated,
      };
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.BAD_REQUEST);
    }
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
      _id: organizationId,
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

    if (!organization) {
      throw new NotFoundException('Organization not found!');
    }

    const appearance = await this.appearanceModel.find({
      _id: organization._id,
    });

    if (appearance) {
      throw new ConflictException('Appearance is already exist.');
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
      { _id: organizationId },
      appearance,
      { new: true },
    );

    console.log({
      appearanceUpdated,
      favicon: appearance.favIcon,
    });

    if (appearanceUpdated) {
      await this.organizationModel.findOneAndUpdate(
        { _id: appearanceUpdated._id },
        { favicon: appearanceUpdated.favIcon },
        { new: true },
      );
    }

    if (!appearanceUpdated) {
      return {
        statusCode: 400,
        message: 'Failed update appearance',
      };
    }

    return {
      statusCode: 200,
      appearance: appearanceUpdated,
    };
  }

  async getDonorList(organizationId: string) {
    this.logger.debug(`getDonorList organizationId=${organizationId}`);

    const getDonationLog = await this.donationLogModel
      .aggregate([
        {
          $match: {
            organizationId,
            donationStatus: 'SUCCESS',
            campaignId: { $ne: null },
          },
        },
        {
          $project: {
            _id: 1,
            donorId: 1,
            createdAt: 1,
            updatedAt: 1,
            amount: 1,
            lengthDonorId: { $strLenCP: '$donorId' },
          },
        },
        {
          $lookup: {
            from: 'donor',
            localField: 'donorId',
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
          $addFields: {
            donorIdAnonymous: {
              $cond: [
                { $eq: ['$lengthDonorId', 24] },
                { $toObjectId: '$donorId' },
                '$donorId',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'anonymous',
            let: {
              tempDonorId: '$donorIdAnonymous',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [{ $eq: ['$$tempDonorId', '$_id'] }],
                  },
                },
              },
            ],
            as: 'user_anonymous',
          },
        },
        {
          $unwind: {
            path: '$user_anonymous',
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .sort({ createdAt: -1 });

    if (!getDonationLog) {
      throw new NotFoundException('donor not found for this organizationId');
    }

    const getDonationLogCarts = await this.donationLogsModel
      .aggregate([
        {
          $match: {
            organizationId,
            type: 'cart',
            donationStatus: 'SUCCESS',
            campaignId: { $ne: null },
          },
        },
        {
          $project: {
            _id: 1,
            donorUserId: 1,
            createdAt: 1,
            updatedAt: 1,
            amount: 1,
            lengthDonorId: { $strLenCP: '$donorUserId' },
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
          $addFields: {
            donorIdAnonymous: {
              $cond: [
                { $eq: ['$lengthDonorId', 24] },
                { $toObjectId: '$donorUserId' },
                '$donorUserId',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'anonymous',
            let: {
              tempDonorId: '$donorIdAnonymous',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [{ $eq: ['$$tempDonorId', '$_id'] }],
                  },
                },
              },
            ],
            as: 'user_anonymous',
          },
        },
        {
          $unwind: {
            path: '$user_anonymous',
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .sort({ createdAt: -1 });

    if (!getDonationLogCarts) {
      throw new NotFoundException('donor not found for this organizationId');
    }

    const filterDonorLog = getDonationLog.map((item) => {
      const donorId = item.donorId;
      let _id, user;

      if (item.user) {
        _id = item._id;
        user = item.user;
      } else if (item.user_anonymous) {
        _id = item._id;
        user = item.user_anonymous;
      } else {
        _id = item._id;
        user = null;
      }

      return {
        _id,
        donorId,
        firstName: user && user.firstName ? user.firstName : null,
        lastName: user && user.lastName ? user.lastName : null,
        email: user && user.email ? user.email : null,
        country: user && user.country ? user.country : null,
        mobile: user && user.mobile ? user.mobile : null,
        totalAmount: item.amount,
        is_anonymous: user && user.anonymous ? user.anonymous : false,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    const filterDonorLogCarts = getDonationLogCarts.map(
      (item, index, array) => {
        const donorId = item.donorUserId;
        let _id, user;

        if (item.user) {
          _id = item._id;
          user = item.user;
        } else if (item.user_anonymous) {
          _id = item._id;
          user = item.user_anonymous;
        } else {
          if (array[index + 1]) {
            _id = item._id;
            user = array[index + 1].user_anonymous;
          } else {
            _id = item._id;
            user = null;
          }
        }

        return {
          _id,
          donorId,
          firstName: user && user.firstName ? user.firstName : null,
          lastName: user && user.lastName ? user.lastName : null,
          email: user && user.email ? user.email : null,
          country: user && user.country ? user.country : null,
          mobile: user && user.mobile ? user.mobile : null,
          totalAmount: item.amount,
          is_anonymous: user && user.anonymous ? user.anonymous : false,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      },
    );

    const allDonorUser = filterDonorLog
      .concat(filterDonorLogCarts)
      .sort(
        (objA, objB) =>
          new Date(objB.createdAt).valueOf() -
          new Date(objA.createdAt).valueOf(),
      );

    return allDonorUser;
  }

  async getDonorsList(
    filter: DonorsFilterDto,
  ): Promise<AggregatePaginateResult<DonationLogDocument>> {
    this.logger.debug(`getDonorsList organizationId=${filter}`);
    const { limit = 10, page = 1 } = filter;

    let sortData = {};
    sortData = {
      donorId: filter.donor == 'asc' ? 1 : -1,
    };
    if (filter.donorName) {
      sortData = {
        firstName: filter.donorName == 'asc' ? 1 : -1,
        lastName: filter.donorName == 'asc' ? 1 : -1,
      };
    }
    if (filter.email) {
      sortData = {
        email: filter.email == 'asc' ? 1 : -1,
      };
    }
    if (filter.country) {
      sortData = {
        country: filter.country == 'asc' ? 1 : -1,
      };
    }
    if (filter.phoneNumber) {
      sortData = {
        mobile: filter.phoneNumber == 'asc' ? 1 : -1,
      };
    }
    if (filter.amount) {
      sortData = {
        totalAmount: filter.amount == 'asc' ? 1 : -1,
      };
    }
    if (filter.transactionDate) {
      sortData = {
        createdAt: filter.transactionDate == 'asc' ? 1 : -1,
      };
    }
    if (filter.email) {
      sortData = {
        email: filter.email == 'asc' ? 1 : -1,
      };
    }

    const aggregateQuerry = this.donationLogModel.aggregate([
      {
        $match: {
          organizationId: filter.organizationId,
          donationStatus: 'SUCCESS',
          donorId: { $ne: null },
        },
      },
      {
        $lookup: {
          from: 'donor',
          localField: 'donorId',
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
          campaignName: { $first: '$campaign.title' },
          campaignType: { $first: '$campaign.islamCharityType' },
        },
      },
    ]);

    const donorList =
      await this.donationLogAggregatePaginateModel.aggregatePaginate(
        aggregateQuerry,
        {
          page,
          limit,
          sort: sortData,
        },
      );
    return donorList;
  }

  async getPaymentGatewayList(organizationId: string) {
    this.logger.debug(`getPaymentGatewayList organizationId=${organizationId}`);
    return await this.paymentGatewayModel.findOne({
      organizationId: new Types.ObjectId(organizationId),
    });
  }

  async updatePaymentGateway(
    organizationId: string,
    paymentGatewayDto: PaymentGateWayDto,
  ) {
    this.logger.debug('Get Organization...');

    const organization = await this.organizationModel.findOne({
      _id: new Types.ObjectId(organizationId),
    });

    if (!organization) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
    }

    const now: Date = new Date();

    paymentGatewayDto.name = paymentGatewayDto.name.toUpperCase();
    paymentGatewayDto.updatedAt = now.toISOString();

    if (paymentGatewayDto.name === 'PAYTABS') {
      paymentGatewayDto.profileId = paymentGatewayDto.profileName;
    }

    const paymentGatewayUpdate =
      await this.paymentGatewayModel.findOneAndUpdate(
        { organizationId: new Types.ObjectId(organizationId) },
        paymentGatewayDto,
        { new: true },
      );

    if (!paymentGatewayUpdate) {
      throw new HttpException(
        'Failed update Payment Gateway',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      statusCode: 200,
      paymentGateway: paymentGatewayUpdate,
    };
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
    const now: Date = new Date();
    paymentGatewayDto.createdAt = now.toISOString();
    paymentGatewayDto.updatedAt = now.toISOString();
    paymentGatewayDto.organizationId = new Types.ObjectId(organizationId);
    paymentGatewayCreated.save();

    return {
      statusCode: 200,
      paymentGateway: paymentGatewayCreated,
    };
  }

  async getInsightSummary(
    organizationId: string,
    period: string,
    startDate?: string,
    endDate?: string,
  ) {
    this.logger.debug(`getInsightSummary organizationId=${organizationId}`);

    // Variable return insight campaign
    let total_donation = 0,
      total_donor = 0,
      total_returning_donor = 0,
      total_program = 0,
      donor_list: {
        _id: string;
        name: string;
        country: string;
        total: number;
      }[] = [],
      most_popular_programs: {
        campaignId: string;
        campaignName: string;
        campaignType: string;
        campaignProgress: string;
        campaignTarget: string;
        count: number;
      }[] = [],
      total_donation_period: {
        frequenceType: number;
        categories: string[];
        data:
          | {
              name: string;
              data: number[];
            }[]
          | [];
      } | null = null;

    // Variable return insight zakat
    let zakat_logs: {
      type: string;
      totalAmount: number;
      count: number;
    }[] = [];

    const getOrganization = await this.organizationModel.findOne({
      _id: organizationId,
    });

    if (!period) period = '7days';

    if (period === 'custom' && (!startDate || !endDate)) {
      throw new BadRequestException(
        'Request rejected must fill start date or end date',
      );
    }

    if (!getOrganization)
      throw new BadRequestException(
        'Request rejected organizationId not found',
      );

    const getDateQuery = (filterBy: string) => {
      switch (filterBy) {
        case 'year':
          const thisYear = new Date();
          thisYear.setDate(1);
          thisYear.setMonth(1);
          return {
            $exists: true,
            $gt: thisYear,
            $lt: moment().toDate(),
          };
        case '12months':
          const twelveMonthsAgo: Date = moment().subtract(12, 'M').toDate();
          return {
            $exists: true,
            $gt: twelveMonthsAgo,
            $lt: moment().toDate(),
          };
        case '90days':
          const ninetyDaysAgo: Date = moment().subtract(90, 'd').toDate();
          return {
            $exists: true,
            $gt: ninetyDaysAgo,
            $lt: moment().toDate(),
          };
        case '30days':
          const thirtyDaysAgo: Date = moment().subtract(30, 'd').toDate();
          return {
            $exists: true,
            $gte: thirtyDaysAgo,
            $lt: moment().toDate(),
          };
        case '28days':
          const twentyEightDaysAgo: Date = moment().subtract(28, 'd').toDate();

          return {
            $exists: true,
            $gte: twentyEightDaysAgo,
            $lt: moment().toDate(),
          };
        case 'yesterday':
          const startAt: Date = moment().startOf('day').toDate();
          const endAt: Date = moment(startAt).subtract(1, 'd').toDate();

          return {
            $exists: true,
            $gt: endAt,
            $lt: startAt,
          };
        case 'today':
          const today: Date = moment().startOf('day').toDate();

          return {
            $exists: true,
            $gt: today,
          };
        case 'custom':
          return {
            $exists: true,
            $gt: moment(startDate!).toDate(),
            $lt: moment(endDate!).toDate(),
          };
        default:
          const sevenDaysAgo: Date = moment().subtract(7, 'd').toDate();

          return {
            $gt: sevenDaysAgo,
            $lt: moment().toDate(),
          };
      }
    };

    const donationList = await this.donationLogModel.aggregate([
      {
        $match: {
          organizationId: organizationId,
          donationStatus: 'SUCCESS',
          // donorId: { $ne: null },
          campaignId: { $ne: null },
          createdAt: getDateQuery(period),
        },
      },
      {
        $project: {
          date: { $dateToString: { date: '$createdAt' } },
          campaignId: { $toObjectId: '$campaignId' },
          amount: 1,
          donorId: 1,
          lengthDonorId: { $strLenCP: '$donorId' },
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
        $lookup: {
          from: 'donor',
          localField: 'donorId',
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
        $addFields: {
          donorIdAnonymous: {
            $cond: [
              { $eq: ['$lengthDonorId', 24] },
              { $toObjectId: '$donorId' },
              '$donorId',
            ],
          },
        },
      },
      {
        $lookup: {
          from: 'anonymous',
          let: {
            donorId: '$donorIdAnonymous',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [{ $eq: ['$$donorId', '$_id'] }],
                },
              },
            },
          ],
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
        $group: {
          _id: { createdAt: '$date' },
          totalDonor: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          campaignId: { $first: '$campaign._id' },
          campaignName: { $first: '$campaign.campaignName' },
          campaignType: { $first: '$campaign.campaignType' },
          campaignProgress: { $first: '$campaign.amountProgress' },
          campaignTarget: { $first: '$campaign.amountTarget' },
          user: { $first: '$user' },
          user_anonymous: { $first: '$user_anonymous' },
        },
      },
      {
        $addFields: {
          date: '$_id.createdAt',
          donor: {
            _id: {
              $cond: [
                { $eq: [{ $ifNull: ['$user', 0] }, 0] },
                '$user_anonymous._id',
                '$user._id',
              ],
            },
            name: {
              $cond: [
                { $eq: [{ $ifNull: ['$user', 0] }, 0] },
                '$user_anonymous.firstName',
                '$user.firstName',
              ],
            },
            country: {
              $cond: [
                { $eq: [{ $ifNull: ['$user', 0] }, 0] },
                '$user_anonymous.country',
                '$user.country',
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          user: 0,
          campaign: 0,
          user_anonymous: 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    const donationLogsCartList = await this.donationLogsModel.aggregate([
      {
        $match: {
          nonprofitRealmId: new Types.ObjectId(organizationId),
          donationStatus: 'SUCCESS',
          // donorUserId: { $ne: null },
          campaignId: { $ne: null },
          type: 'cart',
          createdAt: getDateQuery(period),
        },
      },
      {
        $project: {
          date: { $dateToString: { date: '$createdAt' } },
          amount: 1,
          campaignId: 1,
          donorUserId: 1,
          lengthDonorId: { $strLenCP: '$donorUserId' },
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
        $addFields: {
          donorIdAnonymous: {
            $cond: [
              { $eq: ['$lengthDonorId', 24] },
              { $toObjectId: '$donorUserId' },
              '$donorUserId',
            ],
          },
        },
      },
      {
        $lookup: {
          from: 'anonymous',
          let: {
            donorId: '$donorIdAnonymous',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [{ $eq: ['$$donorId', '$_id'] }],
                },
              },
            },
          ],
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
        $group: {
          _id: { createdAt: '$date' },
          totalDonor: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          campaignId: { $first: '$campaign._id' },
          campaignName: { $first: '$campaign.campaignName' },
          campaignType: { $first: '$campaign.campaignType' },
          campaignProgress: { $first: '$campaign.amountProgress' },
          campaignTarget: { $first: '$campaign.amountTarget' },
          user: { $first: '$user' },
          user_anonymous: { $first: '$user_anonymous' },
        },
      },
      {
        $addFields: {
          date: '$_id.createdAt',
          donor: {
            _id: {
              $cond: [
                { $eq: [{ $ifNull: ['$user', 0] }, 0] },
                '$user_anonymous._id',
                '$user._id',
              ],
            },
            name: {
              $cond: [
                { $eq: [{ $ifNull: ['$user', 0] }, 0] },
                '$user_anonymous.firstName',
                '$user.firstName',
              ],
            },
            country: {
              $cond: [
                { $eq: [{ $ifNull: ['$user', 0] }, 0] },
                '$user_anonymous.country',
                '$user.country',
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          user: 0,
          campaign: 0,
          user_anonymous: 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    // Get Zakat Transaction
    const zakatDateFilter = await this.donationLogsModel.aggregate([
      {
        $match: {
          donationStatus: 'SUCCESS',
          // donorUserId: { $ne: null },
          campaignId: new Types.ObjectId('6299ed6a9f1ad428563563ed'),
          createdAt: getDateQuery(period),
        },
      },
      {
        $project: {
          date: { $dateToString: { date: '$createdAt' } },
          amount: 1,
          campaignId: 1,
          donorUserId: 1,
        },
      },
      {
        $group: {
          _id: { createdAt: '$date' },
          donationId: { $first: '$_id' },
          totalDonor: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    const listZakatDID = zakatDateFilter.map((el) => el.donationId);

    const zakatLogs = await this.zakatLogModel.aggregate([
      {
        $match: {
          donationLogId: { $in: listZakatDID },
        },
      },
      {
        $project: {
          _id: 1,
          donationLogId: 1,
          type: 1,
          currency: 1,
          totalAmount: 1,
          unit: 1,
        },
      },
    ]);

    // Return all donations
    const allDonationLogs = donationList
      .concat(donationLogsCartList)
      .sort(
        (objA, objB) =>
          moment(objB.date).valueOf() - moment(objA.date).valueOf(),
      );

    // throw new HttpException('Data is empty', HttpStatus.RESET_CONTENT);
    if (allDonationLogs.length) {
      // Return total donation amount
      total_donation = allDonationLogs
        .map((v) => v.totalAmount)
        .reduce((amountA, amountB) => amountA + amountB);

      // Return total donor
      const getDonorData = allDonationLogs.map((v) => v.donor);
      total_donor = getDonorData.length;
      total_returning_donor = getDonorData.length;

      const objReduceList = getDonorData.reduce((acc, val) => {
        return {
          ...acc,
          [val._id]: (acc[val._id] || 0) + 1,
        };
      }, {});

      donor_list = getDonorData
        .map((el) => {
          return {
            _id: el._id.toString(),
            name: el.name,
            country: el.country,
            total: objReduceList[el._id.toString()],
          };
        })
        .filter((v, i, a) => a.findIndex((v2) => v2._id === v._id) === i);

      // Return program campaign
      const allProgramsCampaign = allDonationLogs.map((el) => {
        return {
          campaignId: el.campaignId.toString(),
          campaignName: el.campaignName,
          campaignType: el.campaignType,
          campaignProgress: el.campaignProgress.toString(),
          campaignTarget: el.campaignTarget.toString(),
        };
      });

      const getTotal_program = allProgramsCampaign.filter(
        (v, i, a) => a.findIndex((v2) => v2.campaignId === v.campaignId) === i,
      );
      total_program = getTotal_program.length;

      const objReduceProgram = allDonationLogs.reduce((acc, val) => {
        return {
          ...acc,
          [val.campaignId]: (acc[val.campaignId] || 0) + 1,
        };
      }, {});

      most_popular_programs = getTotal_program.map((v) => {
        return {
          ...v,
          count: objReduceProgram[v.campaignId],
        };
      });

      // Return total_donatoin_period
      const categories = allDonationLogs.map((el) => el.date);
      const objReduceDonation = allDonationLogs.reduce((results, org) => {
        (results[org.campaignName] = results[org.campaignName] || []).push(org);

        return results;
      }, {});

      const campaignCategories = allProgramsCampaign.filter(
        (v, i, a) => a.findIndex((v2) => v2.campaignId === v.campaignId) === i,
      );

      const getLineCartData = campaignCategories.map((v) => {
        const totalAmount = objReduceDonation[v.campaignName].map(
          (el: { totalAmount: number }) => el.totalAmount,
        );

        return {
          name: v.campaignName,
          data: totalAmount,
        };
      });

      const lineChartDatas = getLineCartData.map((value, i) => {
        const catLength = categories.length;
        const prev = getLineCartData[i - 1]?.data.length;
        const current = getLineCartData[i]?.data.length;
        const next = getLineCartData[i + 1]?.data.length;

        const newData: any[] = [...value.data];

        if (i === 0) {
          for (let index = 0; index < catLength - current; index++) {
            newData.push(0);
          }
        } else if (
          value.name ===
          campaignCategories[campaignCategories.length - 1].campaignName
        ) {
          for (let index = 0; index < catLength - current; index++) {
            newData.unshift(0);
          }
        } else if (prev && next) {
          for (let index = 0; index < prev; index++) {
            newData.unshift(0);
          }

          for (let index = 0; index < next; index++) {
            newData.push(0);
          }
        }

        return {
          name: value.name,
          data: newData,
        };
      });

      total_donation_period = {
        frequenceType: moment().year(),
        categories,
        data: lineChartDatas,
      };
    }

    if (zakatLogs.length) {
      const objTypeZakat = zakatLogs.reduce((acc, val) => {
        return {
          ...acc,
          [val.type]: (acc[val.type] || 0) + 1,
        };
      }, {});

      const newZ = zakatLogs.reduce((r, a) => {
        r[a.type] = r[a.type] || [];
        r[a.type].push(a);

        return r;
      }, {});

      const keys = Object.keys(objTypeZakat);
      const res = [];

      for (let i = 0; i < keys.length; i++) {
        const totalAmountType = newZ[keys[i]]
          .map((el: { totalAmount: any }) => el.totalAmount)
          .reduce((a: number, b: number) => a + b);

        res.push({
          type: keys[i],
          totalAmount: totalAmountType,
          count: objTypeZakat[keys[i]],
        });
      }

      zakat_logs = res;
    }

    return {
      campaigns: {
        total_donation,
        total_donor,
        total_returning_donor,
        total_program,
        donor_list,
        most_popular_programs,
        total_donation_period,
      },
      zakat_logs,
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

    let filterData = {};
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
    const now: Date = new Date();
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
    this.logger.debug(`Get Organization. ${organizationId}...`);
    const getOrgsId = await this.getOrganization(organizationId);
    if (getOrgsId.statusCode === 404) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }

    const LandingpageData = await this.appearanceNavigationModel.findOne({
      organizationId: organizationId,
      page: 'LANDINGPAGE',
    });

    if (LandingpageData) {
      throw new HttpException('Organization landing page already exists', 409);
    }

    nonProfitAppearanceNavigationDto.organizationId = organizationId;
    const missionPath: any = [];
    /** Create Path Url ForImage why Us */
    if (
      nonProfitAppearanceNavigationDto! &&
      nonProfitAppearanceNavigationDto.mission!
    ) {
      const dataMission = JSON.stringify(
        nonProfitAppearanceNavigationDto.mission!,
      );
      const mission = JSON.parse(dataMission);
      for (let i = 0; i < mission.length; i++) {
        const path = await this.bunnyService.generatePath(
          nonProfitAppearanceNavigationDto.organizationId!,
          'landingpage-mission',
          mission[i].fullName!,
          mission[i].imageExtension!,
          nonProfitAppearanceNavigationDto.organizationId!,
        );
        const base64Data = mission[i].base64Data;
        const binary = Buffer.from(mission[i]!.base64Data!, 'base64');
        if (!binary) {
          const trimmedString = 56;
          base64Data.length > 40
            ? base64Data.substring(0, 40 - 3) + '...'
            : base64Data.substring(0, length);
          throw new BadRequestException(
            `Image payload ${i} is not a valid base64 data: ${trimmedString}`,
          );
        }
        const imageUpload = await this.bunnyService.uploadImage(
          path,
          binary,
          nonProfitAppearanceNavigationDto.organizationId!,
        );

        if (imageUpload) {
          missionPath.push({
            mission: mission[i].mission!,
            iconMission: path,
          });
        }
      }
    }

    const whyUsPath: any = [];
    /** Create Path Url ForImage why Us */
    if (
      nonProfitAppearanceNavigationDto &&
      nonProfitAppearanceNavigationDto.whyUs!
    ) {
      const whyUsMission = JSON.stringify(
        nonProfitAppearanceNavigationDto.whyUs!,
      );
      const whyUs = JSON.parse(whyUsMission);
      for (let i = 0; i < whyUs.length; i++) {
        const path = await this.bunnyService.generatePath(
          nonProfitAppearanceNavigationDto.organizationId!,
          'landingpage-whyus',
          whyUs[i].fullName!,
          whyUs[i].imageExtension!,
          nonProfitAppearanceNavigationDto.organizationId!,
        );
        const base64Data = whyUs[i].base64Data;
        const binary = Buffer.from(whyUs[i]!.base64Data!, 'base64');
        if (!binary) {
          const trimmedString = 56;
          base64Data.length > 40
            ? base64Data.substring(0, 40 - 3) + '...'
            : base64Data.substring(0, length);
          throw new BadRequestException(
            `Image payload ${i} is not a valid base64 data: ${trimmedString}`,
          );
        }
        const imageUpload = await this.bunnyService.uploadImage(
          path,
          binary,
          nonProfitAppearanceNavigationDto.organizationId!,
        );
        if (imageUpload) {
          whyUsPath.push({
            whyUs: whyUs[i].whyUs!,
            whyUsIcon: path,
          });
          this.logger.info('WhyUs image has been created');
        }
      }
    }

    if (
      nonProfitAppearanceNavigationDto &&
      nonProfitAppearanceNavigationDto.photoThumbnailUl!
    ) {
      const thumbnail = nonProfitAppearanceNavigationDto.photoThumbnailUl[0];
      if (!!thumbnail) {
        const path = await this.bunnyService.generatePath(
          nonProfitAppearanceNavigationDto.organizationId!,
          'landingpage-thumbnail',
          thumbnail.fullName!,
          thumbnail.imageExtension!,
          nonProfitAppearanceNavigationDto.organizationId!,
        );
        const base64Data = thumbnail.base64Data!;
        const binary = Buffer.from(thumbnail.base64Data!, 'base64');
        if (!binary) {
          const trimmedString = 56;
          base64Data.length > 40
            ? base64Data.substring(0, 40 - 3) + '...'
            : base64Data.substring(0, length);
          throw new BadRequestException(
            `Image payload photo thumbnail is not a valid base64 data: ${trimmedString}`,
          );
        }
        const imageUpload = await this.bunnyService.uploadImage(
          path,
          binary,
          nonProfitAppearanceNavigationDto.organizationId!,
        );
        if (imageUpload) {
          this.logger.info('Thumbnail image has been created', path);
          nonProfitAppearanceNavigationDto.photoThumbnail = path;
        }
      }
    }

    if (
      nonProfitAppearanceNavigationDto &&
      nonProfitAppearanceNavigationDto.photoWhyUsUl!
    ) {
      const iconForMission = nonProfitAppearanceNavigationDto.photoWhyUsUl[0];
      if (!!iconForMission) {
        const path = await this.bunnyService.generatePath(
          nonProfitAppearanceNavigationDto.organizationId!,
          'landingpage-photoWhyUs',
          iconForMission.fullName!,
          iconForMission.imageExtension!,
          nonProfitAppearanceNavigationDto.organizationId!,
        );
        const base64Data = iconForMission.base64Data!;
        const binary = Buffer.from(iconForMission.base64Data!, 'base64');
        if (!binary) {
          const trimmedString = 56;
          base64Data.length > 40
            ? base64Data.substring(0, 40 - 3) + '...'
            : base64Data.substring(0, length);
          throw new BadRequestException(
            `Image payload photo thumbnail is not a valid base64 data: ${trimmedString}`,
          );
        }
        const imageUpload = await this.bunnyService.uploadImage(
          path,
          binary,
          nonProfitAppearanceNavigationDto.organizationId!,
        );

        if (imageUpload) {
          this.logger.info('Thumbnail image has been created', path);
          nonProfitAppearanceNavigationDto.photoWhyUs = path;
        }
      }
    }

    if (
      nonProfitAppearanceNavigationDto &&
      nonProfitAppearanceNavigationDto.photoOfActivityUl!
    ) {
      const photoOfActivity =
        nonProfitAppearanceNavigationDto.photoOfActivityUl[0];
      if (!!photoOfActivity) {
        const path = await this.bunnyService.generatePath(
          nonProfitAppearanceNavigationDto.organizationId!,
          'landingpage-photoOfActivity',
          photoOfActivity.fullName!,
          photoOfActivity.imageExtension!,
          nonProfitAppearanceNavigationDto.organizationId!,
        );
        const base64Data = photoOfActivity.base64Data!;
        const binary = Buffer.from(photoOfActivity.base64Data!, 'base64');
        if (!binary) {
          const trimmedString = 56;
          base64Data.length > 40
            ? base64Data.substring(0, 40 - 3) + '...'
            : base64Data.substring(0, length);
          throw new BadRequestException(
            `Image payload photo OfActivity is not a valid base64 data: ${trimmedString}`,
          );
        }
        const imageUpload = await this.bunnyService.uploadImage(
          path,
          binary,
          nonProfitAppearanceNavigationDto.organizationId!,
        );

        if (imageUpload) {
          this.logger.info('PhotoOfActivity image has been created', path);
          nonProfitAppearanceNavigationDto.photoOfActivity = path;
        }
      }
    }

    this.logger.debug('Create Landingpage Organization...');
    nonProfitAppearanceNavigationDto.organizationId = organizationId;
    nonProfitAppearanceNavigationDto.page = 'LANDINGPAGE';
    const now: Date = new Date();
    nonProfitAppearanceNavigationDto.whyUs = whyUsPath;
    nonProfitAppearanceNavigationDto.mission = missionPath;
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

    const aboutUsData = await this.appearanceNavigationModel.findOne({
      organizationId: organizationId,
      page: 'ABOUTUS',
    });

    if (aboutUsData) {
      throw new HttpException('Organization AboutUs page already exists', 409);
    }

    nonProfitAppearanceNavigationAboutUsDto.organizationId = organizationId;
    if (
      nonProfitAppearanceNavigationAboutUsDto &&
      nonProfitAppearanceNavigationAboutUsDto.photoThumbnailUl!
    ) {
      const photoThumbnail =
        nonProfitAppearanceNavigationAboutUsDto.photoThumbnailUl[0];
      if (!!photoThumbnail && photoThumbnail) {
        let path = '';
        try {
          path = await this.bunnyService.generatePath(
            nonProfitAppearanceNavigationAboutUsDto.organizationId!,
            'landingpage-photoThumbnail',
            photoThumbnail.fullName!,
            photoThumbnail.imageExtension!,
            nonProfitAppearanceNavigationAboutUsDto.organizationId!,
          );
        } catch (error) {
          this.logger.info('Have found same problem', error);
        }

        const base64Data = photoThumbnail.base64Data!;
        let binary;
        try {
          binary = Buffer.from(photoThumbnail.base64Data!, 'base64');
        } catch (error) {
          this.logger.info('Have found same problem', error);
        }
        if (!binary) {
          const trimmedString = 56;
          base64Data.length > 40
            ? base64Data.substring(0, 40 - 3) + '...'
            : base64Data.substring(0, length);
          throw new BadRequestException(
            `Image payload photo OfActivity is not a valid base64 data: ${trimmedString}`,
          );
        }

        let imageUpload;
        try {
          imageUpload = await this.bunnyService.uploadImage(
            path,
            binary,
            nonProfitAppearanceNavigationAboutUsDto.organizationId!,
          );
        } catch (error) {
          this.logger.info('Have found same problem', error);
        }

        if (imageUpload) {
          this.logger.info('photoThumbnail image has been created', path);
          nonProfitAppearanceNavigationAboutUsDto.photoThumbnail = path;
        }
      }
    }

    if (
      nonProfitAppearanceNavigationAboutUsDto &&
      nonProfitAppearanceNavigationAboutUsDto.iconForValuesUl!
    ) {
      const iconForValues =
        nonProfitAppearanceNavigationAboutUsDto.iconForValuesUl[0];
      if (!!iconForValues && iconForValues) {
        let path = '';
        try {
          path = await this.bunnyService.generatePath(
            nonProfitAppearanceNavigationAboutUsDto.organizationId!,
            'landingpage-iconForValues',
            iconForValues.fullName!,
            iconForValues.imageExtension!,
            nonProfitAppearanceNavigationAboutUsDto.organizationId!,
          );
        } catch (error) {
          this.logger.info('Have found same problem', error);
        }

        const base64Data = iconForValues.base64Data!;
        let binary;

        try {
          binary = Buffer.from(iconForValues.base64Data!, 'base64');
        } catch (error) {
          this.logger.info('Have found same problem', error);
        }

        if (!binary) {
          const trimmedString = 56;
          base64Data.length > 40
            ? base64Data.substring(0, 40 - 3) + '...'
            : base64Data.substring(0, length);
          throw new BadRequestException(
            `Image payload photo OfActivity is not a valid base64 data: ${trimmedString}`,
          );
        }
        let imageUpload;
        try {
          imageUpload = await this.bunnyService.uploadImage(
            path,
            binary,
            nonProfitAppearanceNavigationAboutUsDto.organizationId!,
          );
        } catch (error) {
          this.logger.info('Have found same problem', error);
        }
        if (imageUpload) {
          this.logger.info('iconForValues image has been created', path);
          nonProfitAppearanceNavigationAboutUsDto.iconForValues = path;
        }
      }
    }

    const companyPath: any = [];
    /** Create Path Url ForImage company */
    if (
      nonProfitAppearanceNavigationAboutUsDto! &&
      nonProfitAppearanceNavigationAboutUsDto.companyValues!
    ) {
      const dataCompany = JSON.stringify(
        nonProfitAppearanceNavigationAboutUsDto.companyValues!,
      );
      const company = JSON.parse(dataCompany);
      for (let i = 0; i < company.length; i++) {
        const path = await this.bunnyService.generatePath(
          nonProfitAppearanceNavigationAboutUsDto.organizationId!,
          'aboutus-company',
          company[i].fullName!,
          company[i].imageExtension!,
          nonProfitAppearanceNavigationAboutUsDto.organizationId!,
        );
        const base64Data = company[i].base64Data;
        const binary = Buffer.from(company[i]!.base64Data!, 'base64');
        if (!binary) {
          const trimmedString = 56;
          base64Data.length > 40
            ? base64Data.substring(0, 40 - 3) + '...'
            : base64Data.substring(0, length);
          throw new BadRequestException(
            `Image payload ${i} is not a valid base64 data: ${trimmedString}`,
          );
        }
        const imageUpload = await this.bunnyService.uploadImage(
          path,
          binary,
          nonProfitAppearanceNavigationAboutUsDto.organizationId!,
        );

        if (imageUpload) {
          this.logger.info('company image has been created');
          companyPath.push({
            companyValues: company[i].companyValues!,
            iconCompanyValues: path,
          });
        }
      }
    }

    const featuresPath: any = [];
    /** Create Path Url ForImage mission */
    if (
      nonProfitAppearanceNavigationAboutUsDto! &&
      nonProfitAppearanceNavigationAboutUsDto.featuresItem!
    ) {
      const dataFeatures = JSON.stringify(
        nonProfitAppearanceNavigationAboutUsDto.featuresItem!,
      );
      const features = JSON.parse(dataFeatures);
      for (let i = 0; i < features.length; i++) {
        const path = await this.bunnyService.generatePath(
          nonProfitAppearanceNavigationAboutUsDto.organizationId!,
          'landingpage-aboutus',
          features[i].fullName!,
          features[i].imageExtension!,
          nonProfitAppearanceNavigationAboutUsDto.organizationId!,
        );
        const base64Data = features[i].base64Data;
        const binary = Buffer.from(features[i]!.base64Data!, 'base64');
        if (!binary) {
          const trimmedString = 56;
          base64Data.length > 40
            ? base64Data.substring(0, 40 - 3) + '...'
            : base64Data.substring(0, length);
          throw new BadRequestException(
            `Image features ${i} is not a valid base64 data: ${trimmedString}`,
          );
        }
        const imageUpload = await this.bunnyService.uploadImage(
          path,
          binary,
          nonProfitAppearanceNavigationAboutUsDto.organizationId!,
        );

        if (imageUpload) {
          this.logger.info('Features Item image has been upload');
          featuresPath.push({
            featuresItemTitle: features[i].featuresItemTitle!,
            featuresItemDesc: features[i].featuresItemDesc!,
            iconFeaturesItem: path,
          });
        }
      }
    }

    this.logger.debug('Create AboutUs Organization...');
    nonProfitAppearanceNavigationAboutUsDto.organizationId = organizationId;
    nonProfitAppearanceNavigationAboutUsDto.page = 'ABOUTUS';
    const now: Date = new Date();
    nonProfitAppearanceNavigationAboutUsDto.createdAt = now.toISOString();
    nonProfitAppearanceNavigationAboutUsDto.updatedAt = now.toISOString();
    nonProfitAppearanceNavigationAboutUsDto.companyValues = companyPath;
    nonProfitAppearanceNavigationAboutUsDto.featuresItem = featuresPath;

    let appearanceCreateAboutUs;
    try {
      appearanceCreateAboutUs = await this.appearanceNavigationModel.create(
        nonProfitAppearanceNavigationAboutUsDto,
      );
    } catch (error) {
      this.logger.info('Have found same problem', error);
    }

    return {
      statusCode: 200,
      appearanceaboutus: appearanceCreateAboutUs,
    };
  }

  async createBlog(
    organizationId: string,
    nonProfitAppearanceNavBlogDto: NonProfitAppearanceNavigationBlogDto,
  ) {
    this.logger.debug(`Get Organization ${organizationId}...`);
    const getOrgsId = await this.getOrganization(organizationId);
    if (getOrgsId.statusCode === 404) {
      return {
        statusCode: 404,
        message: 'Organization not found',
      };
    }

    const blogData = await this.appearanceNavigationModel.findOne({
      organizationId: organizationId,
      page: 'BLOG',
    });

    if (blogData) {
      throw new HttpException('Organization Blog page already exists', 409);
    }

    const newsPath: any = [];
    /** Create Path Url ForImage news */
    if (nonProfitAppearanceNavBlogDto && nonProfitAppearanceNavBlogDto.news!) {
      const newsData = JSON.stringify(nonProfitAppearanceNavBlogDto.news);
      const news = JSON.parse(newsData);
      for (let i = 0; i < news.length; i++) {
        const path = await this.bunnyService.generatePath(
          nonProfitAppearanceNavBlogDto.organizationId!,
          'landingpage-whyus',
          news[i].fullName!,
          news[i].imageExtension!,
          nonProfitAppearanceNavBlogDto.organizationId!,
        );
        const base64Data = news[i].base64Data;
        const binary = Buffer.from(news[i]!.base64Data!, 'base64');
        if (!binary) {
          const trimmedString = 56;
          base64Data.length > 40
            ? base64Data.substring(0, 40 - 3) + '...'
            : base64Data.substring(0, length);
          throw new BadRequestException(
            `Image payload ${i} is not a valid base64 data: ${trimmedString}`,
          );
        }
        const imageUpload = await this.bunnyService.uploadImage(
          path,
          binary,
          nonProfitAppearanceNavBlogDto.organizationId!,
        );
        newsPath.push({
          news: news[i].news!,
          photo: path,
          description: news[i].description!,
          date: news[i].date!,
        });
        if (imageUpload) {
          if (news[i].newsIcon!) {
            this.logger.info(
              'Old news image seems to be exist in the old record',
            );
            const isExist = await this.bunnyService.checkIfImageExists(
              news[i].newsIcon!,
            );
            if (isExist) {
              await this.bunnyService.deleteMedia(news[i].newsIcon!, false);
            }
          }
          this.logger.info('news image has been replaced');
        }
      }
    }

    if (
      nonProfitAppearanceNavBlogDto &&
      nonProfitAppearanceNavBlogDto.photoThumbnailUl!
    ) {
      const photoThumbnail = nonProfitAppearanceNavBlogDto.photoThumbnailUl[0];
      if (!!photoThumbnail && photoThumbnail) {
        const path = await this.bunnyService.generatePath(
          nonProfitAppearanceNavBlogDto.organizationId!,
          'landingpage-photoThumbnail',
          photoThumbnail.fullName!,
          photoThumbnail.imageExtension!,
          nonProfitAppearanceNavBlogDto.organizationId!,
        );
        const base64Data = photoThumbnail.base64Data!;
        const binary = Buffer.from(photoThumbnail.base64Data!, 'base64');
        if (!binary) {
          const trimmedString = 56;
          base64Data.length > 40
            ? base64Data.substring(0, 40 - 3) + '...'
            : base64Data.substring(0, length);
          throw new BadRequestException(
            `Image payload photo OfActivity is not a valid base64 data: ${trimmedString}`,
          );
        }
        const imageUpload = await this.bunnyService.uploadImage(
          path,
          binary,
          nonProfitAppearanceNavBlogDto.organizationId!,
        );

        if (imageUpload) {
          if (nonProfitAppearanceNavBlogDto.photoThumbnail!) {
            this.logger.info(
              'Old photoThumbnail image seems to be exist in the old record',
            );
            const isExist = await this.bunnyService.checkIfImageExists(
              nonProfitAppearanceNavBlogDto.photoThumbnail!,
            );
            if (isExist) {
              await this.bunnyService.deleteMedia(
                nonProfitAppearanceNavBlogDto.photoThumbnail!,
                false,
              );
            }
          }
          this.logger.info('photoThumbnail image has been replaced', path);
          nonProfitAppearanceNavBlogDto.photoThumbnail = path;
        }
      }
    }

    this.logger.debug('Create createBlog Organization...');
    nonProfitAppearanceNavBlogDto.organizationId = organizationId;
    nonProfitAppearanceNavBlogDto.news = newsPath;
    nonProfitAppearanceNavBlogDto.page = 'BLOG';
    const now: Date = new Date();
    nonProfitAppearanceNavBlogDto.createdAt = now.toISOString();
    nonProfitAppearanceNavBlogDto.updatedAt = now.toISOString();
    const appearanceCreateBlog = await this.appearanceNavigationModel.create(
      nonProfitAppearanceNavBlogDto,
    );
    return {
      statusCode: 200,
      appearanceblog: appearanceCreateBlog,
    };
  }
  async editLandingPage(
    organizationId: string,
    editNonProfitAppearanceNavigationDto: EditNonProfApperNavDto,
  ): Promise<AppearanceNavigation> {
    // ) {
    this.logger.debug(`Get Organization ${organizationId}...`);
    const getOrgsId = await this.getOrganization(organizationId);
    if (!getOrgsId) {
      throw new NotFoundException(`OrganizationId ${organizationId} not found`);
    }
    editNonProfitAppearanceNavigationDto.organizationId = organizationId;

    const missionPath: any = [];
    /** Create Path Url ForImage mission */
    if (
      editNonProfitAppearanceNavigationDto! &&
      editNonProfitAppearanceNavigationDto.mission!
    ) {
      const dataMission = JSON.stringify(
        editNonProfitAppearanceNavigationDto.mission!,
      );
      const mission = JSON.parse(dataMission);
      for (let i = 0; i < mission.length; i++) {
        const base64Data = mission[i].base64Data;

        if (base64Data) {
          const path = await this.bunnyService.generatePath(
            editNonProfitAppearanceNavigationDto.organizationId!,
            'landingpage-mission',
            mission[i].fullName!,
            mission[i].imageExtension!,
            editNonProfitAppearanceNavigationDto.organizationId!,
          );
          const binary = Buffer.from(mission[i]!.base64Data!, 'base64');
          if (!binary) {
            const trimmedString = 56;
            base64Data.length > 40
              ? base64Data.substring(0, 40 - 3) + '...'
              : base64Data.substring(0, length);
            throw new BadRequestException(
              `Image payload ${i} is not a valid base64 data: ${trimmedString}`,
            );
          }
          const imageUpload = await this.bunnyService.uploadImage(
            path,
            binary,
            editNonProfitAppearanceNavigationDto.organizationId!,
          );

          if (imageUpload) {
            if (mission[i].iconMission!) {
              this.logger.info(
                'Old Mission image seems to be exist in the old record',
              );
              const isExist = await this.bunnyService.checkIfImageExists(
                mission[i].iconMission!,
              );
              if (isExist) {
                await this.bunnyService.deleteMedia(
                  mission[i].iconMission!,
                  false,
                );
              }
            }
            this.logger.info('Mission image has been replaced');
            missionPath.push({
              mission: mission[i].mission!,
              iconMission: path,
            });
          }
        } else {
          missionPath.push({
            mission: mission[i].mission!,
            iconMission: mission[i].iconMission!,
          });
        }
      }
    }

    const whyUsPath: any = [];
    /** Create Path Url ForImage why Us */
    if (
      editNonProfitAppearanceNavigationDto &&
      editNonProfitAppearanceNavigationDto.whyUs!
    ) {
      const whyUsMission = JSON.stringify(
        editNonProfitAppearanceNavigationDto.whyUs!,
      );
      const whyUs = JSON.parse(whyUsMission);
      for (let i = 0; i < whyUs.length; i++) {
        const base64Data = whyUs[i].base64Data;

        if (base64Data) {
          const path = await this.bunnyService.generatePath(
            editNonProfitAppearanceNavigationDto.organizationId!,
            'landingpage-whyus',
            whyUs[i].fullName!,
            whyUs[i].imageExtension!,
            editNonProfitAppearanceNavigationDto.organizationId!,
          );
          const binary = Buffer.from(whyUs[i]!.base64Data!, 'base64');
          if (!binary) {
            const trimmedString = 56;
            base64Data.length > 40
              ? base64Data.substring(0, 40 - 3) + '...'
              : base64Data.substring(0, length);
            throw new BadRequestException(
              `Image payload ${i} is not a valid base64 data: ${trimmedString}`,
            );
          }
          const imageUpload = await this.bunnyService.uploadImage(
            path,
            binary,
            editNonProfitAppearanceNavigationDto.organizationId!,
          );
          whyUsPath.push({
            whyUs: whyUs[i].whyUs!,
            whyUsIcon: path,
          });
          if (imageUpload) {
            if (whyUs[i].whyUsIcon!) {
              this.logger.info(
                'Old WhyUs image seems to be exist in the old record',
              );
              const isExist = await this.bunnyService.checkIfImageExists(
                whyUs[i].whyUsIcon!,
              );
              if (isExist) {
                await this.bunnyService.deleteMedia(whyUs[i].whyUsIcon!, false);
              }
            }
            this.logger.info('WhyUs image has been replaced');
          }
        } else {
          whyUsPath.push({
            whyUs: whyUs[i].whyUs!,
            whyUsIcon: whyUs[i].whyUsIcon!,
          });
        }
      }
    }

    if (
      editNonProfitAppearanceNavigationDto &&
      editNonProfitAppearanceNavigationDto.photoThumbnailUl!
    ) {
      const thumbnail =
        editNonProfitAppearanceNavigationDto.photoThumbnailUl[0];
      if (!!thumbnail) {
        const path = await this.bunnyService.generatePath(
          editNonProfitAppearanceNavigationDto.organizationId!,
          'landingpage-thumbnail',
          thumbnail.fullName!,
          thumbnail.imageExtension!,
          editNonProfitAppearanceNavigationDto.organizationId!,
        );
        const base64Data = thumbnail.base64Data!;
        const binary = Buffer.from(thumbnail.base64Data!, 'base64');
        if (!binary) {
          const trimmedString = 56;
          base64Data.length > 40
            ? base64Data.substring(0, 40 - 3) + '...'
            : base64Data.substring(0, length);
          throw new BadRequestException(
            `Image payload photo thumbnail is not a valid base64 data: ${trimmedString}`,
          );
        }
        const imageUpload = await this.bunnyService.uploadImage(
          path,
          binary,
          editNonProfitAppearanceNavigationDto.organizationId!,
        );
        if (imageUpload) {
          if (editNonProfitAppearanceNavigationDto.photoThumbnail!) {
            this.logger.info(
              'Old Thumbnail image seems to be exist in the old record',
            );
            const isExist = await this.bunnyService.checkIfImageExists(
              editNonProfitAppearanceNavigationDto.photoThumbnail!,
            );
            if (isExist) {
              await this.bunnyService.deleteMedia(
                editNonProfitAppearanceNavigationDto.photoThumbnail!,
                false,
              );
            }
          }
          this.logger.info('Thumbnail image has been replaced', path);
          editNonProfitAppearanceNavigationDto.photoThumbnail = path;
        }
      }
    }

    if (
      editNonProfitAppearanceNavigationDto &&
      editNonProfitAppearanceNavigationDto.photoWhyUsUl! //iconForMissionUl!
    ) {
      const photoWhyUs = editNonProfitAppearanceNavigationDto.photoWhyUsUl[0];
      if (!!photoWhyUs) {
        const path = await this.bunnyService.generatePath(
          editNonProfitAppearanceNavigationDto.organizationId!,
          'landingpage-photoWhyUs',
          photoWhyUs.fullName!,
          photoWhyUs.imageExtension!,
          editNonProfitAppearanceNavigationDto.organizationId!,
        );
        const base64Data = photoWhyUs.base64Data!;
        const binary = Buffer.from(photoWhyUs.base64Data!, 'base64');
        if (!binary) {
          const trimmedString = 56;
          base64Data.length > 40
            ? base64Data.substring(0, 40 - 3) + '...'
            : base64Data.substring(0, length);
          throw new BadRequestException(
            `Image payload photo why us is not a valid base64 data: ${trimmedString}`,
          );
        }
        const imageUpload = await this.bunnyService.uploadImage(
          path,
          binary,
          editNonProfitAppearanceNavigationDto.organizationId!,
        );

        if (imageUpload) {
          if (editNonProfitAppearanceNavigationDto.photoWhyUs!) {
            this.logger.info(
              'Old why us image seems to be exist in the old record',
            );
            const isExist = await this.bunnyService.checkIfImageExists(
              editNonProfitAppearanceNavigationDto.photoWhyUs!,
            );
            if (isExist) {
              await this.bunnyService.deleteMedia(
                editNonProfitAppearanceNavigationDto.photoWhyUs!,
                false,
              );
            }
          }
          this.logger.info('Why Us image has been replaced', path);
          editNonProfitAppearanceNavigationDto.photoWhyUs = path;
        }
      }
    }

    if (
      editNonProfitAppearanceNavigationDto &&
      editNonProfitAppearanceNavigationDto.photoOfActivityUl!
    ) {
      const photoOfActivity =
        editNonProfitAppearanceNavigationDto.photoOfActivityUl[0];
      if (!!photoOfActivity) {
        const path = await this.bunnyService.generatePath(
          editNonProfitAppearanceNavigationDto.organizationId!,
          'landingpage-photoOfActivity',
          photoOfActivity.fullName!,
          photoOfActivity.imageExtension!,
          editNonProfitAppearanceNavigationDto.organizationId!,
        );
        const base64Data = photoOfActivity.base64Data!;
        const binary = Buffer.from(photoOfActivity.base64Data!, 'base64');
        if (!binary) {
          const trimmedString = 56;
          base64Data.length > 40
            ? base64Data.substring(0, 40 - 3) + '...'
            : base64Data.substring(0, length);
          throw new BadRequestException(
            `Image payload photo OfActivity is not a valid base64 data: ${trimmedString}`,
          );
        }
        const imageUpload = await this.bunnyService.uploadImage(
          path,
          binary,
          editNonProfitAppearanceNavigationDto.organizationId!,
        );

        if (imageUpload) {
          if (editNonProfitAppearanceNavigationDto.photoOfActivity!) {
            this.logger.info(
              'Old photoOfActivity image seems to be exist in the old record',
            );
            const isExist = await this.bunnyService.checkIfImageExists(
              editNonProfitAppearanceNavigationDto.photoOfActivity!,
            );
            if (isExist) {
              await this.bunnyService.deleteMedia(
                editNonProfitAppearanceNavigationDto.photoOfActivity!,
                false,
              );
            }
          }
          this.logger.info('PhotoOfActivity image has been replaced', path);
          editNonProfitAppearanceNavigationDto.photoOfActivity = path;
        }
      }
    }

    const now: Date = new Date();
    editNonProfitAppearanceNavigationDto.organizationId = organizationId;
    editNonProfitAppearanceNavigationDto.updatedAt = now.toISOString();
    editNonProfitAppearanceNavigationDto.mission = missionPath;
    editNonProfitAppearanceNavigationDto.whyUs = whyUsPath;

    this.logger.debug('Edit Landingpage Organization...');

    const landingPageUpdated =
      await this.appearanceNavigationModel.findOneAndUpdate(
        { organizationId: organizationId, page: 'LANDINGPAGE' },
        editNonProfitAppearanceNavigationDto,
        { new: true },
      );

    if (!landingPageUpdated) {
      const appearanceCreateLandingPage =
        await this.appearanceNavigationModel.create({
          ...editNonProfitAppearanceNavigationDto,
          page: 'LANDINGPAGE',
        });

      return appearanceCreateLandingPage;
    } else {
      return landingPageUpdated;
    }
  }

  async editAboutUs(
    organizationId: string,
    editNonProfApprceNaviAboutUsDto: EditNonProfApperNavAboutUsDto,
  ): Promise<AppearanceNavigation> {
    this.logger.debug(`Get Organization ${organizationId}...`);
    const getOrgsId = await this.getOrganization(organizationId);
    if (getOrgsId.statusCode === 404) {
      throw new NotFoundException(`OrganizationId ${organizationId} not found`);
    }

    editNonProfApprceNaviAboutUsDto.organizationId = organizationId;
    if (
      editNonProfApprceNaviAboutUsDto &&
      editNonProfApprceNaviAboutUsDto.photoThumbnailUl!
    ) {
      const photoThumbnail =
        editNonProfApprceNaviAboutUsDto.photoThumbnailUl[0];
      if (!!photoThumbnail && photoThumbnail) {
        const path = await this.bunnyService.generatePath(
          editNonProfApprceNaviAboutUsDto.organizationId!,
          'aboutus-photoThumbnail',
          photoThumbnail.fullName!,
          photoThumbnail.imageExtension!,
          editNonProfApprceNaviAboutUsDto.organizationId!,
        );
        const base64Data = photoThumbnail.base64Data!;
        const binary = Buffer.from(photoThumbnail.base64Data!, 'base64');
        if (!binary) {
          const trimmedString = 56;
          base64Data.length > 40
            ? base64Data.substring(0, 40 - 3) + '...'
            : base64Data.substring(0, length);
          throw new BadRequestException(
            `Image payload photo OfActivity is not a valid base64 data: ${trimmedString}`,
          );
        }
        const imageUpload = await this.bunnyService.uploadImage(
          path,
          binary,
          editNonProfApprceNaviAboutUsDto.organizationId!,
        );

        if (imageUpload) {
          if (editNonProfApprceNaviAboutUsDto.photoThumbnail!) {
            this.logger.info(
              'Old photoThumbnail image seems to be exist in the old record',
            );
            const isExist = await this.bunnyService.checkIfImageExists(
              editNonProfApprceNaviAboutUsDto.photoThumbnail!,
            );
            if (isExist) {
              await this.bunnyService.deleteMedia(
                editNonProfApprceNaviAboutUsDto.photoThumbnail!,
                false,
              );
            }
          }
          this.logger.info('photoThumbnail image has been replaced', path);
          editNonProfApprceNaviAboutUsDto.photoThumbnail = path;
        }
      }
    }

    if (
      editNonProfApprceNaviAboutUsDto &&
      editNonProfApprceNaviAboutUsDto.iconForValuesUl!
    ) {
      const iconForValues = editNonProfApprceNaviAboutUsDto.iconForValuesUl[0];
      if (!!iconForValues && iconForValues) {
        const path = await this.bunnyService.generatePath(
          editNonProfApprceNaviAboutUsDto.organizationId!,
          'landingpage-iconForValues',
          iconForValues.fullName!,
          iconForValues.imageExtension!,
          editNonProfApprceNaviAboutUsDto.organizationId!,
        );
        const base64Data = iconForValues.base64Data!;
        const binary = Buffer.from(iconForValues.base64Data!, 'base64');
        if (!binary) {
          const trimmedString = 56;
          base64Data.length > 40
            ? base64Data.substring(0, 40 - 3) + '...'
            : base64Data.substring(0, length);
          throw new BadRequestException(
            `Image payload photo OfActivity is not a valid base64 data: ${trimmedString}`,
          );
        }
        const imageUpload = await this.bunnyService.uploadImage(
          path,
          binary,
          editNonProfApprceNaviAboutUsDto.organizationId!,
        );

        if (imageUpload) {
          if (editNonProfApprceNaviAboutUsDto.iconForValues!) {
            this.logger.info(
              'Old iconForValues image seems to be exist in the old record',
            );
            const isExist = await this.bunnyService.checkIfImageExists(
              editNonProfApprceNaviAboutUsDto.iconForValues!,
            );
            if (isExist) {
              await this.bunnyService.deleteMedia(
                editNonProfApprceNaviAboutUsDto.iconForValues!,
                false,
              );
            }
          }
          this.logger.info('iconForValues image has been replaced', path);
          editNonProfApprceNaviAboutUsDto.iconForValues = path;
        }
      }
    }

    const companyPath: any = [];
    /** Create Path Url ForImage company */
    if (
      editNonProfApprceNaviAboutUsDto! &&
      editNonProfApprceNaviAboutUsDto.companyValues!
    ) {
      const dataCompany = JSON.stringify(
        editNonProfApprceNaviAboutUsDto.companyValues!,
      );

      const company = JSON.parse(dataCompany);

      for (let i = 0; i < company.length; i++) {
        const base64Data = company[i].base64Data;

        if (base64Data) {
          const path = await this.bunnyService.generatePath(
            editNonProfApprceNaviAboutUsDto.organizationId,
            'aboutus-company',
            company[i].fullName!,
            company[i].imageExtension!,
            editNonProfApprceNaviAboutUsDto.organizationId!,
          );
          const binary = Buffer.from(company[i]!.base64Data!, 'base64');
          if (!binary) {
            const trimmedString = 56;
            base64Data.length > 40
              ? base64Data.substring(0, 40 - 3) + '...'
              : base64Data.substring(0, length);
            throw new BadRequestException(
              `Image payload ${i} is not a valid base64 data: ${trimmedString}`,
            );
          }
          const imageUpload = await this.bunnyService.uploadImage(
            path,
            binary,
            editNonProfApprceNaviAboutUsDto.organizationId,
          );

          if (imageUpload) {
            this.logger.info('company image has been created');
            companyPath.push({
              companyValues: company[i].companyValues!,
              iconCompanyValues: path,
            });
          }
        } else {
          companyPath.push({
            companyValues: company[i].companyValues!,
            iconCompanyValues: company[i].iconCompanyValues!,
          });
        }
      }
    }

    const featuresPath: any = [];
    /** Create Path Url ForImage mission */
    if (
      editNonProfApprceNaviAboutUsDto! &&
      editNonProfApprceNaviAboutUsDto.featuresItem!
    ) {
      const dataFeatures = JSON.stringify(
        editNonProfApprceNaviAboutUsDto.featuresItem!,
      );
      const features = JSON.parse(dataFeatures);
      for (let i = 0; i < features.length; i++) {
        const base64Data = features[i].base64Data;

        if (base64Data) {
          const path = await this.bunnyService.generatePath(
            editNonProfApprceNaviAboutUsDto.organizationId!,
            'landingpage-aboutus',
            features[i].fullName!,
            features[i].imageExtension!,
            editNonProfApprceNaviAboutUsDto.organizationId!,
          );
          const binary = Buffer.from(features[i]!.base64Data!, 'base64');
          if (!binary) {
            const trimmedString = 56;
            base64Data.length > 40
              ? base64Data.substring(0, 40 - 3) + '...'
              : base64Data.substring(0, length);
            throw new BadRequestException(
              `Image features ${i} is not a valid base64 data: ${trimmedString}`,
            );
          }
          const imageUpload = await this.bunnyService.uploadImage(
            path,
            binary,
            editNonProfApprceNaviAboutUsDto.organizationId!,
          );

          if (imageUpload) {
            if (features[i].iconFeaturesItem!) {
              this.logger.info(
                'Old Features image seems to be exist in the old record',
              );
              const isExist = await this.bunnyService.checkIfImageExists(
                features[i].iconFeaturesItem!,
              );
              if (isExist) {
                await this.bunnyService.deleteMedia(
                  features[i].iconFeaturesItem!,
                  false,
                );
              }
            }
            this.logger.info('Features Item image has been replaced');
            featuresPath.push({
              featuresItemTitle: features[i].featuresItemTitle!,
              featuresItemDesc: features[i].featuresItemDesc!,
              iconFeaturesItem: path,
            });
          }
        } else {
          featuresPath.push({
            featuresItemTitle: features[i].featuresItemTitle!,
            featuresItemDesc: features[i].featuresItemDesc!,
            iconFeaturesItem: features[i].iconFeaturesItem!,
          });
        }
      }
    }

    this.logger.debug('Edit AboutUs Organization...');
    const now: Date = new Date();
    editNonProfApprceNaviAboutUsDto.updatedAt = now.toISOString();
    editNonProfApprceNaviAboutUsDto.companyValues = companyPath;
    editNonProfApprceNaviAboutUsDto.featuresItem = featuresPath;

    const aboutUsPageUpdated =
      await this.appearanceNavigationModel.findOneAndUpdate(
        { organizationId: organizationId, page: 'ABOUTUS' },
        editNonProfApprceNaviAboutUsDto,
        { new: true },
      );

    if (!aboutUsPageUpdated) {
      const appearanceCreateAboutUs =
        await this.appearanceNavigationModel.create({
          ...editNonProfApprceNaviAboutUsDto,
          page: 'ABOUTUS',
        });

      return appearanceCreateAboutUs;
    } else {
      return aboutUsPageUpdated;
    }
  }

  async editBlog(
    organizationId: string,
    editNonProfitAppearanceNavBlogDto: EditNonProfitAppearanceNavigationBlogDto,
  ): Promise<AppearanceNavigation> {
    this.logger.debug(`Get Organization ${organizationId}...`);
    const getOrgsId = await this.getOrganization(organizationId);
    if (getOrgsId.statusCode === 404) {
      throw new NotFoundException(`OrganizationId ${organizationId} not found`);
    }

    const newsPath: any = [];
    /** Create Path Url ForImage news */
    if (
      editNonProfitAppearanceNavBlogDto &&
      editNonProfitAppearanceNavBlogDto.news!
    ) {
      const newsData = JSON.stringify(editNonProfitAppearanceNavBlogDto.news);
      const news = JSON.parse(newsData);
      for (let i = 0; i < news.length; i++) {
        const base64Data = news[i].base64Data;

        if (base64Data) {
          const path = await this.bunnyService.generatePath(
            editNonProfitAppearanceNavBlogDto.organizationId!,
            'landingpage-whyus',
            news[i].fullName!,
            news[i].imageExtension!,
            editNonProfitAppearanceNavBlogDto.organizationId!,
          );
          const binary = Buffer.from(news[i]!.base64Data!, 'base64');
          if (!binary) {
            const trimmedString = 56;
            base64Data.length > 40
              ? base64Data.substring(0, 40 - 3) + '...'
              : base64Data.substring(0, length);
            throw new BadRequestException(
              `Image payload ${i} is not a valid base64 data: ${trimmedString}`,
            );
          }
          const imageUpload = await this.bunnyService.uploadImage(
            path,
            binary,
            editNonProfitAppearanceNavBlogDto.organizationId!,
          );
          newsPath.push({
            news: news[i].news!,
            photo: path,
            description: news[i].description!,
            date: news[i].date!,
          });
          if (imageUpload) {
            if (news[i].newsIcon!) {
              this.logger.info(
                'Old news image seems to be exist in the old record',
              );
              const isExist = await this.bunnyService.checkIfImageExists(
                news[i].newsIcon!,
              );
              if (isExist) {
                await this.bunnyService.deleteMedia(news[i].newsIcon!, false);
              }
            }
            this.logger.info('news image has been replaced');
          }
        } else {
          newsPath.push({
            news: news[i].news!,
            photo: news[i].photo!,
            description: news[i].description!,
            date: news[i].date!,
          });
        }
      }
    }

    if (
      editNonProfitAppearanceNavBlogDto &&
      editNonProfitAppearanceNavBlogDto.photoThumbnailUl!
    ) {
      const photoThumbnail =
        editNonProfitAppearanceNavBlogDto.photoThumbnailUl[0];
      if (!!photoThumbnail && photoThumbnail) {
        const path = await this.bunnyService.generatePath(
          editNonProfitAppearanceNavBlogDto.organizationId!,
          'landingpage-photoThumbnail',
          photoThumbnail.fullName!,
          photoThumbnail.imageExtension!,
          editNonProfitAppearanceNavBlogDto.organizationId!,
        );
        const base64Data = photoThumbnail.base64Data!;
        const binary = Buffer.from(photoThumbnail.base64Data!, 'base64');
        if (!binary) {
          const trimmedString = 56;
          base64Data.length > 40
            ? base64Data.substring(0, 40 - 3) + '...'
            : base64Data.substring(0, length);
          throw new BadRequestException(
            `Image payload photo OfActivity is not a valid base64 data: ${trimmedString}`,
          );
        }
        const imageUpload = await this.bunnyService.uploadImage(
          path,
          binary,
          editNonProfitAppearanceNavBlogDto.organizationId!,
        );

        if (imageUpload) {
          if (editNonProfitAppearanceNavBlogDto.photoThumbnail!) {
            this.logger.info(
              'Old photoThumbnail image seems to be exist in the old record',
            );
            const isExist = await this.bunnyService.checkIfImageExists(
              editNonProfitAppearanceNavBlogDto.photoThumbnail!,
            );
            if (isExist) {
              await this.bunnyService.deleteMedia(
                editNonProfitAppearanceNavBlogDto.photoThumbnail!,
                false,
              );
            }
          }
          this.logger.info('photoThumbnail image has been replaced', path);
          editNonProfitAppearanceNavBlogDto.photoThumbnail = path;
        }
      }
    }

    this.logger.debug('Edit AboutUs Organization...');
    const now: Date = new Date();
    editNonProfitAppearanceNavBlogDto.updatedAt = now.toISOString();
    editNonProfitAppearanceNavBlogDto.news = newsPath;

    const blogUpdated = await this.appearanceNavigationModel.findOneAndUpdate(
      { organizationId: organizationId, page: 'BLOG' },
      editNonProfitAppearanceNavBlogDto,
      { new: true },
    );

    if (!blogUpdated) {
      const appearanceCreateBlog = await this.appearanceNavigationModel.create({
        ...editNonProfitAppearanceNavBlogDto,
        organizationId: organizationId,
        page: 'BLOG',
      });

      return appearanceCreateBlog;
    } else {
      return blogUpdated;
    }
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

    const contactData = await this.appearancePageModel.findOne({
      organizationId: organizationId,
    });

    if (contactData) {
      throw new HttpException(
        'Organization Contact Us page already exists',
        409,
      );
    }

    nonProfitAppearancePageDto.organizationId = organizationId;
    const now: Date = new Date();
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
    const now: Date = new Date();

    try {
      this.logger.debug(`Get Organization ${organizationId}...`);
      const getOrgsId = await this.getOrganization(organizationId);

      if (getOrgsId.statusCode === 404) {
        return {
          statusCode: 404,
          message: 'Organization not found',
        };
      }

      this.logger.debug('Edit ContactUs Organization...');
      editNonProfitAppearancePageDto.updatedAt = now.toISOString();

      const appearanceEditContactUs =
        await this.appearancePageModel.findOneAndUpdate(
          { organizationId },
          editNonProfitAppearancePageDto,
          { new: true },
        );

      if (!appearanceEditContactUs) {
        const appearanceCreateContactUs = await this.appearancePageModel.create(
          {
            ...editNonProfitAppearancePageDto,
          },
        );

        const updateOrganization =
          await this.organizationModel.findOneAndUpdate(
            { _id: getOrgsId.organization?._id },
            {
              contactEmail: editNonProfitAppearancePageDto.contactUsCsEmail,
              longitude: editNonProfitAppearancePageDto.longitude,
              latitude: editNonProfitAppearancePageDto.latitude,
            },
            { new: true },
          );

        if (!updateOrganization) {
          throw new HttpException(
            'Error when update organization',
            HttpStatus.NOT_IMPLEMENTED,
          );
        }

        return {
          statusCode: 200,
          appearancecontactus: appearanceCreateContactUs,
        };
      } else {
        return {
          statusCode: 200,
          appearancecontactus: appearanceEditContactUs,
        };
      }
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
    return await this.appearancePageModel.findOne({
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
      donorId: donorId,
      currency: filter.currency ? filter.currency : 'GBP',
      organizationId: organizationId,
    };

    const totalZakatCampaigns = await this.donationLogsModel
      .find({
        //campaignId: new Types.ObjectId(filterCampaigns.campaignId),
        donationStatus: filterCampaigns.donationStatus,
        donorUserId: filterCampaigns.donorId,
        currency: filterCampaigns.currency,
        nonprofitRealmId: new Types.ObjectId(filterCampaigns.organizationId),
      })
      .count();

    const totalCampaigns = await this.donationLogModel
      .find({
        //campaignId: { $ne: new Types.ObjectId(filterCampaigns.campaignId) },
        donationStatus: filterCampaigns.donationStatus,
        donorId: filterCampaigns.donorId,
        currency: filterCampaigns.currency,
        organizationId: filterCampaigns.organizationId,
      })
      .count();

    const amountCampaigns = await this.donationLogModel.aggregate([
      {
        $match: {
          //campaignId: { $ne: new Types.ObjectId(filterCampaigns.campaignId) },
          donationStatus: 'SUCCESS',
          donorId: donorId,
          currency: filterCampaigns.currency,
          organizationId: organizationId,
        },
      },
      {
        $group: {
          // _id: '$campaignId',
          _id: '$donorId',
          amountOfCampaigns: { $sum: '$amount' },
          currency: { $first: '$currency' },
        },
      },
    ]);

    const amountZakatCampaigns = await this.donationLogsModel.aggregate([
      {
        $match: {
          //campaignId: new Types.ObjectId(filterCampaigns.campaignId),
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
          organizationId: organizationId,
          donationStatus: 'SUCCESS',
          donorId: donorId,
          createdAt: getDateQuery(filter.priode),
          //campaignId: { $ne: new Types.ObjectId(filterCampaigns.campaignId) },
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

    const totalDonationZakatPerProgram = await this.donationLogsModel.aggregate(
      [
        {
          $match: {
            nonprofitRealmId: new Types.ObjectId(organizationId),
            donationStatus: 'SUCCESS',
            donorUserId: donorId,
            createdAt: getDateQuery(filter.priode),
            //campaignId: new Types.ObjectId(filterCampaigns.campaignId),
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
      ],
    );

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
        const dataEl: any = {};
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
        const dataEl: any = {};
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

  /**
   * * Add new Organization
   */

  async createOrganization(payload: RegisterOrganizationDto) {
    try {
      const findOrganization = await this.organizationModel.find({
        ownerUserId: payload.ownerUserId,
      });

      if (!findOrganization.length) {
        /**
         * * Uplaod image
         */
        const maxSize: number = 1024 * 1024 * 8; // 8MB
        let uploadedFilePath: string[] = [];

        if (payload.imageLogo) {
          const uploadResult = await this.uploadFileOrganization(
            payload.ownerUserId!,
            'Uploading Image for organization',
            payload.imageLogo,
            'cover-image',
            [
              FileMimeTypeEnum.JPG,
              FileMimeTypeEnum.JPEG,
              FileMimeTypeEnum.PNG,
              FileMimeTypeEnum.PDF,
            ],
            maxSize,
            uploadedFilePath,
          );

          uploadedFilePath = uploadResult.uploadedFilePath;
        }

        /**
         * * Create new Organization
         */
        const imgBunny = uploadedFilePath[0];
        const payloadOrgToMongo = CreateNewOrganizationMappers(
          payload,
          imgBunny,
        );

        const createOrg = await this.organizationModel.create(
          payloadOrgToMongo,
        );

        if (!createOrg) {
          throw new NotImplementedException(`Cannot create new organization!`);
        }

        /**
         * * Create new Appearance
         */

        const payloadApperance = CreateNewAppearance({
          orgId: createOrg._id,
          ownerUserId: createOrg.ownerUserId,
          ownerRealmId: createOrg.ownerRealmId,
          logo: imgBunny,
        });

        const createNewAppearance = await this.appearanceModel.create(
          payloadApperance,
        );

        if (!createNewAppearance) {
          throw new NotImplementedException(
            `Cannot create new appearance for organization ${createOrg._id}!`,
          );
        }

        /**
         * * Create payment Gateway
         */
        const paymentGName = payload.paymentGateway
          ? payload.paymentGateway
          : 'STRIPE';

        const payloadPaymentGateway = CreateNewPaymentGateway(
          createOrg._id,
          paymentGName,
          createOrg.defaultCurrency,
        );

        const createPaymentGateway = await this.paymentGatewayModel.create(
          payloadPaymentGateway,
        );

        if (!createPaymentGateway) {
          throw new NotImplementedException(
            `Cannot create new payment gateway for organization ${createOrg._id}!`,
          );
        }

        return {
          _id: createOrg._id,
          organization_email: createOrg.contactEmail,
          organization_name: createOrg.name,
          appearance: createNewAppearance ? true : false,
          payment_gateway: createPaymentGateway ? true : false,
        };
      } else {
        throw new ConflictException(
          `User ${payload.email} already have organization nonprofit!`,
        );
      }
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * * Upload file image
   */

  async uploadFileOrganization(
    userId: string,
    uploadMessage: string,
    file: RegisterFileUpload,
    folderName: string,
    AllowedFileTypes: FileMimeTypeEnum[],
    maxSize: number = 1024 * 1024 * 6,
    uploadedFilePath: string[],
  ) {
    try {
      const fileName = generateFileName(
        file.fullName,
        file.imageExtension as FileMimeTypeEnum,
      );

      const filePath = `tmra/${this.appEnv}/organization/${userId}/${folderName}/${fileName}`;

      const fileBuffer = Buffer.from(
        file.base64Data.replace(/^data:.*;base64,/, ''),
        'base64',
      );

      validateAllowedExtension(file.imageExtension, AllowedFileTypes);
      validateFileSize(file.size, maxSize);

      const imageUrl = await this.bunnyService.uploadFileBase64(
        file.fullName,
        fileBuffer,
        filePath,
        `${uploadMessage} ${userId}`,
      );

      uploadedFilePath.push(imageUrl);

      const fileObj = {
        url: imageUrl,
        type: file.imageExtension,
        size: file.size,
      };

      return {
        uploadedFilePath,
        fileObj,
      };
    } catch (error) {
      if (uploadedFilePath.length > 0) {
        this.logger.log(
          'log',
          `${uploadMessage} error, deleting all previous uploaded files: ${error}`,
        );
        uploadedFilePath.forEach(async (path) => {
          await this.bunnyService.deleteMedia(path, true);
        });
      }

      throw new HttpException(`${error}`, HttpStatus.BAD_REQUEST);
    }
  }
}
