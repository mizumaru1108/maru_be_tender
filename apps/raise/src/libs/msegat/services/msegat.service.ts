import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { SendSmsDto } from '../dtos/requests';
import { MsegatSendSmsDto } from '../dtos/requests/msegat-send-sms.dto';
import { MsegatSendingMessageError } from '../exceptions/send.message.error.exceptions';
import { ROOT_LOGGER } from '../../root-logger';

/**
 * Nest Msegat Module
 * Docs: https://msegat.docs.apiary.io/#
 * @author RDanang (Iyoy!)
 */
@Injectable()
export class MsegatService {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': MsegatService.name,
  });

  constructor(private configService: ConfigService) {}

  /**
   * Send sms
   * ref: https://msegat.docs.apiary.io/#/reference/operations/send-sms
   */
  async sendSMSAsync(request: SendSmsDto) {
    const { numbers, msg } = request;
    this.logger.log('info', `Sending sms to ${numbers}`);

    const payload: MsegatSendSmsDto = {
      userName: this.configService.get('mseGatConfig.username') as string,
      numbers,
      userSender: this.configService.get('mseGatConfig.userSender') as string,
      apiKey: this.configService.get('mseGatConfig.apiKey') as string,
      msg,
    };

    const axiosOptions: AxiosRequestConfig<any> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      url: 'https://www.msegat.com/gw/sendsms.php',
      data: payload,
    };
    try {
      const response = await axios(axiosOptions);
      // this.logger.log('info', `Response: ${response.data}`);
      return response;
    } catch (error) {
      this.logger.error('Error', error);
      throw new MsegatSendingMessageError(numbers);
    }
  }

  async sendSMS(request: SendSmsDto) {
    const { numbers, msg } = request;
    this.logger.log('info', `Sending sms to ${numbers}`);

    const payload: MsegatSendSmsDto = {
      userName: this.configService.get('mseGatConfig.username') as string,
      numbers,
      userSender: this.configService.get('mseGatConfig.userSender') as string,
      apiKey: this.configService.get('mseGatConfig.apiKey') as string,
      msg,
    };

    const axiosOptions: AxiosRequestConfig<any> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      url: 'https://www.msegat.com/gw/sendsms.php',
      data: payload,
    };
    try {
      const response = axios(axiosOptions);
      return response;
    } catch (error) {
      this.logger.debug('Error', error);
      throw error;
    }
  }
}
