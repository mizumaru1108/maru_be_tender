import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import axios, { AxiosRequestConfig } from 'axios';
import { rootLogger } from '../logger';
import { CreateMetalPriceDto } from './dto';
import {
  DonationLogs,
  DonationLogDocument,
} from '../donor/schema/donation_log.schema';
import {
  Organization,
  OrganizationDocument,
} from '../organization/organization.schema';
import { MetalPrice, MetalPriceDocument } from './schemas/metalPrice.schema';
import { Expense, ExpenseDocument } from './schemas/expense.schema';
import { ExpenseDto } from './dto/expense.dto';
import moment from 'moment';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ZakatService {
  private logger = rootLogger.child({ logger: ZakatService.name });
  constructor(
    @InjectModel(MetalPrice.name)
    private metalPriceModel: Model<MetalPriceDocument>,
    @InjectModel(DonationLogs.name)
    private donationLogModel: Model<DonationLogDocument>,
    @InjectModel(Expense.name)
    private expenseModel: Model<ExpenseDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    private configService: ConfigService,
  ) {}

  async _getMetalPrice(carat: boolean, base: string, createdDate?: string) {
    const params = new URLSearchParams();
    const metalAccessKey = this.configService.get('METAL_ACCESS_KEY');
    const metalLatestUrl = `${this.configService.get('METAL_API_URL')}/latest`;
    const metalCaratUrl = `${this.configService.get('METAL_API_URL')}/carat`;
    const metalAuthKey = this.configService.get('METAL_AUTH_KEY');
    params.append('access_key', metalAccessKey);
    params.append('base', base);
    let apiUrl = metalLatestUrl;
    if (carat) {
      apiUrl = metalCaratUrl;
    } else {
      params.append('symbols', 'XAU,XAG');
    }

    const options: AxiosRequestConfig<any> = {
      method: 'GET',
      headers: {
        Authorization: `Basic ${metalAuthKey}`,
      },
      params,
      url: apiUrl,
    };

    this.logger.debug(
      `fetching data metal prices from ${apiUrl} params=${params} ...`,
    );
    const response = await axios(options);

    if (response['status'] == 200 && response['data']['success']) {
      const data = response['data'];
      this.logger.debug('success:', data);
      const metalType = carat ? '' : 'XAU,XAG';
      const filter = {
        currency: base,
        metalType: metalType,
        isActive: true,
      };
      const res = await this.metalPriceModel.updateMany(filter, {
        isActive: false,
      });
      this.logger.debug('response:', res); // Number of documents matched
      // this.logger.debug(res.nModified);
      const createMetalPriceDto = new CreateMetalPriceDto();
      const createdMetalPrice = new this.metalPriceModel(createMetalPriceDto);
      // createdMetalPrice.id = uuidv4();
      createdMetalPrice.metalType = metalType;
      createdMetalPrice.currency = base;
      createdMetalPrice.rates = data['rates'];
      createdMetalPrice.unit = data['unit'];
      createdMetalPrice.createdDate = createdDate ?? data['date'];
      createdMetalPrice.isActive = true;
      const created = await createdMetalPrice.save();
      this.logger.debug(
        'metal price has been successfully created...',
        created,
      );
      return {
        status: true,
        data: createdMetalPrice,
        createdDate: data['date'],
      };
    } else {
      this.logger.error('failed!');
      return { status: false, data: response['data']['error'] };
    }
  }

  @Cron('0 0 0 * * 1,4')
  async fetchingMetalPrice() {
    this.logger.debug('fetch metal prices using Metal API...');
    // const paymentJson = JSON.parse(JSON.stringify(payment));
    const sarTroyResults = await this._getMetalPrice(false, 'SAR');
    const createdDate = sarTroyResults['createdDate'];
    const sarCaratResults = await this._getMetalPrice(true, 'SAR', createdDate);
    const gbpCaratResults = await this._getMetalPrice(true, 'GBP', createdDate);
    const gbpTroyResults = await this._getMetalPrice(false, 'GBP');
    const usdCaratResults = await this._getMetalPrice(true, 'USD', createdDate);
    const usdTroyResults = await this._getMetalPrice(false, 'USD');
    return {
      sarCaratResults: sarCaratResults['data'],
      sarTroyResults: sarTroyResults['data'],
      gbpCaratResults: gbpCaratResults['data'],
      gbpTroyResults: gbpTroyResults['data'],
      usdCaratResults: usdCaratResults['data'],
      usdTroyResults: usdTroyResults['data'],
    };
  }

  async getMetalPrice(base: string, metalType: string) {
    this.logger.debug(`getMetalPrice base=${base} metalType=${metalType}...`);
    metalType = metalType ? metalType : '';
    return await this.metalPriceModel.findOne({
      currency: base,
      isActive: true,
      metalType: metalType,
    });
  }

  async getSummary(organizationId: string) {
    this.logger.debug(`getSummary organizationId=${organizationId}`);
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
    const donationList = await this.donationLogModel.aggregate([
      {
        $match: {
          nonprofitRealmId: new Types.ObjectId(organizationId),
          campaignId: new Types.ObjectId('6299ed6a9f1ad428563563ed'),
          donationStatus: 'SUCCESSFUL',
        },
      },
      {
        $group: {
          _id: { nonprofitRealmId: '$nonprofitRealmId' },
          total: { $sum: '$amount' },
        },
      },
    ]);
    console.log(donationList);
    const totalReceive = donationList.length == 0 ? 0 : donationList[0].total;
    return { total_receive: totalReceive };
  }

  async getTransactionAll(organizationId: string) {
    this.logger.debug(`getTransactions organizationId=${organizationId}`);
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

    // const expenseList = await this.expenseModel.aggregate([
    //   { $match: { createdBy: organizationId } },
    //   {
    //     $addFields: {
    //       organizationName: getOrganization.name,
    //       createdAt: '$createdDate',
    //     },
    //   },
    // ]);
    // console.log(expenseList);
    const donationList = await this.donationLogModel.find({
      nonprofitRealmId: new Types.ObjectId(organizationId),
      campaignId: new Types.ObjectId('6299ed6a9f1ad428563563ed'),
    });
    // console.log(donationList);
    let transactionAll: any = [];
    transactionAll = transactionAll.concat(donationList);
    // transactionAll = transactionAll.concat(expenseList);
    transactionAll.sort(
      (x: DonationLogs, y: DonationLogs) =>
        +new Date(x.createdAt) - +new Date(y.createdAt),
    );
    return transactionAll;
  }

  async getTransactionList(organizationId: string) {
    this.logger.debug(`getTransactions organizationId=${organizationId}`);
    // const list = await this.donationLogModel
    //   .find({
    //     nonprofitRealmId: new Types.ObjectId(organizationId),
    //     campaignId: new Types.ObjectId('6299ed6a9f1ad428563563ed'),
    //   })
    //   .populate('donorUserId');
    // console.log(list[0]?.donorUserId);
    // return list;
    return await this.donationLogModel.aggregate([
      {
        $match: {
          nonprofitRealmId: new Types.ObjectId(organizationId),
          campaignId: new Types.ObjectId('6299ed6a9f1ad428563563ed'),
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'donorUserId',
          foreignField: '_id',
          as: 'user',
        },
      },
      // {
      //   $set: {
      //     donorName: {
      //       $concat: [
      //         { $arrayElemAt: ['$user.firstname', 0] },
      //         ' ',
      //         { $arrayElemAt: ['$user.lastname', 0] },
      //       ],
      //     },
      //   },
      // },
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
          as: 'anonymous',
        },
      },
      {
        $unwind: {
          path: '$anonymous',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          donorName: {
            $cond: {
              if: { $eq: [{ $ifNull: ['$user', 0] }, 0] },
              then: {
                $concat: ['$anonymous.firstName', ' ', '$anonymous.lastName'],
              },
              else: {
                $concat: ['$user.firstname', ' ', '$user.lastname'],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          createdAt: { $first: '$createdAt' },
          donationStatus: { $first: '$donationStatus' },
          amount: { $first: '$amount' },
          donorName: { $first: '$donorName' },
        },
      },
    ]);
  }

  async getExpenseList(organizationId: string) {
    this.logger.debug(`getExpenseList organizationId=${organizationId}`);
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

    const objectList = this.expenseModel.aggregate([
      { $match: { createdBy: organizationId } },
      {
        $addFields: {
          organizationName: getOrganization.name,
        },
      },
    ]);
    // console.log(objectList);
    return objectList;
  }

  async createExpense(expenseDto: ExpenseDto): Promise<Expense> {
    const createdExpense = new this.expenseModel(expenseDto);
    createdExpense.createdDate = moment().toISOString();
    return createdExpense.save();
  }

  async getDonorList(organizationId: string) {
    this.logger.debug(`getDonorList organizationId=${organizationId}`);
    return await this.donationLogModel.aggregate([
      {
        $match: {
          nonprofitRealmId: new Types.ObjectId(organizationId),
          donationStatus: 'SUCCESSFUL',
        },
      },
      {
        $group: {
          _id: { donorUserId: '$donorUserId' },
        },
      },
    ]);
  }

  // @Cron('45 * * * * *')
  // handleCron() {
  //   this.logger.debug('Called when the current second is 45');
  // }
}
