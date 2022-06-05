import {
  Body,
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UploadService } from './upload.service';
import { SampleDto } from './sample.dto';

@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

    // @UseInterceptors(FileInterceptor('file'))
  // @Post('file')
  // uploadFile(
  //   @Body() body: SampleDto,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   return {
  //     body,
  //     file: file.buffer.toString(),
  //   };
  // }

 @Post('upload')
 @UseInterceptors(AnyFilesInterceptor())
 uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
  console.log(files);
 }


}

