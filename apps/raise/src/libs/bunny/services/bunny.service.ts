import {
  Logger,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import axios, { AxiosRequestConfig } from 'axios';
import { FileMimeTypeEnum } from '../../../commons/enums/file-mimetype.enum';
import { envLoadErrorHelper } from '../../../commons/helpers/env-loaderror-helper';
import {
  generateRandomNumberString,
  generateRandomString,
} from '../../../commons/utils/generate-random-string';
import { sanitizeString } from '../../../commons/utils/sanitize-string';
import { uploadFileNameParser } from '../../../commons/utils/upload-filename-parser';
import { validateAllowedExtension } from '../../../commons/utils/validate-allowed-extension';
import { validateFileSize } from '../../../commons/utils/validate-file-size';
import { logUtil } from '../../../commons/utils/log-util';

/**
 * Nest Bunny Module
 * @author RDanang (Iyoy!)
 */
@Injectable()
export class BunnyService {
  private readonly logger = new Logger(BunnyService.name);
  private appEnv: string;
  private storageUrlMedia: string;
  private storageAccessKey: string;
  private cdnUrl: string;

  constructor(private configService: ConfigService) {
    const environment = this.configService.get('APP_ENV');
    if (!environment) envLoadErrorHelper('APP_ENV');
    this.appEnv = environment;

    this.storageUrlMedia = this.configService.get(
      'bunnyConfig.storageUrlMedia',
    ) as string;

    this.storageAccessKey = this.configService.get(
      'bunnyConfig.storageAccessKey',
    ) as string;

    this.cdnUrl = this.configService.get('bunnyConfig.cdnUrl') as string;
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
    const random = generateRandomNumberString(4);

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
    const mediaUrl = this.storageUrlMedia + '/' + path;

    this.logger.log(
      'info',
      `Checking if image exists at ${mediaUrl} at bunny storage ...`,
    );

    const options: AxiosRequestConfig<any> = {
      method: 'GET',
      headers: {
        Accept: '*/*',
        AccessKey: this.storageAccessKey,
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
    const mediaUrl = this.storageUrlMedia + '/' + path;

    const options: AxiosRequestConfig<any> = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
        AccessKey: this.storageAccessKey,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
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

  async deleteMedia(path: string, includeCdn: boolean): Promise<boolean> {
    // if includeCdn then remove cdnUrl
    const storageMediaUrl: string = includeCdn
      ? this.storageUrlMedia + '/' + path.replace(this.cdnUrl + '/', '')
      : this.storageUrlMedia + '/' + path;

    const cdnUrl: string = includeCdn ? path : this.cdnUrl + '/' + path;
    this.logger.log('info', `Deleting ${cdnUrl} from storage ...`);

    const options: AxiosRequestConfig<any> = {
      method: 'DELETE',
      headers: {
        AccessKey: this.storageAccessKey,
      },
      url: storageMediaUrl,
    };

    try {
      const response = await axios(options);
      if (response.data.HttpCode === 200) {
        this.logger.log(
          `${cdnUrl} has been removed from the cloud service!`,
          JSON.stringify(response.data, null, 2),
        );
      }
      return true;
    } catch (error) {
      this.logger.error(`Error deleting media ${path}: ${error}`, error);
      throw new InternalServerErrorException(`Error deleting image!`);
    }
  }

  public async uploadFile(
    file: MulterFile,
    allowedFileType: FileMimeTypeEnum[],
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

    this.logger.log('info', 'fileName before path: ', fileName);

    if (path) {
      fileName = path + '/' + fileName;
    }
    this.logger.log('info', `path=${path} fileName after path=${fileName}`);

    const mediaUrl = this.storageUrlMedia + '/' + fileName;

    const options: AxiosRequestConfig<any> = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
        AccessKey: this.storageAccessKey,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
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
      this.logger.error(
        `Error uploading image file to Bunny ${mediaUrl} (${file.buffer.length} bytes) while creating ${serviceName}`,
        error,
      );
      throw new InternalServerErrorException(
        `Error uploading image file to Bunny ${mediaUrl} (${file.buffer.length} bytes) while creating ${serviceName}`,
      );
    }
  }

  public async uploadFileMulter(
    file: MulterFile,
    path: string,
    serviceName: string,
  ): Promise<string> {
    const storageUrlMedia = this.storageUrlMedia + '/' + path;
    const cdnUrl = this.cdnUrl + '/' + path;

    const options: AxiosRequestConfig<any> = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
        AccessKey: this.storageAccessKey,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      data: file.buffer,
      url: storageUrlMedia,
    };

    try {
      this.logger.log(
        'info',
        `Uploading [${file.filename}] (${file.size} bytes) to Bunny ${this.storageUrlMedia} ...`,
      );
      const response = await axios(options);
      this.logger.log(
        'info',
        `${
          file.filename
        } has been Uploaded!, uploaded Url: ${cdnUrl}, response ${logUtil(
          response.data,
        )}`,
      );
      return cdnUrl;
    } catch (error) {
      this.logger.error(
        `Error uploading image file to Bunny ${storageUrlMedia} (${file.size} bytes) while creating ${serviceName}`,
        error,
      );
      throw new InternalServerErrorException(
        `Error uploading image file to Bunny ${storageUrlMedia} (${file.size} bytes) while creating ${serviceName}`,
      );
    }
  }

  public async uploadFileBase64(
    fileName: string,
    fileBuffer: Buffer,
    path: string,
    serviceName: string,
  ): Promise<string> {
    // this.logger.log('Uploading ', fileName, ' to ', path);
    const storageUrlMedia = this.storageUrlMedia + '/' + path;
    const cdnUrl = this.cdnUrl + '/' + path;

    const options: AxiosRequestConfig<any> = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
        AccessKey: this.storageAccessKey,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      data: fileBuffer,
      url: storageUrlMedia,
    };

    try {
      this.logger.log(
        'info',
        `Uploading [${fileName}] (${fileBuffer.length} bytes) to Bunny ${this.storageUrlMedia} ...`,
      );
      const response = await axios(options);
      this.logger.log(
        'info',
        `${fileName} has been Uploaded!, uploaded Url: ${cdnUrl}, ${JSON.stringify(
          response.data,
          null,
          2,
        )}`,
      );
      return cdnUrl;
    } catch (error) {
      this.logger.error(
        `Error uploading image file to Bunny ${storageUrlMedia} (${fileBuffer.length} bytes) while creating ${serviceName}`,
        error,
      );
      throw new InternalServerErrorException(
        `Error uploading image file to Bunny ${storageUrlMedia} (${fileBuffer.length} bytes) while creating ${serviceName}`,
      );
    }
  }
}
