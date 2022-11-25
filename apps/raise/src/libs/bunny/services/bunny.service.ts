import {
  Logger,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import axios, { AxiosRequestConfig } from 'axios';
import { AllowedFileType } from '../../../commons/enums/allowed-filetype.enum';
import { envLoadErrorHelper } from '../../../commons/helpers/env-loaderror-helper';
import { generateRandomNumberString } from '../../../commons/utils/generate-random-string';
import { sanitizeString } from '../../../commons/utils/sanitize-string';
import { uploadFileNameParser } from '../../../commons/utils/upload-filename-parser';
import { validateAllowedExtension } from '../../../commons/utils/validate-allowed-extension';
import { validateFileSize } from '../../../commons/utils/validate-file-size';
/**
 * Nest Bunny Module
 * @author RDanang (Iyoy!)
 */
@Injectable()
export class BunnyService {
  private readonly logger = new Logger(BunnyService.name);
  private appEnv: string;
  private urlMedia: string;
  private accessKey: string;
  private cdnUrl: string;

  constructor(private configService: ConfigService) {
    const environment = this.configService.get('APP_ENV');
    if (!environment) envLoadErrorHelper('APP_ENV');
    this.appEnv = environment;

    const bunnyMediaUrl = this.configService.get('BUNNY_STORAGE_URL_MEDIA');
    if (!bunnyMediaUrl) envLoadErrorHelper('BUNNY_STORAGE_URL_MEDIA');
    this.urlMedia = bunnyMediaUrl;

    const bunnyAccessKey = this.configService.get(
      'BUNNY_STORAGE_ACCESS_KEY_MEDIA',
    );
    if (!bunnyAccessKey) envLoadErrorHelper('BUNNY_STORAGE_ACCESS_KEY_MEDIA');
    this.accessKey = bunnyAccessKey;

    const bunnyCdnUrl = this.configService.get('BUNNY_CDN_URL_MEDIA');
    if (!bunnyCdnUrl) envLoadErrorHelper('BUNNY_CDN_URL_MEDIA');
    this.cdnUrl = bunnyCdnUrl;
  }

  async generatePath(
    organizationId: string,
    folderType: string,
    imageFullName: string,
    extension: string,
    spesificId?: string,
  ): Promise<string> {
    let path: string;
    const sanitizedName = sanitizeString(imageFullName);
    let random = generateRandomNumberString(4);

    if (spesificId) {
      path =
        `tmra/${this.appEnv}/organization/${organizationId}` +
        `/${folderType}/${sanitizedName}-${spesificId}-${random}${extension}`;
    } else {
      path =
        `tmra/${this.appEnv}/organization/${organizationId}` +
        `/${folderType}/${sanitizedName}-${random}${extension}`;
    }
    return path;
  }

  async checkIfImageExists(path: string): Promise<boolean> {
    const mediaUrl = this.urlMedia + '/' + path;

    this.logger.log(
      `Checking if image exists at ${mediaUrl} at bunny storage ...`,
    );

    const options: AxiosRequestConfig<any> = {
      method: 'GET',
      headers: {
        Accept: '*/*',
        AccessKey: this.accessKey,
      },
      url: mediaUrl,
    };

    try {
      const response = await axios(options);
      this.logger.log(
        'Check Result: %s %s',
        response.status,
        response.statusText,
      );
      return true;
    } catch (error) {
      this.logger.log(
        'Check Result: %s',
        JSON.stringify(error.response.data, null, 2),
      );
      return false;
    }
  }

  async uploadImage(
    path: string,
    binary: Buffer,
    serviceName: string,
  ): Promise<boolean> {
    const mediaUrl = this.urlMedia + '/' + path;

    const options: AxiosRequestConfig<any> = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
        AccessKey: this.accessKey,
      },
      data: binary,
      url: mediaUrl,
    };

    try {
      this.logger.log(
        `Uploading to Bunny: ${mediaUrl} (${binary.length} bytes)...`,
      );
      const response = await axios(options);
      this.logger.log(
        'Uploaded %s (%d bytes) to Bunny: %s %s %s',
        mediaUrl,
        binary.length,
        response.status,
        response.statusText,
        JSON.stringify(response.data, null, 2),
      );
      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error uploading image file to Bunny ${mediaUrl} (${binary.length} bytes) while creating ${serviceName}`,
      );
    }
  }

  async deleteImage(path: string): Promise<boolean> {
    const mediaUrl = this.urlMedia + '/' + path;
    const cdnUrl = this.cdnUrl + '/' + path;
    this.logger.log(`Deleting ${cdnUrl} from storage ...`);

    const options: AxiosRequestConfig<any> = {
      method: 'DELETE',
      headers: {
        AccessKey: this.accessKey,
      },
      url: mediaUrl,
    };

    try {
      const response = await axios(options);
      if (response.data.HttpCode === 200) {
        this.logger.log(
          'Deleted %s from Bunny: %s %s %s',
          mediaUrl,
          response.status,
          response.statusText,
          JSON.stringify(response.data, null, 2),
        );
      }
      return true;
    } catch (error) {
      this.logger.error(`Error deleting image ${path}: ${error}`, error);
      throw new InternalServerErrorException(`Error deleting image!`);
    }
  }

  public async uploadFile(
    file: MulterFile,
    allowedFileType: AllowedFileType[],
    maxFileSize: number,
    serviceName: string,
    parseFileName: boolean,
    path?: string,
  ): Promise<string> {
    validateAllowedExtension(file, allowedFileType);
    validateFileSize(file, maxFileSize);

    let fileName = parseFileName
      ? uploadFileNameParser(file.originalname)
      : file.originalname;

    this.logger.log('fileName before path: ', fileName);

    if (path) {
      fileName = path + '/' + fileName;
    }
    this.logger.log(`path=${path} fileName after path=${fileName}`);

    const mediaUrl = this.urlMedia + '/' + fileName;

    const options: AxiosRequestConfig<any> = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
        AccessKey: this.accessKey,
      },
      data: file.buffer,
      url: mediaUrl,
    };

    try {
      this.logger.log(
        `Uploading to Bunny: ${mediaUrl} (${file.buffer.length} bytes)...`,
      );
      const response = await axios(options);
      this.logger.log(
        'Uploaded %s (%d bytes) to Bunny: %s %s %s',
        mediaUrl,
        file.buffer.length,
        response.status,
        response.statusText,
        JSON.stringify(response.data, null, 2),
      );
      return fileName;
    } catch (error) {
      this.logger.error(`Error uploading image file to Bunny ${mediaUrl} (${file.buffer.length} bytes) while creating ${serviceName}`, error);
      throw new InternalServerErrorException(
        `Error uploading image file to Bunny ${mediaUrl} (${file.buffer.length} bytes) while creating ${serviceName}`,
      );
    }
  }
}
