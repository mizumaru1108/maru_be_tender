import { Body, Controller, Post, UploadedFiles, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FilesInterceptor, AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { TenderService } from './tender.service';
import { UploadFileDto } from './dto';

@Controller('tender')
export class TenderController {
  constructor(private service: TenderService) { }

  @ApiOperation({ summary: 'Uploading Files' })
  @ApiResponse({
    status: 201,
    description: 'Uploaded Success!',
  })
  @Post('upload')
  upload(@Body() body: UploadFileDto) {
    return this.service.upload(body);
  }

  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    try {
      console.log(file, body);
    } catch (error) {
      console.log(error);
    }
  }

  @Post('uploads')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'file', maxCount: 1 },
    { name: 'img', maxCount: 1 },
  ]))
  uploadFiles(@UploadedFiles() files: { file?: Express.Multer.File[], img?: Express.Multer.File[] }) {
    try {

      console.log(files);
    } catch (error) {
      console.log(error);
    }
  }
}
