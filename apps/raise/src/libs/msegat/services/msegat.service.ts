import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { SendSmsDto } from '../dtos/requests';
import { MsegatSendSmsDto } from '../dtos/requests/msegat-send-sms.dto';
import { MsegatSendingMessageError } from '../exceptions/send.message.error.exceptions';
import { ROOT_LOGGER } from '../../root-logger';
import { VerifyOtpDto } from 'src/libs/msegat/dtos/requests/verify.otp.dto';
import { SendOtpDto } from 'src/libs/msegat/dtos/requests/send.otp.dto';

/**
 * Nest Msegat Module
 * Docs: https://msegat.docs.apiary.io/#
 * @author RDanang (Iyoy!)
 */

export class MsegatSendOtpProps {
  lang: 'Ar' | 'En';
  userName: string;
  number: string;
  apiKey: string;
  userSender: string;
}

export class MsegatVerifyOtpProps {
  lang: 'Ar' | 'En';
  userName: string;
  apiKey: string;
  code: string;
  id: string;
  userSender: string;
}
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

  //ref https://msegat.docs.apiary.io/#/reference/operations/send-otp-code
  async sendOtp(request: SendOtpDto) {
    const { number } = request;
    this.logger.log('info', `Sending otp to ${number}`);

    const payload: MsegatSendOtpProps = {
      lang: 'Ar',
      userName: this.configService.get('mseGatConfig.username') as string,
      number,
      userSender: this.configService.get('mseGatConfig.userSender') as string,
      apiKey: this.configService.get('mseGatConfig.apiKey') as string,
    };

    const axiosOptions: AxiosRequestConfig<any> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      url: 'https://www.msegat.com/gw/sendOTPCode.php',
      data: payload,
    };

    try {
      const response = await axios(axiosOptions);
      // this.logger.log('info', `Response: ${response.data}`);
      // it will return an id (it will be required for verify)
      return response;
    } catch (error) {
      this.logger.error('Error', error);
      throw error;
    }
  }

  async verifyOtp(request: VerifyOtpDto) {
    const payload: MsegatVerifyOtpProps = {
      userName: this.configService.get('mseGatConfig.username') as string,
      userSender: this.configService.get('mseGatConfig.userSender') as string,
      apiKey: this.configService.get('mseGatConfig.apiKey') as string,
      lang: request.lang || 'Ar',
      code: request.code,
      id: request.id,
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
      throw error;
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
