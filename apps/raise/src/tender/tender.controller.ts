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
import { BaseResponse } from '../commons/dtos/base-response';
import { baseResponseHelper } from '../commons/helpers/base-response-helper';
import { BaseHashuraWebhookPayload } from '../commons/interfaces/base-hashura-webhook-payload';
import { UploadFilesDto } from './dto/upload-files.dto';
import { TenderService } from './tender.service';

@Controller('tender')
export class TenderController {
  constructor(private tenderService: TenderService) {}

  @UseInterceptors(AnyFilesInterceptor())
  @Post('uploads')
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
    console.log('payload', payload);
    console.log('payload data', JSON.stringify(payload.event.data));
    const response = await this.tenderService.postCreateEditingRequest(payload);
    console.log(response);
  }
}
