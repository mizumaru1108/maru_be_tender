import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { execute } from 'graphql';
import { nanoid } from 'nanoid';
import { type } from 'os';
import { async } from 'rxjs';
import { AdvertisementEntity } from 'src/advertisements/entities/advertisement.entity';
import {
  AdvertisementCreateProps,
  AdvertisementRepository,
} from 'src/advertisements/repositories/advertisement.repository';
import { AdvertisementTypeEnum } from 'src/advertisements/types/enums/advertisement.type.enum';
import { FileMimeTypeEnum } from 'src/commons/enums/file-mimetype.enum';
import { envLoadErrorHelper } from 'src/commons/helpers/env-loaderror-helper';
import { validateFileExtension } from 'src/commons/utils/validate-allowed-extension';
import { validateFileSize } from 'src/commons/utils/validate-file-size';
import { BunnyService } from 'src/libs/bunny/services/bunny.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadFilesJsonbDto } from 'src/tender-commons/dto/upload-files-jsonb.dto';
import { PayloadErrorException } from 'src/tender-commons/exceptions/payload-error.exception';
import { generateFileName } from 'src/tender-commons/utils/generate-filename';
import { FileManagerEntity } from 'src/tender-file-manager/entities/file-manager.entity';
import {
  CreateFileManagerProps,
  TenderFileManagerRepository,
} from 'src/tender-file-manager/repositories/tender-file-manager.repository';
import { TenderCurrentUser } from 'src/tender-user/user/interfaces/current-user.interface';
import { v4 as uuidv4 } from 'uuid';
export class AdvertisementCreateCommand {
  current_user: TenderCurrentUser;
  content: string;
  title: string;
  track_id?: string;
  type: AdvertisementTypeEnum;
  date: Date;
  start_time: string;
  logos?: Express.Multer.File[];
}

export class AdvertisementCreateCommandResult {
  @ApiProperty()
  advertisement: AdvertisementEntity;

  @ApiProperty({ type: () => Array<FileManagerEntity> || [] })
  created_file_managers: FileManagerEntity[] | [];
}

@CommandHandler(AdvertisementCreateCommand)
export class AdvertisementCreateHandler
  implements
    ICommandHandler<
      AdvertisementCreateCommand,
      AdvertisementCreateCommandResult
    >
{
  private readonly appEnv: string;
  constructor(
    private readonly bunnyService: BunnyService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly adsRepo: AdvertisementRepository,
    private readonly fileManagerRepo: TenderFileManagerRepository,
  ) {
    const environment = this.configService.get('APP_ENV');
    if (!environment) envLoadErrorHelper('APP_ENV');
    this.appEnv = environment;
  }

  async uploadLogoInterceptor(
    file: Express.Multer.File,
    uploadPath: string,
    AllowedFileTypes: FileMimeTypeEnum[],
    maxSize: number = 1024 * 1024 * 10, // 10 mb by default
  ) {
    try {
      const fileName = generateFileName(
        file.originalname,
        file.mimetype as FileMimeTypeEnum,
      );

      validateFileExtension(file.mimetype, AllowedFileTypes, file.originalname);
      validateFileSize(file.size, maxSize, file.originalname);

      const imageUrl = await this.bunnyService.uploadBase64(
        fileName,
        file.buffer,
        uploadPath + `/${fileName}`,
      );

      const fileObj: UploadFilesJsonbDto = {
        url: imageUrl,
        type: file.mimetype,
        size: file.size,
      };

      return {
        name: fileName,
        ...fileObj,
      };
    } catch (error) {
      throw error;
    }
  }

  async execute(
    command: AdvertisementCreateCommand,
  ): Promise<AdvertisementCreateCommandResult> {
    let fileManagerPayload: CreateFileManagerProps[] = [];
    try {
      const { type, logos, track_id } = command;
      if (type === AdvertisementTypeEnum.EXTERNAL && logos === undefined) {
        throw new PayloadErrorException('Logo is Required!');
      }

      if (type === AdvertisementTypeEnum.INTERNAL && track_id === undefined) {
        throw new PayloadErrorException(
          'Track id is required when creating an internal ads!',
        );
      }

      const adsPayloads = Builder<AdvertisementCreateProps>(
        AdvertisementCreateProps,
        {
          id: nanoid(),
          content: command.content,
          title: command.title,
          type: command.type,
          track_id: command.track_id,
          date: command.date,
          start_time: command.start_time,
        },
      ).build();

      if (logos !== undefined && logos.length > 0) {
        for (const logo of logos) {
          const uploadRes = await this.uploadLogoInterceptor(
            logo,
            `tmra/${this.appEnv}/organization/tender-management/advertisements`,
            [FileMimeTypeEnum.JPEG, FileMimeTypeEnum.JPG, FileMimeTypeEnum.PNG],
            1024 * 1024 * 30,
          );

          fileManagerPayload.push({
            id: uuidv4(),
            user_id: command.current_user.id,
            name: uploadRes.name,
            mimetype: uploadRes.type,
            size: uploadRes.size,
            url: uploadRes.url,
            column_name: 'logo',
            table_name: 'advertisements',
            advertisement_id: adsPayloads.id,
          });

          const tmpUploaded = {
            url: uploadRes.url,
            size: uploadRes.size,
            type: uploadRes.type,
          };

          if (adsPayloads.logo === undefined) {
            adsPayloads.logo = [tmpUploaded];
          } else {
            adsPayloads.logo.push(tmpUploaded);
          }
        }
      }

      const result = await this.prismaService.$transaction(async (tx) => {
        const session = tx instanceof PrismaService ? tx : this.prismaService;
        const createdAds = await this.adsRepo.create(adsPayloads, session);

        const createdFileManagers: FileManagerEntity[] = [];
        if (fileManagerPayload.length > 0) {
          for (const file of fileManagerPayload) {
            createdFileManagers.push(
              await this.fileManagerRepo.create(file, session),
            );
          }
        }

        return {
          advertisement: createdAds,
          created_file_managers: createdFileManagers,
        };
      });

      return {
        advertisement: result.advertisement,
        created_file_managers: result.created_file_managers,
      };
    } catch (error) {
      if (fileManagerPayload.length > 0) {
        for (const file of fileManagerPayload) {
          await this.bunnyService.deleteMedia(file.url, true);
        }
      }
      throw error;
    }
  }
}
