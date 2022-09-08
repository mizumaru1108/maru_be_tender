import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { baseEnvCallErrorMessage } from '../../../commons/helpers/base-env-call-error-message';
import { generateRandomNumberString } from '../../../commons/utils/generate-random-string';
import { sanitizeString } from '../../../commons/utils/sanitize-string';
/**
 * Nest Bunny Module
 * @author RDanang (Iyoy!)
 */
@Injectable()
export class BunnyService {
  private appEnv: string;
  private urlMedia: string;
  private accessKey: string;
  private cdnUrl: string;

  constructor(private configService: ConfigService) {
    const environment = this.configService.get('APP_ENV');
    if (!environment) {
      throw new InternalServerErrorException(
        `APP_ENV ${baseEnvCallErrorMessage}`,
      );
    }
    this.appEnv = environment;

    const bunnyMediaUrl = this.configService.get('BUNNY_STORAGE_URL_MEDIA');
    if (!bunnyMediaUrl) {
      throw new InternalServerErrorException(
        `BUNNY_STORAGE_URL_MEDIA ${baseEnvCallErrorMessage}`,
      );
    }
    this.urlMedia = bunnyMediaUrl;

    const bunnyAccessKey = this.configService.get(
      'BUNNY_STORAGE_ACCESS_KEY_MEDIA',
    );
    if (!bunnyAccessKey) {
      throw new InternalServerErrorException(
        `BUNNY_STORAGE_ACCESS_KEY_MEDIA ${baseEnvCallErrorMessage}`,
      );
    }
    this.accessKey = bunnyAccessKey;

    const bunnyCdnUrl = this.configService.get('BUNNY_CDN_URL_MEDIA');
    if (!bunnyCdnUrl) {
      throw new InternalServerErrorException(
        `BUNNY_CDN_URL_MEDIA ${baseEnvCallErrorMessage}`,
      );
    }
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

    console.info(
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
      console.info('Check Result: %s %s', response.status, response.statusText);
      return true;
    } catch (error) {
      console.info(
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
      console.info(
        `Uploading to Bunny: ${mediaUrl} (${binary.length} bytes)...`,
      );
      const response = await axios(options);
      console.info(
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

  async deleteImage(path: string) {
    const mediaUrl = this.urlMedia + '/' + path;
    const cdnUrl = this.cdnUrl + '/' + path;
    console.info(`Deleting ${cdnUrl} from storage ...`);

    const options: AxiosRequestConfig<any> = {
      method: 'DELETE',
      headers: {
        AccessKey: this.accessKey,
      },
      url: cdnUrl,
    };

    try {
      const response = await axios(options);
      if (response.data.HttpCode === 200) {
        console.info(
          'Deleted %s from Bunny: %s %s %s',
          mediaUrl,
          response.status,
          response.statusText,
          JSON.stringify(response.data, null, 2),
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting image!`);
    }
  }
}
