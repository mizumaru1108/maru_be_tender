import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { UploadFileDto } from "./dto";
import { BunnyService } from "../libs/bunny/services/bunny.service";

@Injectable()
export class TenderService {
  constructor(private readonly bunnyService: BunnyService) { }

  async upload(body: UploadFileDto) {
    const { base64Data, fileName, filePrefix, fileExtension, path } = body;

    if (path! && base64Data!) {
      try {
        const isExist = await this.bunnyService.checkIfImageExists(
          path!,
        );
        console.log('exist', isExist);

        if (isExist) {
          const del = await this.bunnyService.deleteImage(path!);
          if (del) {
            console.info('File deleted');
          }
        }
      } catch (error) {
        throw new BadRequestException(
          'Failed to delete file'
        );
      }
    }

    let pathFile: string = '';
    try {
      pathFile = await this.bunnyService.generatePath(
        fileName,
        'tender-file',
        filePrefix!,
        fileExtension!,
        'tender',
      );
    } catch (error) {
      console.info('Have found same problem create path', error);
    }

    let binary;
    try {
      binary = Buffer.from(base64Data!, 'base64');
    } catch (error) {
      console.info('Have found same problem', error);
    }
    if (!binary) {
      const trimmedString = 56;
      base64Data.length > 40
        ? base64Data.substring(0, 40 - 3) + '...'
        : base64Data.substring(0, length);
      throw new BadRequestException(
        `file or Image payload photo is not a valid base64 data: ${trimmedString}`,
      );
    }

    let fileUpload;
    try {
      fileUpload = await this.bunnyService.uploadImage(
        pathFile,
        binary,
        'tender-file',
      );
    } catch (error) {
      console.info('Have found same problem', error);
    }
    return {
      statusCode: 200,
      message: 'Upload file success',
      data: fileUpload,
      pathFile
    };

  }
}
