import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import axios, { AxiosRequestConfig } from 'axios';
import { rootLogger } from '../logger';
import { CreateMetalPriceDto } from './dto';
import {
  DonationLogs,
  DonationLogDocument,
} from '../donor/schema/donation_log.schema';
import { MetalPrice, MetalPriceDocument } from './schemas/metalPrice.schema';
import { Expense, ExpenseDocument } from './schemas/expense.schema';
import { ExpenseDto } from './dto/expense.dto';
import moment from 'moment';

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

  async getTransactionList(organizationId: string) {
    this.logger.debug(`getTransactions organizationId=${organizationId}`);
    return await this.donationLogModel.find({
      _id: organizationId,
      type: 'zakat',
    });
  }

  async getExpenseList(organizationId: string) {
    this.logger.debug(`getExpenseList organizationId=${organizationId}`);
    return await this.expenseModel.find({
      type: 'zakat',
      campaign: { organizationId: organizationId },
    });
  }

  async createExpense(expenseDto: ExpenseDto): Promise<Expense> {
    const createdExpense = new this.expenseModel(expenseDto);
    createdExpense.createdDate = moment().toISOString();
    return createdExpense.save();
  }
}
