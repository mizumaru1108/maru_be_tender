import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import moment from 'moment';
import { BannerEntity } from 'src/banners/entities/banner.entity';
import {
  BannerRepository,
  BannerUpdateProps,
} from 'src/banners/repositories/banner.repository';
import { BannerTypeEnum } from 'src/banners/types/enums/banner.type.enum';
import { FileMimeTypeEnum } from 'src/commons/enums/file-mimetype.enum';
import { envLoadErrorHelper } from 'src/commons/helpers/env-loaderror-helper';
import { validateFileExtension } from 'src/commons/utils/validate-allowed-extension';
import { validateFileSize } from 'src/commons/utils/validate-file-size';
import { BunnyService } from 'src/libs/bunny/services/bunny.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadFilesJsonbDto } from 'src/tender-commons/dto/upload-files-jsonb.dto';
import { DataNotFoundException } from 'src/tender-commons/exceptions/data-not-found.exception';
import { generateFileName } from 'src/tender-commons/utils/generate-filename';
import {
  CreateFileManagerProps,
  TenderFileManagerRepository,
} from 'src/tender-file-manager/repositories/tender-file-manager.repository';
import { TenderCurrentUser } from 'src/tender-user/user/interfaces/current-user.interface';
import { v4 as uuidv4 } from 'uuid';

export class BannerUpdateCommand {
  id: string;
  current_user: TenderCurrentUser;
  content?: string;
  title?: string;
  track_id?: string;
  expired_date?: Date;
  expired_time?: string;
  expired_at?: number;
  logos?: Express.Multer.File[];
  deleted_logo_urls?: string[];
}

export class BannerUpdateCommandResult {
  advertisement: BannerEntity;
  deleted_file_urls: string[] | undefined;
  created_file_manager: CreateFileManagerProps[];
}

@CommandHandler(BannerUpdateCommand)
export class BannerUpdateHandler
  implements ICommandHandler<BannerUpdateCommand, BannerUpdateCommandResult>
{
  private readonly appEnv: string;
  constructor(
    private readonly bunnyService: BunnyService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly adsRepo: BannerRepository,
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

      const imageUrl = await this.bunnyService.uploadBufferToBunny(
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
    command: BannerUpdateCommand,
  ): Promise<BannerUpdateCommandResult> {
    const { id, logos, deleted_logo_urls } = command;
    let fileManagerPayload: CreateFileManagerProps[] = [];
    try {
      const ads = await this.adsRepo.findById(id);
      if (!ads) {
        throw new DataNotFoundException(`Ads with id of ${id} not found!`);
      }

      // const date = command.expired_date || ads.expired_date;
      // const time = command.expired_time || ads.expired_time;

      // // Parse expired_date in ISO 8601 format (YYYY-MM-DD)
      // const expiredDate = moment(date, 'YYYY-MM-DD');

      // // Parse expired_time in 12-hour format with AM/PM
      // const expiredTime = moment(time, 'hh:mm A');

      // // Combine the date and time for comparison
      // const expiredDateTime = moment(expiredDate).set({
      //   hour: expiredTime.get('hour'),
      //   minute: expiredTime.get('minute'),
      //   second: expiredTime.get('second'),
      // });

      // const epoch = expiredDateTime.unix();

      const updatePayload = Builder<BannerUpdateProps>(BannerUpdateProps, {
        id: command.id,
        content: command.content,
        title: command.title,
        track_id: command.track_id,
        expired_date: command.expired_date,
        expired_time: command.expired_time,
        expired_at: command.expired_at,
      }).build();

      if (ads.type === BannerTypeEnum.EXTERNAL && logos !== undefined) {
        // upload the logo
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
            advertisement_id: command.id,
          });

          const tmpUploaded = {
            url: uploadRes.url,
            size: uploadRes.size,
            type: uploadRes.type,
          };

          if (updatePayload.logo === undefined) {
            updatePayload.logo = [tmpUploaded];
          } else {
            updatePayload.logo.push(tmpUploaded);
          }
        }
      }

      const result = await this.prismaService.$transaction(async (tx) => {
        const session = tx instanceof PrismaService ? tx : this.prismaService;
        const updatedAds = await this.adsRepo.update(updatePayload, session);

        if (fileManagerPayload.length > 0) {
          for (const file of fileManagerPayload) {
            await this.fileManagerRepo.create(file, session);
          }
        }

        // if there's deleted url then it gonna be marked as deleted (is_deleted = true)
        if (deleted_logo_urls) {
          for (const url of deleted_logo_urls) {
            await this.fileManagerRepo.update({
              url,
              is_deleted: true,
            });
          }
        }

        return {
          advertisement: updatedAds,
          created_file_manager: fileManagerPayload,
          deleted_file_manager: deleted_logo_urls,
        };
      });

      return {
        advertisement: result.advertisement,
        deleted_file_urls: deleted_logo_urls,
        created_file_manager: result.created_file_manager,
      };
    } catch (error) {
      throw error;
    }
  }
}
