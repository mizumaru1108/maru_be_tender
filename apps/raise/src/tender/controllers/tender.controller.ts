import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
// import { AnyFilesInterceptor } from '@webundsoehne/nest-fastify-file-upload';
// import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { BaseHashuraWebhookPayload } from '../../commons/interfaces/base-hashura-webhook-payload';

import { CommandBus } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import { baseResponseHelper } from 'src/commons/helpers/base-response-helper';
import {
  DiscordWebhookSendToChannelCommand,
  DiscordWebhookSendToChannelCommandResult,
} from 'src/libs/discord/commands/webhook.send.to.channel/send.to.channel.command';
import { PayloadErrorException } from 'src/tender-commons/exceptions/payload-error.exception';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { TenderJwtGuard } from '../../tender-auth/guards/tender-jwt.guard';
import { TenderService } from '../services/tender.service';

@Controller('tender')
export class TenderController {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderController.name,
  });

  constructor(
    private readonly commandBus: CommandBus,
    private tenderService: TenderService,
  ) {}

  // @UseInterceptors(AnyFilesInterceptor())
  // @Post('uploads') // tender/uploads
  // async upload(
  //   @Body() payload: UploadFilesDto,
  //   @UploadedFiles() file: MulterFile[],
  // ): Promise<BaseResponse<string>> {
  //   if (!file) throw new BadRequestException();
  //   const uploadResult = await this.tenderService.uploadFiles(payload, file);
  //   return baseResponseHelper(
  //     uploadResult,
  //     HttpStatus.CREATED,
  //     'Successfully uploaded files',
  //   );
  // }

  tenderControllerErrorMapper(error: any) {
    if (error instanceof PayloadErrorException) {
      return new BadRequestException(error.message);
    }
    return new InternalServerErrorException(error);
  }

  @Post('fusion-auth/hook/delete-user')
  async deleteUserHook(@Body() payload: any) {
    // example data can be seen here
    // https://fusionauth.io/docs/v1/tech/events-webhooks/events/user-delete-complete
    // console.log(logUtil(payload));
    try {
      const embed = [
        {
          fields: [
            {
              name: 'email',
              value: payload.event.user.email
                ? JSON.stringify(payload.event.user.email)
                : '',
            },
            {
              name: 'tenant id',
              value: payload.event.tenantId
                ? JSON.stringify(payload.event.tenantId)
                : '',
            },
            {
              name: 'user_id',
              value: payload.event.user.id
                ? JSON.stringify(payload.event.user.id)
                : '',
            },
            {
              name: 'registrations',
              value: payload.event.user.registrations
                ? JSON.stringify(payload.event.user.registrations)
                : '',
            },
            {
              name: 'access from ip',
              value: payload.event.info.ipAddress
                ? JSON.stringify(payload.event.info.ipAddress)
                : '',
            },
            {
              name: 'access from user agent',
              value: payload.event.info.userAgent
                ? JSON.stringify(payload.event.info.userAgent)
                : '',
            },
          ],
        },
      ];

      const command = Builder<DiscordWebhookSendToChannelCommand>(
        DiscordWebhookSendToChannelCommand,
        {
          content: 'User Delete Events Triggred!',
          embed: embed,
        },
      ).build();

      const result = await this.commandBus.execute<
        DiscordWebhookSendToChannelCommand,
        DiscordWebhookSendToChannelCommandResult
      >(command);

      return baseResponseHelper(
        result,
        HttpStatus.OK,
        'Send notif to discord success!',
      );
    } catch (e) {
      throw this.tenderControllerErrorMapper(e);
    }
  }

  @Post('edit-request-hook-handler')
  async postEditRequest(@Body() payload: BaseHashuraWebhookPayload) {
    // this.logger.info('payload: ' + { payload: JSON.stringify(payload) });
    // this.logger.info('payload data: ' + JSON.stringify(payload.event.data));
    const response = await this.tenderService.postCreateEditingRequest(payload);
    // this.logger.info('Response: ', { response: JSON.stringify(response) });
    return response;
  }

  // @Post('follow-up-role-hook-handler')
  // async postRecommendedSupport(@Body() payload: BaseHashuraWebhookPayload) {
  //   console.log('payload: ', payload);
  //   console.log('payload: ', payload.event.data);
  //   const response = await this.tenderService.postInsertFollowUp(payload);
  //   return response;
  //   // this.logger.info('payload: ' + { payload: JSON.stringify(payload) });
  //   // this.logger.info('payload data: ' + JSON.stringify(payload.event.data));
  //   // const response = await this.tenderService.postCreateEditingRequest(payload);
  //   // this.logger.info('Response: ', { response: JSON.stringify(response) });
  //   // return response;
  // }

  @UseGuards(TenderJwtGuard)
  @Post('twilio-test')
  async twilioTest(
    @Body('phone_number') phoneNumber: string[],
    @Body('message') message: string,
  ) {
    return await this.tenderService.test(phoneNumber, message);
  }

  @UseGuards(TenderJwtGuard)
  @Post('msegat-test')
  async msegatTest(
    @Body('phone_number') phoneNumber: string[],
    @Body('message') message: string,
  ) {
    return await this.tenderService.testMsegat(phoneNumber, message);
  }

  @UseGuards(TenderJwtGuard)
  @Post('msegat-otp-test')
  async msegatOtpTest(@Body('phone_number') phoneNumber: string[]) {
    return await this.tenderService.testOtp(phoneNumber);
  }

  @UseGuards(TenderJwtGuard)
  @Post('msegat-verify-otp-test')
  async msegatVerifyOtpTest(
    @Body('phone_number') phoneNumber: string[],
    @Body('message') message: string,
  ) {
    return await this.tenderService.testMsegat(phoneNumber, message);
  }
}
