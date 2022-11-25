import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ROOT_LOGGER } from '../../libs/root-logger';
import {
  CampaignVendorLog,
  CampaignVendorLogDocument,
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
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': VendorService.name,
  });

  constructor(
    @InjectModel(Vendor.name)
    private vendorModel: Model<VendorDocument>,
    @InjectModel(VendorChartData.name)
    private vendorChartDataModel: Model<VendorChartDataDocument>,
    @InjectModel(CampaignVendorLog.name)
    private campaignVendorLogModel: Model<CampaignVendorLogDocument>,
  ) {}

  async findAll() {
    this.logger.debug('findAll...');
    return await this.vendorModel.find({}, {}, { sort: { name: 1 } });
  }

  async getVendor(vendorId: string) {
    this.logger.debug('findOne...');
    return await this.vendorModel.findOne({ vendorId: vendorId });
  }

  async getSummary(vendorId: string) {
    this.logger.debug(`vendorId: ${vendorId}`);
    const totalCampaigns = await this.campaignVendorLogModel
      .where({ vendorId: vendorId })
      .count();
    const finishedCampaigns = await this.campaignVendorLogModel
      .where({ vendorId: vendorId, status: 'approved' })
      .count();
    const ongoingCampaigns = await this.campaignVendorLogModel
      .where({ vendorId: vendorId, status: 'pending' })
      .count();
    return {
      totalCampaigns: totalCampaigns,
      finishedCampaigns: finishedCampaigns,
      ongoingCampaigns: ongoingCampaigns,
    };
  }

  async getChartData(vendorId: string) {
    this.logger.debug(`vendorId: ${vendorId}`);

    const vendorChartDataDto = new VendorChartDataDto();
    const { vendorIncomeDailyData, vendorCampaignDailyData } =
      await this.getDailyChartData(vendorId);
    const { vendorIncomeMonthlyData, vendorCampaignMonthlyData } =
      await this.getMonthlyChartData(vendorId);

    vendorChartDataDto.Campaign = [
      vendorCampaignMonthlyData,
      vendorCampaignDailyData,
    ];
    vendorChartDataDto.Income = [
      vendorIncomeMonthlyData,
      vendorIncomeDailyData,
    ];

    // console.log(`Result: ${JSON.stringify(vendorChartDataDto, null, 1)}`)

    return vendorChartDataDto;
    // return await this.vendorModel.find({}, {}, { sort: { name: 1 } });
  }

  private async getMonthlyChartData(vendorId: string) {
    const now = moment();
    const vendorIncomeMonthlyData = new ChartDataDto();
    const vendorCampaignMonthlyData = new ChartDataDto();
    const year = now.year();
    const month = moment().month() + 1;

    const monthsLabel = moment.monthsShort().slice(0, month);
    vendorIncomeMonthlyData.name = 'Monthly';
    vendorCampaignMonthlyData.name = 'Monthly';
    vendorIncomeMonthlyData.categories = monthsLabel;
    vendorCampaignMonthlyData.categories = monthsLabel;

    const result = await this.vendorChartDataModel.aggregate([
      {
        $match: { vendorId: vendorId, year: year },
      },
      {
        $group: {
          _id: { month: '$month', year: '$year' },
          income: { $sum: '$income' },
          incomeCount: { $sum: '$incomeCount' },
          campaign: { $sum: '$campaign' },
          campaignCount: { $sum: '$campaignCount' },
          currency: { $min: '$currency' },
        },
      },
    ]);

    const vendorIncomeDailyDataSum = result.reduce(
      (prev, cur) => prev + (cur.income ?? 0),
      0,
    );
    const vendorIncomeCampaignDataSum = result.reduce(
      (prev, cur) => prev + (cur.campaign ?? 0),
      0,
    );
    const vendorIncomeDailyDataCur =
      result.length > 0 ? result[0].currency : 'SAR';
    vendorIncomeMonthlyData.value = `${vendorIncomeDailyDataSum} ${vendorIncomeDailyDataCur}`;
    vendorCampaignMonthlyData.value = `${vendorIncomeCampaignDataSum} ${vendorIncomeDailyDataCur}`;

    const incomeData = new ChartDetailData();
    const campaignData = new ChartDetailData();
    incomeData.name = 'Income';
    campaignData.name = 'Campaign';
    incomeData.data = monthsLabel.map(
      (_, index) =>
        result.find((r) => r._id.month == index + 1)?.incomeCount ?? 0,
    );
    campaignData.data = monthsLabel.map(
      (_, index) =>
        result.find((r) => r._id.month == index + 1)?.campaignCount ?? 0,
    );

    vendorIncomeMonthlyData.data = [incomeData];
    vendorCampaignMonthlyData.data = [campaignData];
    return { vendorIncomeMonthlyData, vendorCampaignMonthlyData };
  }

  private async getDailyChartData(vendorId: string) {
    const vendorIncomeDailyData = new ChartDataDto();
    const vendorCampaignDailyData = new ChartDataDto();

    const last7days = [...Array(7)].map((_, index) =>
      moment()
        .subtract(index + 1, 'd')
        .format('YYYY-MM-DD'),
    );

    // this.logger.debug(`last7days: ${last7days}`);
    const vendorDailyDataDocList = await this.vendorChartDataModel
      .find({ vendorId: vendorId, date: { $in: last7days } })
      .sort({ date: 1 });

    if (isDocumentArray(vendorDailyDataDocList)) {
      const vendorDailyDataList = vendorDailyDataDocList as VendorChartData[];
      vendorIncomeDailyData.name = 'Daily (last 7 days)';
      vendorCampaignDailyData.name = 'Daily (last 7 days)';
      const vendorIncomeDailyDataSum = vendorDailyDataList.reduce(
        (prev, cur) => prev + (cur.income ?? 0),
        0,
      );
      const vendorIncomeCampaignDataSum = vendorDailyDataList.reduce(
        (prev, cur) => prev + (cur.campaign ?? 0),
        0,
      );
      const vendorIncomeDailyDataCur =
        vendorDailyDataList.length > 0
          ? vendorDailyDataList[0].currency
          : 'SAR';
      vendorIncomeDailyData.value = `${vendorIncomeDailyDataSum} ${vendorIncomeDailyDataCur}`;
      vendorCampaignDailyData.value = `${vendorIncomeCampaignDataSum} ${vendorIncomeDailyDataCur}`;
      vendorIncomeDailyData.categories = [
        '1st',
        '2nd',
        '3rd',
        '4th',
        '5th',
        '6th ',
        '7th',
      ];
      vendorCampaignDailyData.categories = [
        '1st',
        '2nd',
        '3rd',
        '4th',
        '5th',
        '6th ',
        '7th',
      ];
      const incomeData = new ChartDetailData();
      const campaignData = new ChartDetailData();
      incomeData.name = 'Income';
      campaignData.name = 'Campaign';
      incomeData.data = last7days.map(
        (d) =>
          vendorDailyDataList.find((dailyData) => dailyData.date == d)
            ?.incomeCount ?? 0,
      );
      campaignData.data = last7days.map(
        (d) =>
          vendorDailyDataList.find((dailyData) => dailyData.date == d)
            ?.campaignCount ?? 0,
      );
      vendorIncomeDailyData.data = [incomeData];
      vendorCampaignDailyData.data = [campaignData];
    }
    return { vendorIncomeDailyData, vendorCampaignDailyData };
  }
}
