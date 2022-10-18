import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { extname } from 'path';
import { Http } from 'winston/lib/winston/transports';
import { AllowedFileType } from '../commons/enums/allowed-filetype.enum';
import { envLoadErrorHelper } from '../commons/helpers/env-loaderror-helper';
import { BaseHashuraWebhookPayload } from '../commons/interfaces/base-hashura-webhook-payload';
import { BunnyService } from '../libs/bunny/services/bunny.service';
import { PrismaService } from '../prisma/prisma.service';
import { UploadFilesDto } from './dto/upload-files.dto';

@Injectable()
export class TenderService {
  private appEnv: string;
  constructor(
    private readonly bunnyService: BunnyService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const environment = this.configService.get('APP_ENV');
    if (!environment) envLoadErrorHelper('APP_ENV');
    this.appEnv = environment;
  }

  async uploadFiles(payload: UploadFilesDto, files: MulterFile[]) {
    const maxSize: number = 1024 * 1024 * 1; // 1MB
    const allowedType: AllowedFileType[] = [
      AllowedFileType.JPG,
      AllowedFileType.JPEG,
      AllowedFileType.PNG,
      AllowedFileType.PDF,
      AllowedFileType.DOC,
      AllowedFileType.DOCX,
      AllowedFileType.XLS,
      AllowedFileType.XLSX,
    ];
    let uploadedFileLinks: string = 'Uploaded file links: \n';
    try {
      const processFiles = files.map(async (file, index) => {
        const path = payload.optionalFolderPath
          ? `tmra/${this.appEnv}/organization/tender-management` +
            `/${payload.userId}/${payload.optionalFolderPath}`
          : `tmra/${this.appEnv}/organization/tender-management` +
            `/${payload.userId}/proposal-files`;

        const uploaded = await this.bunnyService.uploadFile(
          file,
          allowedType,
          maxSize,
          'Tender Management Uploading Files',
          true,
          path,
        );
        // if (!uploaded) {
        //   throw new BadRequestException('Failed to upload file!');
        // }
        // console.log('uploaded', uploaded);
        if (uploaded) uploadedFileLinks += `[${index}] ${uploaded} \n`;
      });
      await Promise.all(processFiles);
      return uploadedFileLinks;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /* denactive client data after editing request*/
  async postCreateEditingRequest(request: BaseHashuraWebhookPayload) {
    console.log('id', request.event.session_variables['x-hasura-user-id']);
    const user = await this.prismaService.user.findUnique({
      where: {
        id: request.event.session_variables['x-hasura-user-id'],
      },
    });

    console.log('user', user);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const client = await this.prismaService.client_data.findFirstOrThrow({
      where: {
        email: user.email,
      },
    });

    const result = await this.prismaService.client_data.update({
      where: { id: client.id },
      data: {
        client_status: {
          update: {
            id: 'WAITING_FOR_EDITING_APPROVAL',
            title: 'Waiting for editing approval',
          },
        },
      },
    });

    if (!result) {
      throw new Error('something went wrong when updating client data');
    }
    console.log('result', result);
    return result;
  }
}
