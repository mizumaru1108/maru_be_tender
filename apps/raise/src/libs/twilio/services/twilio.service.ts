import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { envLoadErrorHelper } from '../../../commons/helpers/env-loaderror-helper';
import { SendSmsDto } from '../dtos/requests/send-sms.dto';

/**
 * Nest Twilio Module
 * @author RDanang (Iyoy!)
 */
@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);
  private accountSid: string;
  private authToken: string;
  private twilioNumber: string;
  private client: Twilio;

  constructor(private configService: ConfigService) {
    this.accountSid = this.configService.get(
      'twilioConfig.accountSid',
    ) as string;
    // console.log('this.accountSid', this.accountSid);

    this.authToken = this.configService.get('twilioConfig.authToken') as string;
    // console.log('this.authToken', this.authToken);

    this.twilioNumber = this.configService.get(
      'twilioConfig.twilioNumber',
    ) as string;
    // console.log('this.twilioNumber', this.twilioNumber);

    this.client = new Twilio(this.accountSid, this.authToken);
  }

  async sendSMSAsync(payload: SendSmsDto) {
    try {
      const response = await this.client.messages.create({
        from: payload.from || this.twilioNumber,
        to: payload.to,
        body: payload.body,
      });
      console.log('response', response);
      return response;
    } catch (err) {
      this.logger.error('Error occured when sending message: ', err);
      throw err;
    }
  }

  sendSMS(payload: SendSmsDto) {
    this.client.messages.create({
      from: payload.from || this.twilioNumber,
      to: payload.to,
      body: payload.body,
    });
  }
}
