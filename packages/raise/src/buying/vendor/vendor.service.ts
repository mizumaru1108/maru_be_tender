import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { rootLogger } from '../../logger';
import {
  Vendor,
  VendorChartData,
  VendorChartDataDocument,
  VendorDocument,
} from './vendor.schema';
import moment from 'moment';
import { ChartDataDto, ChartDetailData } from './dto/chart-data.dto';
import { isDocumentArray } from '@typegoose/typegoose';
import { VendorChartDataDto } from './dto/vendor-chart-data.dto';

@Injectable()
export class VendorService {
  private logger = rootLogger.child({ logger: VendorService.name });

  constructor(
    @InjectModel(Vendor.name)
    private vendorModel: Model<VendorDocument>,
    @InjectModel(VendorChartData.name)
    private vendorChartDataModel: Model<VendorChartDataDocument>,
  ) {}

  async findAll() {
    this.logger.debug('findAll...');
    return await this.vendorModel.find({}, {}, { sort: { name: 1 } });
  }

  async getChartData(vendorId: string) {
    const now = moment();

    this.logger.debug(`vendorId: ${vendorId}`);
    this.logger.debug(`now: ${now.format('YYYY-MM-DD')}`);

    const vendorChartDataDto = new VendorChartDataDto()
    const { vendorIncomeDailyData, vendorCampaignDailyData } = await this.getDailyChartData(now, vendorId);
    const { vendorIncomeMonthlyData, vendorCampaignMonthlyData } = await this.getMonthlyChartData(now, vendorId);

    vendorChartDataDto.Campaign = [vendorCampaignMonthlyData, vendorCampaignDailyData];
    vendorChartDataDto.Income = [vendorIncomeMonthlyData, vendorIncomeDailyData];

    // return await this.vendorModel.find({}, {}, { sort: { name: 1 } });
  }

  private async getMonthlyChartData(now: moment.Moment, vendorId: string) {
    const vendorIncomeMonthlyData = new ChartDataDto();
    const vendorCampaignMonthlyData = new ChartDataDto();
    const year = now.year();
    const month = now.month();
    this.logger.debug(`year: ${year}`);
    this.logger.debug(`month: ${month}`);

    const result =  await this.vendorChartDataModel.aggregate([
      {
        $match: { vendorId: vendorId }
      },
      { $group: { _id: { month : "$month", year : "$year" },
          income: { $sum: '$income' },
          incomeCount: { $sum: '$incomeCount' },
          campaign: {$sum: '$campaign'},
          campaignCount: { $sum: '$campaignCount' }
        }}
    ]);

    console.log('result: ', JSON.stringify(result, null, 1));

    return { vendorIncomeMonthlyData, vendorCampaignMonthlyData };
  }

  private async getDailyChartData(now: moment.Moment, vendorId: string) {
    const vendorIncomeDailyData = new ChartDataDto();
    const vendorCampaignDailyData = new ChartDataDto();


    const last7days = [...Array(7)].map((_, index) =>
      now
        .subtract(index + 1, 'd')
        .format('YYYY-MM-DD'),
    );


    this.logger.debug(`last7days: ${last7days}`);
    const vendorDailyDataDocList = await this.vendorChartDataModel
      .find({ vendorId: vendorId, date: { $in: last7days } })
      .sort({ date: 1 });


    if (isDocumentArray(vendorDailyDataDocList)) {
      const vendorDailyDataList = vendorDailyDataDocList as VendorChartData[];
      vendorIncomeDailyData.name = 'Daily (last 7 days)';
      vendorCampaignDailyData.name = 'Daily (last 7 days)';
      const vendorIncomeDailyDataSum = vendorDailyDataList.reduce((prev, cur) => prev + (cur.income ?? 0), 0);
      const vendorIncomeCampaignDataSum = vendorDailyDataList.reduce((prev, cur) => prev + (cur.campaign ?? 0), 0);
      const vendorIncomeDailyDataCur = vendorDailyDataList.length > 0 ? vendorDailyDataList[0].currency : 'SAR';
      vendorIncomeDailyData.value = `${vendorIncomeDailyDataSum} ${vendorIncomeDailyDataCur}`;
      vendorCampaignDailyData.value = `${vendorIncomeCampaignDataSum} ${vendorIncomeDailyDataCur}`;
      vendorIncomeDailyData.categories = ['1st', '2nd', '3rd', '4th', '5th', '6th ', '7th'];
      vendorCampaignDailyData.categories = ['1st', '2nd', '3rd', '4th', '5th', '6th ', '7th'];
      const incomeData = new ChartDetailData();
      const campaignData = new ChartDetailData();
      incomeData.name = 'Income';
      campaignData.name = 'Campaign';
      incomeData.data = last7days.map(d => vendorDailyDataList.find(dailyData => dailyData.date == d)?.incomeCount ?? 0)
      campaignData.data = last7days.map(d => vendorDailyDataList.find(dailyData => dailyData.date == d)?.campaignCount ?? 0)
      vendorIncomeDailyData.data = [incomeData];
      vendorCampaignDailyData.data = [campaignData];
    }
    return { vendorIncomeDailyData, vendorCampaignDailyData };
  }
}
