import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import axios, { AxiosRequestConfig } from 'axios';
import { rootLogger } from '../logger';
import { CreateMetalPriceDto } from './dto';
import { MetalPrice, MetalPriceDocument } from './metalPrice.schema';

@Injectable()
export class ZakatService {
  private logger = rootLogger.child({ logger: ZakatService.name });
  constructor(
    @InjectModel(MetalPrice.name)
    private metalPriceModel: Model<MetalPriceDocument>,
    private configService: ConfigService,
  ) {}

  async _getMetalPrice(carat: boolean, base: string, symbols?: string) {
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
    } else if (symbols) {
      params.append('symbols', symbols);
    }

    const options: AxiosRequestConfig<any> = {
      method: 'GET',
      headers: {
        Authorization: `Basic ${metalAuthKey}`,
      },
      params,
      url: apiUrl,
    };

    this.logger.debug(`fetching data metal prices from ${apiUrl}`);
    const response = await axios(options);

    if (response['status'] == 200 && response['data']['success']) {
      const data = response['data'];
      this.logger.debug('success...');
      this.logger.debug(data);
      const metalType = symbols ?? '';
      const filter = {
        currency: base,
        metalType: metalType,
        isActive: true,
      };
      const res = await this.metalPriceModel.updateMany(filter, {
        isActive: false,
      });
      this.logger.debug(res); // Number of documents matched
      // this.logger.debug(res.nModified);
      const createMetalPriceDto = new CreateMetalPriceDto();
      const createdMetalPrice = new this.metalPriceModel(createMetalPriceDto);
      // createdMetalPrice.id = uuidv4();
      createdMetalPrice.metalType = metalType;
      createdMetalPrice.currency = base;
      createdMetalPrice.rates = data['rates'];
      createdMetalPrice.unit = data['unit'];
      createdMetalPrice.createdDate = data['date'];
      createdMetalPrice.isActive = true;
      createdMetalPrice.save();
      this.logger.debug('metal price has been successfully created...');
      return { status: true, data: createdMetalPrice };
    } else {
      this.logger.debug('failed...');
      return { status: false, data: response['data']['error'] };
    }
  }

  async fetchingMetalPrice() {
    this.logger.debug('get metal prices...');
    // const paymentJson = JSON.parse(JSON.stringify(payment));
    const sarCaratResults = await this._getMetalPrice(true, 'SAR');
    const sarTroyResults = await this._getMetalPrice(false, 'SAR', 'XAU,XAG');
    const gbpCaratResults = await this._getMetalPrice(true, 'GBP');
    const gbpTroyResults = await this._getMetalPrice(false, 'GBP', 'XAU,XAG');
    const usdCaratResults = await this._getMetalPrice(true, 'USD');
    const usdTroyResults = await this._getMetalPrice(false, 'USD', 'XAU,XAG');
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
    this.logger.debug('getMetalPrice...');
    this.logger.debug(metalType);
    metalType = metalType ? metalType : '';
    return await this.metalPriceModel.findOne({
      currency: base,
      isActive: true,
      metalType: metalType,
    });
  }
}
