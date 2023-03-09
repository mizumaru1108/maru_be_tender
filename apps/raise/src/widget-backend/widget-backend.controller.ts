import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import axios from 'axios';
import { stringify } from 'querystring';
import { CreateWidgetBackendDto } from './dto/create-widget-backend.dto';
import { WidgetBackendService } from './widget-backend.service';

@Controller('widget-backend')
export class WidgetBackendController {
  constructor(private readonly widgetBackendService: WidgetBackendService) {}

  @Post('donation/add')
  async create(@Body() donationData: any) {
    console.log('widget-backend', donationData);
    const paymentData: any = {
      amount: donationData.donationAmount,
      currency: donationData.currency,
      description: donationData.description,
      token: donationData.token,
    };
    const chargeDetails = await StripePayment(paymentData);
    if (chargeDetails != false && chargeDetails.status == 'succeeded') {
      delete donationData['token'];
      donationData['receipt_link'] = chargeDetails.receipt_url;
      donationData['paymentStatus'] = chargeDetails.status;
      donationData['country'] = chargeDetails.source.country;
      console.log('updated paymentdata', paymentData);
      return this.widgetBackendService.create(donationData);
    } else {
      return {
        status: 400,
        header: {
          'Access-Control-Allow-Origin': '*',
        },
        body: {
          message: 'Payment transaction failed',
        },
      };
    }
  }

  @Get()
  findAll() {
    return this.widgetBackendService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.widgetBackendService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWidgetBackendDto: CreateWidgetBackendDto,
  ) {
    return this.widgetBackendService.update(+id, updateWidgetBackendDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.widgetBackendService.remove(+id);
  }
}

const StripePayment = async (chargeDetails: any) => {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Bearer sk_test_4eC39HqLyjWDarjtT1zdp7dc',
  };
  console.log('stripe payment param', chargeDetails);
  const chargeData = {
    amount: chargeDetails.amount * 100,
    currency: chargeDetails.currency,
    description: chargeDetails.description,
    source: chargeDetails.token,
  };

  try {
    const result = await axios.post(
      'https://api.stripe.com/v1/charges',
      stringify(chargeData),
      { headers: headers },
    );
    return result.data;
  } catch (error) {
    console.log('catch error', error);
    return false;
  }
};
