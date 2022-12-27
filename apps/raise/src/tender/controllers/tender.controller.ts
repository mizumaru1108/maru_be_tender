import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@webundsoehne/nest-fastify-file-upload';
import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { BaseResponse } from '../../commons/dtos/base-response';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { BaseHashuraWebhookPayload } from '../../commons/interfaces/base-hashura-webhook-payload';
import { UploadFilesDto } from '../../tender-commons/dto/upload-files.dto';

import { ROOT_LOGGER } from '../../libs/root-logger';
import { TenderService } from '../services/tender.service';

@Controller('tender')
export class TenderController {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderController.name,
  });

  constructor(private tenderService: TenderService) {}

  @UseInterceptors(AnyFilesInterceptor())
  @Post('uploads') // tender/uploads
  async upload(
    @Body() payload: UploadFilesDto,
    @UploadedFiles() file: MulterFile[],
  ): Promise<BaseResponse<string>> {
    if (!file) throw new BadRequestException();
    const uploadResult = await this.tenderService.uploadFiles(payload, file);
    return baseResponseHelper(
      uploadResult,
      HttpStatus.CREATED,
      'Successfully uploaded files',
    );
  }

  @Post('edit-request-hook-handler')
  async postEditRequest(@Body() payload: BaseHashuraWebhookPayload) {
    // this.logger.info('payload: ' + { payload: JSON.stringify(payload) });
    // this.logger.info('payload data: ' + JSON.stringify(payload.event.data));
    const response = await this.tenderService.postCreateEditingRequest(payload);
    // this.logger.info('Response: ', { response: JSON.stringify(response) });
    return response;
  }

  @Post('follow-up-role-hook-handler')
  async postRecommendedSupport(@Body() payload: BaseHashuraWebhookPayload) {
    console.log('payload: ', payload);
    console.log('payload: ', payload.event.data);
    const response = await this.tenderService.postInsertFollowUp(payload);
    return response;
    // this.logger.info('payload: ' + { payload: JSON.stringify(payload) });
    // this.logger.info('payload data: ' + JSON.stringify(payload.event.data));
    // const response = await this.tenderService.postCreateEditingRequest(payload);
    // this.logger.info('Response: ', { response: JSON.stringify(response) });
    // return response;
  }
}
