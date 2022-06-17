import { Injectable } from '@nestjs/common';
import { rootLogger } from '../logger';
import moment from 'moment';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OperatorChartData, OperatorChartDataDocument } from './schema/operator-chart.schema';
import { Operator, OperatorDocument } from './schema/operator.schema';
import { isDocumentArray } from '@typegoose/typegoose';
import { ChartDataDto, ChartDetailData } from './dto/chart-data.dto';
import { OperatorChartDataDto } from './dto/operator-chart-data.dto';

@Injectable()
export class OperatorService {
  private logger = rootLogger.child({ logger: OperatorService.name });

  constructor(
    @InjectModel(OperatorChartData.name)
    private operatorChartDataModel: Model<OperatorChartDataDocument>,
    @InjectModel(Operator.name)
    private operatorModel: Model<OperatorDocument>,
    ) {}

  
  async getListAll(){
    this.logger.debug('Get list all operator with its project...');
    const operatorList = await this.operatorModel.aggregate([
      {
        $lookup: {
          from: 'operator',
          localField: 'operatorId',
          foreignField: '_id',
          as: 'op',
        },
      },
      {
        $unwind: {
          path: '$op',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id:"$op._id", 
          name: { $first: '$op.name' },
          createdAt: { $first: '$op.createdAt' },
          projectId: { $first: '$projectId' },
          count:{$sum:1},
        },
      },
        {
       $project: {
           _id: 1,
           name: 1,
           createdAt: 1,
           projectId: 1,
           projectCount: "$count",
           }
      },
    ]);
    return operatorList;
  }


  async getChartData(operatorId: string) {
    this.logger.debug(`operatorId: ${operatorId}`);

    const operatorChartDataDto = new OperatorChartDataDto();
    const { operatorMoneySpendDailyData, operatorDonationDailyData } =
      await this.getDailyChartData(operatorId);
    const { operatorMoneySpendMonthlyData, operatorDonationMonthlyData } =
      await this.getMonthlyChartData(operatorId);

    operatorChartDataDto.Donation = [
      operatorDonationMonthlyData,
      operatorDonationDailyData,
    ];
    operatorChartDataDto.MoneySpend = [
      operatorMoneySpendMonthlyData,
      operatorMoneySpendDailyData,
    ];

    // console.log(`Result: ${JSON.stringify(operatorChartDataDto, null, 1)}`)

    return operatorChartDataDto;
    // return await this.operatorModel.find({}, {}, { sort: { name: 1 } });
  }

  private async getMonthlyChartData(operatorId: string) {
    const now = moment();
    const operatorMoneySpendMonthlyData = new ChartDataDto();
    const operatorDonationMonthlyData = new ChartDataDto();
    const year = now.year();
    const month = moment().month() + 1;

    const monthsLabel = moment.monthsShort().slice(0, month);
    operatorMoneySpendMonthlyData.name = 'Monthly';
    operatorDonationMonthlyData.name = 'Monthly';
    operatorMoneySpendMonthlyData.categories = monthsLabel;
    operatorDonationMonthlyData.categories = monthsLabel;

    const result = await this.operatorChartDataModel.aggregate([
      {
        $match: { operatorId: operatorId, year: year },
      },
      {
        $group: {
          _id: { month: '$month', year: '$year' },
          moneySpend: { $sum: '$moneySpend' },
          moneySpendCount: { $sum: '$moneySpendCount' },
          donation: { $sum: '$donation' },
          donationCount: { $sum: '$donationCount' },
          currency: { $min: '$currency' },
        },
      },
    ]);

    const operatorMoneySpendDailyDataSum = result.reduce(
      (prev, cur) => prev + (cur.moneySpend ?? 0),
      0,
    );
    const operatorMoneySpendDonationDataSum = result.reduce(
      (prev, cur) => prev + (cur.donation ?? 0),
      0,
    );
    const operatorMoneySpendDailyDataCur =
      result.length > 0 ? result[0].currency : 'SAR';
    operatorMoneySpendMonthlyData.value = `${operatorMoneySpendDailyDataSum} ${operatorMoneySpendDailyDataCur}`;
    operatorDonationMonthlyData.value = `${operatorMoneySpendDonationDataSum} ${operatorMoneySpendDailyDataCur}`;

    const moneySpendData = new ChartDetailData();
    const donationData = new ChartDetailData();
    moneySpendData.name = 'MoneySpend';
    donationData.name = 'Donation';
    moneySpendData.data = monthsLabel.map(
      (_, index) =>
        result.find((r) => r._id.month == index + 1)?.moneySpendCount ?? 0,
    );
    donationData.data = monthsLabel.map(
      (_, index) =>
        result.find((r) => r._id.month == index + 1)?.donationCount ?? 0,
    );

    operatorMoneySpendMonthlyData.data = [moneySpendData];
    operatorDonationMonthlyData.data = [donationData];
    return { operatorMoneySpendMonthlyData, operatorDonationMonthlyData };
  }

  private async getDailyChartData(operatorId: string) {
    const operatorMoneySpendDailyData = new ChartDataDto();
    const operatorDonationDailyData = new ChartDataDto();

    const last7days = [...Array(7)].map((_, index) =>
      moment()
        .subtract(index + 1, 'd')
        .format('YYYY-MM-DD'),
    );

    // this.logger.debug(`last7days: ${last7days}`);
    const operatorDailyDataDocList = await this.operatorChartDataModel
      .find({ operatorId: operatorId, date: { $in: last7days } })
      .sort({ date: 1 });

    if (isDocumentArray(operatorDailyDataDocList)) {
      const operatorDailyDataList = operatorDailyDataDocList as OperatorChartData[];
      operatorMoneySpendDailyData.name = 'Daily (last 7 days)';
      operatorDonationDailyData.name = 'Daily (last 7 days)';
      const operatorMoneySpendDailyDataSum = operatorDailyDataList.reduce(
        (prev, cur) => prev + (cur.donation ?? 0),
        0,
      );
      const operatorMoneySpendDonationDataSum = operatorDailyDataList.reduce(
        (prev, cur) => prev + (cur.moneySpend ?? 0),
        0,
      );
      const operatorMoneySpendDailyDataCur =
        operatorDailyDataList.length > 0
          ? operatorDailyDataList[0].currency
          : 'SAR';
      operatorMoneySpendDailyData.value = `${operatorMoneySpendDailyDataSum} ${operatorMoneySpendDailyDataCur}`;
      operatorDonationDailyData.value = `${operatorMoneySpendDonationDataSum} ${operatorMoneySpendDailyDataCur}`;
      operatorMoneySpendDailyData.categories = [
        '1st',
        '2nd',
        '3rd',
        '4th',
        '5th',
        '6th ',
        '7th',
      ];
      operatorDonationDailyData.categories = [
        '1st',
        '2nd',
        '3rd',
        '4th',
        '5th',
        '6th ',
        '7th',
      ];
      const moneySpendData = new ChartDetailData();
      const donationData = new ChartDetailData();
      moneySpendData.name = 'MoneySpend';
      donationData.name = 'Donation';
      moneySpendData.data = last7days.map(
        (d) =>
          operatorDailyDataList.find((dailyData) => dailyData.date == d)
            ?.moneySpendCount ?? 0,
      );
      donationData.data = last7days.map(
        (d) =>
          operatorDailyDataList.find((dailyData) => dailyData.date == d)
            ?.donationCount ?? 0,
      );
      operatorMoneySpendDailyData.data = [moneySpendData];
      operatorDonationDailyData.data = [donationData];
    }
    return { operatorMoneySpendDailyData, operatorDonationDailyData };
  }
}
