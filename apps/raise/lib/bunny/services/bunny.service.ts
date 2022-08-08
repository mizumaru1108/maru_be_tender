import FusionAuthClient from '@fusionauth/typescript-client';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { generateRandomNumberString } from '../../../commons/utils/generate-random-string';
import { sanitizeString } from '../../../commons/utils/sanitize-string';

@Injectable()
export class BunnyService {
  constructor(private configService: ConfigService) {}

  async generatePath(
    organizationId: string,
    folderType: string,
    imageFullName: string,
    campaignId: string,
    extension: string,
  ): Promise<string> {
    const appEnv = this.configService.get('APP_ENV');
    let path: string;

    const sanitizedName = sanitizeString(imageFullName);

    let random = generateRandomNumberString(4);

    path =
      `tmra/${appEnv}/organization/${organizationId}` +
      `/${folderType}/${sanitizedName}-${campaignId}-${random}.${extension}`;

    return path;
  }

  async downloadImage(path: string) {
    const urlMedia = `${this.configService.get(
      'BUNNY_STORAGE_URL_MEDIA',
    )}/${path}`;

    const options: AxiosRequestConfig<any> = {
      method: 'GET',
      headers: {
        Accept: '*/*',
        AccessKey: `${this.configService.get(
          'BUNNY_STORAGE_ACCESS_KEY_MEDIA',
        )}`,
      },
      url: urlMedia,
    };
  }

  async uploadImage(path: string, binary: Buffer, serviceName: string) {
    const urlMedia = `${this.configService.get(
      'BUNNY_STORAGE_URL_MEDIA',
    )}/${path}`;

    const options: AxiosRequestConfig<any> = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
        AccessKey: `${this.configService.get(
          'BUNNY_STORAGE_ACCESS_KEY_MEDIA',
        )}`,
      },
      data: binary,
      url: urlMedia,
    };

    try {
      console.info(
        `Uploading to Bunny: ${urlMedia} (${binary.length} bytes)...`,
      );
      const response = await axios(options);
      console.info(
        'Uploaded %s (%d bytes) to Bunny: %s %s %s',
        urlMedia,
        binary.length,
        response.status,
        response.statusText,
        JSON.stringify(response.data, null, 2),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Error uploading image file to Bunny ${urlMedia} (${binary.length} bytes) while creating ${serviceName}`,
      );
    }
  }

  async deleteImage(path: string) {
    const urlMedia = `${this.configService.get('BUNNY_CDN_URL_MEDIA')}/${path}`;
    console.log('urlMedia', urlMedia);

    const options: AxiosRequestConfig<any> = {
      method: 'DELETE',
      headers: {
        AccessKey: `${this.configService.get(
          'BUNNY_STORAGE_ACCESS_KEY_MEDIA',
        )}`,
      },
      url: urlMedia,
    };

    try {
      const response = await axios(options);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting image!`);
    }
  }
}
