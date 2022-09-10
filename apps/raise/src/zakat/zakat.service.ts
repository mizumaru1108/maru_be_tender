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
} from '../organization/schema/organization.schema';
import { MetalPrice, MetalPriceDocument } from './schemas/metalPrice.schema';
import { Expense, ExpenseDocument } from './schemas/expense.schema';
import { ExpenseDto } from './dto/expense.dto';
import { SpanStatusCode, trace } from '@opentelemetry/api';
import { Cron } from '@nestjs/schedule';
import { User, UserDocument } from 'src/user/schema/user.schema';
import {
  PaymentGateway,
  PaymentGatewayDocument,
} from 'src/payment-stripe/schema/paymentGateway.schema';
import {
  Anonymous,
  AnonymousDocument,
} from 'src/donor/schema/anonymous.schema';
import { Donor, DonorDocument } from 'src/donor/schema/donor.schema';
import {
  Campaign,
  CampaignDocument,
} from 'src/campaign/schema/campaign.schema';
import {
  PaymentData,
  PaymentDataDocument,
} from 'src/payment-stripe/schema/paymentData.schema';
import { ZakatLog, ZakatLogDocument } from './schemas/zakat_log.schema';
import { PaymentRequestDto } from 'src/payment-stripe/payment-stripe.dto';

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
    @InjectModel(PaymentData.name)
    private paymentDataModel: Model<PaymentDataDocument>,
    @InjectModel(PaymentGateway.name)
    private paymentGatewayModel: Model<PaymentGatewayDocument>,
    @InjectModel(Campaign.name)
    private campaignModel: Model<CampaignDocument>,
    @InjectModel(Donor.name)
    private donorModel: Model<DonorDocument>,
    @InjectModel(Anonymous.name)
    private anonymousModel: Model<AnonymousDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private configService: ConfigService,
    @InjectModel(ZakatLog.name)
    private readonly zakatLogModel: Model<ZakatLogDocument>,
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
    console.log(donationList);
    const totalReceive = donationList.length == 0 ? 0 : donationList[0].total;
    return { total_receive: totalReceive };
  }

  async getTransactionAll(organizationId: string, sortStatus: string) {
    this.logger.debug(`getTransactions organizationId=${organizationId}`);

    let sortData = {};
    if (sortStatus) {
      sortData = {
        donationStatus: sortStatus == 'asc' ? 1 : -1,
        createdAt: -1,
      };
    } else {
      sortData = {
        createdAt: -1,
      };
    }

    // const getOrganization = await this.organizationModel.findOne({
    //   _id: organizationId,
    // });
    // if (!getOrganization) {
    //   const txtMessage = `request rejected organizationId not found`;
    //   return {
    //     statusCode: 514,
    //     headers: {
    //       'Access-Control-Allow-Origin': '*',
    //     },
    //     body: JSON.stringify({
    //       message: txtMessage,
    //     }),
    //   };
    // }

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
    // const donationList = await this.donationLogModel.find({
    //   nonprofitRealmId: new Types.ObjectId(organizationId),
    //   campaignId: new Types.ObjectId('6299ed6a9f1ad428563563ed'),
    // });
    // // console.log(donationList);
    // let transactionAll: any = [];
    // transactionAll = transactionAll.concat(donationList);
    // // transactionAll = transactionAll.concat(expenseList);
    // transactionAll.sort(
    //   (x: DonationLogs, y: DonationLogs) =>
    //     +new Date(x.createdAt) - +new Date(y.createdAt),
    // );
    // return transactionAll;
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
          email: {
            $cond: [
              { $eq: [{ $ifNull: ['$user', 0] }, 0] },
              '$anonymous.email',
              '$user.email',
            ],
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
          email: { $first: '$email' },
        },
      },
      {
        $sort: sortData,
      },
    ]);
  }

  async getTransactionList(organizationId: string, sortStatus: string) {
    this.logger.debug(`getTransactions organizationId=${organizationId}`);
    // const list = await this.donationLogModel
    //   .find({
    //     nonprofitRealmId: new Types.ObjectId(organizationId),
    //     campaignId: new Types.ObjectId('6299ed6a9f1ad428563563ed'),
    //   })
    //   .populate('donorUserId');
    // console.log(list[0]?.donorUserId);
    // return list;
    let sortData = {};
    if (sortStatus) {
      sortData = {
        donationStatus: sortStatus == 'asc' ? 1 : -1,
        createdAt: -1,
      };
    } else {
      sortData = {
        createdAt: -1,
      };
    }
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
          email: {
            $cond: [
              { $eq: [{ $ifNull: ['$user', 0] }, 0] },
              '$anonymous.email',
              '$user.email',
            ],
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
          email: { $first: '$email' },
        },
      },
      {
        $sort: sortData,
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
    let now: Date = new Date();
    createdExpense.createdDate = now;
    return createdExpense.save();
  }

  async getDonorList(organizationId: string) {
    this.logger.debug(`getDonorList organizationId=${organizationId}`);
    return await this.donationLogModel.aggregate([
      {
        $match: {
          nonprofitRealmId: new Types.ObjectId(organizationId),
          donationStatus: 'SUCCESS',
        },
      },
      {
        $group: {
          _id: { donorUserId: '$donorUserId' },
        },
      },
    ]);
  }

  async createDonate(paymentDto: PaymentRequestDto) {
    const tracer = trace.getTracer('tmra-raise');
    const span = tracer.startSpan('zakat-donate-request', {
      attributes: { 'donor.firstName': '-' },
    });
    try {
      // Do some work here

      this.logger.debug('stripeRequest...');
      let txtMessage = '';
      let stripeCallbackUrl = '';
      // let amount = '';
      // let donorId = '';
      let isAnonymous = false;
      let donor = null;
      // let donorName = '';
      let currency = paymentDto.currency;

      if (
        !paymentDto.organizationId ||
        !paymentDto.campaignId ||
        !paymentDto.donorId ||
        !Types.ObjectId.isValid(paymentDto.campaignId) ||
        !Types.ObjectId.isValid(paymentDto.organizationId) ||
        !paymentDto.success_url ||
        !paymentDto.cancel_url ||
        !paymentDto.price ||
        !paymentDto.amount ||
        !paymentDto.quantity
      ) {
        txtMessage = 'Bad Request';
        // console.log('test');
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            message: txtMessage,
          }),
        };
      }

      if (!['GBP', 'SAR', 'USD'].includes(currency)) {
        txtMessage = 'Bad Request';
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            message: 'Currency must be GBP or SAR',
          }),
        };
      }

      const getOrganization = await this.organizationModel.findOne({
        _id: paymentDto.organizationId,
      });
      console.log(
        'currency',
        getOrganization?.defaultCurrency,
        'payment DTO=>',
        paymentDto,
      );
      if (!getOrganization) {
        txtMessage = `request rejected organizationId not found`;
        return {
          statusCode: 514,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            message: txtMessage,
          }),
        };
      } else if (!currency) {
        currency = getOrganization['defaultCurrency'];
      }
      //console.log('debug', paymentDto.campaignId);
      // if (payment.campaignId) {
      const getCampaign = await this.campaignModel
        .findOne({
          _id: paymentDto.campaignId,
        })
        .exec();

      //console.log('debug', getCampaign);
      let dataAmount = paymentDto.amount * parseFloat(paymentDto.quantity); // let's assume it will be multiple by 1 (price)
      if (!getCampaign) {
        txtMessage = `request rejected campaignId not found`;
        return {
          statusCode: 514,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            message: txtMessage,
          }),
        };
      } else if (
        parseFloat(getCampaign.amountProgress.toString()) + dataAmount >
        parseFloat(getCampaign.amountTarget.toString())
      ) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            message: `Amount is larger than the limit of the target ${getCampaign.amountTarget}`,
          }),
        };
      }
      // }

      const ObjectId = require('mongoose').Types.ObjectId;
      //console.log('debug', paymentDto.organizationId);
      const getSecretKey = await this.paymentGatewayModel.findOne(
        { organizationId: ObjectId(paymentDto.organizationId) },
        { apiKey: 1, _id: 0 },
      );

      if (!getSecretKey) {
        txtMessage = 'organization can not use Stripe Payment Gateway';
        console.log('here');
        return {
          statusCode: 404, //resource not found
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            message: txtMessage,
          }),
        };
      }

      console.log(getSecretKey['apiKey']);
      //let getUser = new UserModel();
      if (paymentDto.donorId) {
        // console.log('donorid');
        // console.log(payment.donorId);
        if (!Types.ObjectId.isValid(paymentDto.donorId)) {
          donor = await this.userModel.findOne({
            _id: paymentDto.donorId,
          });
          // if (donor) donorName = `${donor.firstname} ${donor.lastname ?? ''}`;
        } else {
          donor = await this.donorModel.findOne({
            _id: paymentDto.donorId,
          });

          if (!donor) {
            donor = await this.anonymousModel.findOne({
              _id: paymentDto.donorId,
            });

            if (!donor) {
              txtMessage = 'user not found,  donation service is not available';
              return {
                statusCode: 516, //user not found
                headers: {
                  'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                  message: txtMessage,
                }),
              };
            } else {
              isAnonymous = true;
            }
          }

          span.setAttribute('donor.firstName', donor?.firstName ?? '');

          // if (donor) donorName = `${donor.firstName} ${donor.lastName ?? ''}`;
        }
      }

      // const paymentJson = JSON.parse(JSON.stringify(payment));
      const params = new URLSearchParams();
      if (donor && donor.email) {
        //const donorEmail = donor.email ? donor.email : 'anonymous@email.com';
        params.append('customer_email', donor.email);
        // params.append('customer', {'email': donor.email, name: donorName});
        // params.append('customer_name', donorName);
      }
      params.append('success_url', paymentDto.success_url);
      params.append('cancel_url', paymentDto.cancel_url);
      params.append('line_items[0][price]', paymentDto.price);
      params.append('line_items[0][quantity]', paymentDto.quantity);
      params.append('mode', 'payment');
      params.append('submit_type', 'donate'); //will enable button with label "donate"
      console.log(params);
      const options: AxiosRequestConfig<any> = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Bearer ' + getSecretKey['apiKey'] + '',
        },
        params,
        url: 'https://api.stripe.com/v1/checkout/sessions',
      };

      const data = await axios(options);
      if (!data) {
        return {
          statusCode: 504,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            message: 'Gateway Timeout or Stripe API down',
          }),
        };
      }

      const amountStr = data['data']['amount_total'].toString();
      const amount = amountStr.substring(0, amountStr.length - 2);
      const extraAmount = paymentDto.extraAmount ? paymentDto.extraAmount : 0;

      const ownerUserId = await this.userModel.findOne(
        {
          _id: paymentDto.donorId,
        },
        { ownerUserId: 1 },
      );

      console.log('OwnerUserId=>', ownerUserId);

      //insert data to donation_log
      let objectIdDonation = new Types.ObjectId();
      let now: Date = new Date();
      const getDonationLog = await new this.donationLogModel({
        _id: objectIdDonation,
        nonprofitRealmId: ObjectId(paymentDto.organizationId),
        donorUserId: isAnonymous ? '' : ownerUserId, //paymentDto.donorId,
        // donorName: donor ? `${donor.firstName} ${donor.lastName}` : null,
        // amount: payment.amount,
        amount: Number(amount),
        extraAmount: Number(extraAmount),
        createdAt: now,
        updatedAt: now,
        campaignId: ObjectId(paymentDto.campaignId),
        currency: currency,
        donationStatus: 'PENDING',
        // type: payment.type,
        // ipAddress: '',
        // paymentGatewayId: 'PAYSTRIPE',
        // transactionId: data['data']['id'],
      }).save();

      if (!getDonationLog) {
        txtMessage = 'donation failed to save in mongodb';
        return {
          statusCode: 504,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            message: txtMessage,
          }),
        };
      }

      if (Array.isArray(paymentDto.zakatLogs)) {
        //insert data to zakatlogs
        for (let i = 0; i < paymentDto.zakatLogs.length; i++) {
          const zakatLogs = paymentDto.zakatLogs[i];
          const details = Array.isArray(zakatLogs.details) ? zakatLogs : [];
          const getZakatLog = await new this.zakatLogModel({
            _id: new Types.ObjectId(),
            donationLogId: objectIdDonation,
            type: zakatLogs.type,
            currency: zakatLogs.currency,
            totalAmount: Number(zakatLogs.totalAmount),
            unit: zakatLogs.unit,
            numberOfUnits: zakatLogs.numberOfUnits,
            details: details,
            createdAt: now,
          }).save();
        }
      }

      //insert data to paymentData
      let objectIdPayment = new Types.ObjectId();
      // this.logger.debug(isAnonymous.toString);
      if (isAnonymous) {
        // donor.donorLogId = objectIdDonation;
        // donor.save();
        await this.anonymousModel.findOneAndUpdate(
          { _id: paymentDto.donorId },
          { donationLogId: objectIdDonation },
        );
      }

      const insertPaymentData = await new this.paymentDataModel({
        _id: objectIdPayment,
        donationId: objectIdDonation,
        merchantId: '',
        payerId: '',
        orderId: data.data['payment_intent'], //payment_intent ID
        cardType: '',
        cardScheme: '',
        paymentDescription: 'ZAKAT',
        expiryMonth: '',
        expiryYear: '',
        responseStatus: '',
        responseCode: '',
        responseMessage: '',
        cvvResult: '',
        avsResult: '',
        transactionTime: '',
        paymentStatus: 'OPEN',
      }).save();

      //console.log(insertPaymentData);

      if (!insertPaymentData) {
        txtMessage = 'payment data failed to save in mongodb';
        return {
          statusCode: 504,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            message: txtMessage,
          }),
        };
      }

      // console.log('debug', data);
      // console.log('debug', data['data']['id']);
      stripeCallbackUrl = data['data']['url'];
      txtMessage = `stripe request has been sent`;

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          // "Access-Control-Allow-Credentials": true,
        },
        stripeResponse: data['data'],
        message: txtMessage,
      };
    } catch (err) {
      // When we catch an error, we want to show that an error occurred
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err.message,
      });
      throw err;
    } finally {
      // Every span must be ended or it will not be exported
      span.end();
    }
  }

  // @Cron('45 * * * * *')
  // handleCron() {
  //   this.logger.debug('Called when the current second is 45');
  // }
}
