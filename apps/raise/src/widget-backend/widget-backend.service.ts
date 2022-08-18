import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWidgetBackendDto } from './dto/create-widget-backend.dto';
import { Donation, DonationDocument } from './schemas/donation-data.schema';

@Injectable()
export class WidgetBackendService {

  constructor(
    @InjectModel(Donation.name)
    private donationModel: Model<DonationDocument>
  ) { }

  async create(donationData: any) {
    // const checkDonor = await this.donationModel.findOne({
    //   donorEmail: donationData.donorEmail
    // })

    // if (checkDonor) {
    try {
      await this.donationModel.create(donationData);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          data: donationData.receiption_link,
          message: "Donation created successfully."
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: "Donation failed"
        }),
      };
    }
    // }
    return 'This action adds a new widgetBackend';
  }

  findAll() {
    return `This action returns all widgetBackend`;
  }

  findOne(id: number) {
    return `This action returns a #${id} widgetBackend`;
  }

  update(id: number, updateWidgetBackendDto: CreateWidgetBackendDto) {
    return `This action updates a #${id} widgetBackend`;
  }

  remove(id: number) {
    return `This action removes a #${id} widgetBackend`;
  }
}
