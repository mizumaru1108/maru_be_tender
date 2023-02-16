import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ManagerChartData, ManagerChartDataDocument } from './manager.schema';
import { isDocumentArray } from '@typegoose/typegoose';
import { ChartDataDto, ChartDetailData } from './dto/chart-data.dto';
import { ManagerChartDataDto } from './dto/manager-chart-data.dto';

@Injectable()
export class ManagerService {
  constructor(
    @InjectModel(ManagerChartData.name)
    private managerChartDataModel: Model<ManagerChartDataDocument>,
  ) {}

  async getChartData() {
    const managerChartDataDto = new ManagerChartDataDto();
    const { managerMoneyPaidDailyData, managerDonationDailyData } =
      await this.getDailyChartData();
    const { managerMoneyPaidMonthlyData, managerDonationMonthlyData } =
      await this.getMonthlyChartData();

    managerChartDataDto.Donation = [
      managerDonationMonthlyData,
      managerDonationDailyData,
    ];
    managerChartDataDto.MoneyPaid = [
      managerMoneyPaidMonthlyData,
      managerMoneyPaidDailyData,
    ];

    // console.log(`Result: ${JSON.stringify(managerChartDataDto, null, 1)}`)

    return managerChartDataDto;
    // return await this.managerModel.find({}, {}, { sort: { name: 1 } });
  }

  private async getMonthlyChartData() {
    const now = moment();
    const managerMoneyPaidMonthlyData = new ChartDataDto();
    const managerDonationMonthlyData = new ChartDataDto();
    const year = now.year();
    const month = moment().month() + 1;

    const monthsLabel = moment.monthsShort().slice(0, month);
    managerMoneyPaidMonthlyData.name = 'Monthly';
    managerDonationMonthlyData.name = 'Monthly';
    managerMoneyPaidMonthlyData.categories = monthsLabel;
    managerDonationMonthlyData.categories = monthsLabel;

    const result = await this.managerChartDataModel.aggregate([
      {
        $match: { year: year },
      },
      {
        $group: {
          _id: { month: '$month', year: '$year' },
          moneyPaid: { $sum: '$moneyPaid' },
          moneyPaidCount: { $sum: '$moneyPaidCount' },
          donation: { $sum: '$donation' },
          donationCount: { $sum: '$donationCount' },
          currency: { $min: '$currency' },
        },
      },
    ]);

    const managerMoneyPaidDailyDataSum = result.reduce(
      (prev, cur) => prev + (cur.moneyPaid ?? 0),
      0,
    );
    const managerMoneyPaidDonationDataSum = result.reduce(
      (prev, cur) => prev + (cur.donation ?? 0),
      0,
    );
    const managerMoneyPaidDailyDataCur =
      result.length > 0 ? result[0].currency : 'SAR';
    managerMoneyPaidMonthlyData.value = `${managerMoneyPaidDailyDataSum} ${managerMoneyPaidDailyDataCur}`;
    managerDonationMonthlyData.value = `${managerMoneyPaidDonationDataSum} ${managerMoneyPaidDailyDataCur}`;

    const moneyPaidData = new ChartDetailData();
    const donationData = new ChartDetailData();
    moneyPaidData.name = 'MoneyPaid';
    donationData.name = 'Donation';
    moneyPaidData.data = monthsLabel.map(
      (_, index) =>
        result.find((r) => r._id.month == index + 1)?.moneyPaidCount ?? 0,
    );
    donationData.data = monthsLabel.map(
      (_, index) =>
        result.find((r) => r._id.month == index + 1)?.donationCount ?? 0,
    );

    managerMoneyPaidMonthlyData.data = [moneyPaidData];
    managerDonationMonthlyData.data = [donationData];
    return { managerMoneyPaidMonthlyData, managerDonationMonthlyData };
  }

  private async getDailyChartData() {
    const managerMoneyPaidDailyData = new ChartDataDto();
    const managerDonationDailyData = new ChartDataDto();

    const last7days = [...Array(7)].map((_, index) =>
      moment()
        .subtract(index + 1, 'd')
        .format('YYYY-MM-DD'),
    );

    // this.logger.debug(`last7days: ${last7days}`);
    const managerDailyDataDocList = await this.managerChartDataModel
      .find({ date: { $in: last7days } })
      .sort({ date: 1 });

    if (isDocumentArray(managerDailyDataDocList)) {
      const managerDailyDataList =
        managerDailyDataDocList as ManagerChartData[];
      managerMoneyPaidDailyData.name = 'Daily (last 7 days)';
      managerDonationDailyData.name = 'Daily (last 7 days)';
      const managerMoneyPaidDailyDataSum = managerDailyDataList.reduce(
        (prev, cur) => prev + (cur.donation ?? 0),
        0,
      );
      const managerMoneyPaidDonationDataSum = managerDailyDataList.reduce(
        (prev, cur) => prev + (cur.moneyPaid ?? 0),
        0,
      );
      const managerMoneyPaidDailyDataCur =
        managerDailyDataList.length > 0
          ? managerDailyDataList[0].currency
          : 'SAR';
      managerMoneyPaidDailyData.value = `${managerMoneyPaidDailyDataSum} ${managerMoneyPaidDailyDataCur}`;
      managerDonationDailyData.value = `${managerMoneyPaidDonationDataSum} ${managerMoneyPaidDailyDataCur}`;
      managerMoneyPaidDailyData.categories = [
        '1st',
        '2nd',
        '3rd',
        '4th',
        '5th',
        '6th ',
        '7th',
      ];
      managerDonationDailyData.categories = [
        '1st',
        '2nd',
        '3rd',
        '4th',
        '5th',
        '6th ',
        '7th',
      ];
      const moneyPaidData = new ChartDetailData();
      const donationData = new ChartDetailData();
      moneyPaidData.name = 'MoneyPaid';
      donationData.name = 'Donation';
      moneyPaidData.data = last7days.map(
        (d) =>
          managerDailyDataList.find((dailyData) => dailyData.date == d)
            ?.moneyPaidCount ?? 0,
      );
      donationData.data = last7days.map(
        (d) =>
          managerDailyDataList.find((dailyData) => dailyData.date == d)
            ?.donationCount ?? 0,
      );
      managerMoneyPaidDailyData.data = [moneyPaidData];
      managerDonationDailyData.data = [donationData];
    }
    return { managerMoneyPaidDailyData, managerDonationDailyData };
  }
}
