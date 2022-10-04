import { HttpException, Injectable } from '@nestjs/common';
import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { extname } from 'path';
import { AllowedFileType } from '../commons/enums/allowed-filetype.enum';
import { BunnyService } from '../libs/bunny/services/bunny.service';

@Injectable()
export class TenderService {
  constructor(private readonly bunnyService: BunnyService) {}

  async upload(files: MulterFile[]) {
    const maxSize: number = 1024 * 1024 * 1; // 1MB
    const allowedType: AllowedFileType[] = [
      AllowedFileType.PDF,
      AllowedFileType.JPG,
      AllowedFileType.JPEG,
      AllowedFileType.PNG,
      AllowedFileType.MP4,
    ];
    console.log(files);

    try {
      const processFiles = files.map(async (file, index) => {
        // split fiilename and extension use extname
        const fileExtName = extname(file.originalname);
        const name = file.originalname.split(fileExtName)[0]; // get the name and remove the extension.

        let path = await this.bunnyService.generatePath(
          'tender-management',
          `proposal-files/replaceWithUserNanoId`,
          name,
          fileExtName,
        );

        const uploaded = await this.bunnyService.uploadFile(
          file,
          allowedType,
          maxSize,
          'Testing Upload',
          true,
          path,
        );
        path = uploaded;
        // the link will be on the path variable
      });

      return Promise.all(processFiles);
    } catch (error) {
      console.log(error);
    }
  }
}
