import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFiles,
  Param,
  Res,
  UploadedFile,
} from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor,
  AnyFilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // @Get()
  // getHello(): string {
  //   return this.uploadService.getHello();
  // }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: any) {
    console.log(file);
  }

  @Post('upload/array')
  @UseInterceptors(FilesInterceptor('files'))
  uploadeFiles(@UploadedFiles() files: any) {
    console.log(files);
  }

  @Post('upload/multiple')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'background', maxCount: 1 },
    ]),
  )
  uploadMultipleFiles(@UploadedFiles() files: any) {
    console.log(files);
  }

  @Post('upload/anyfiles')
  @UseInterceptors(AnyFilesInterceptor())
  uploadAnyFiles(@UploadedFiles() files: any) {
    console.log(files);
  }

  @Get(':filepath')
  seeUploadedFile(@Param('filepath') file: any, @Res() res: any) {
    return res.sendFile(file, { root: 'uploads' });
  }
}
