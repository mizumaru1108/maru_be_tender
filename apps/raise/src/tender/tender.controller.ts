import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TenderService } from './tender.service';
import { UploadFileDto } from './dto';
import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import {
  AnyFilesInterceptor,
  FilesInterceptor,
} from '@webundsoehne/nest-fastify-file-upload';

@Controller('tender')
export class TenderController {
  constructor(private service: TenderService) {}

  @UseInterceptors(AnyFilesInterceptor())
  @Post('uploads')
  upload(@Body() body: any, @UploadedFiles() file: MulterFile[]) {
    console.log('body', body);
    console.log('body', JSON.stringify(body));
    console.log('file', file);
  }
}
