import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { baseJoiRequiredString } from '../utils/joi-required-string';
import { baseJoiRequiredUrl } from '../utils/joi-required-url';
/**
 * Bunny Config (.env loader)
 * @author RDanang(iyoy)
 */
interface IBunnyConfig {
  cdnUrl: string;
  storageUrlMedia: string;
  storagePrefix: string;
  storageAccessKey: string;
}

export const bunnyConfig = registerAs('bunnyConfig', (): IBunnyConfig => {
  const values = {
    cdnUrl: process.env.BUNNY_CDN_URL_MEDIA,
    storageUrlMedia: process.env.BUNNY_STORAGE_URL_MEDIA,
    storagePrefix: process.env.BUNNY_STORAGE_PREFIX,
    storageAccessKey: process.env.BUNNY_STORAGE_ACCESS_KEY_MEDIA,
  };

  const schema = Joi.object<IBunnyConfig>({
    cdnUrl: baseJoiRequiredUrl('BUNNY_CDN_URL_MEDIA'),
    storageUrlMedia: baseJoiRequiredUrl('BUNNY_STORAGE_URL_MEDIA'),
    storagePrefix: baseJoiRequiredString('BUNNY_STORAGE_PREFIX'),
    storageAccessKey: baseJoiRequiredString('BUNNY_STORAGE_ACCESS_KEY_MEDIA'),
  });

  const { error, value } = schema.validate(values, {
    abortEarly: false,
  });
  if (error) {
    throw new Error(
      `An error occurred while validating the environment variables for FusionAuth: ${error.message}`,
    );
  }

  return value;
});
