import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { baseJoiRequiredString } from '../utils/joi-required-string';

/**
 * Msegat Config (.env loader)
 * @author RDanang(iyoy)
 */
export interface IMsegatConfig {
  apiKey: string;
  userSender: string;
  username: string;
}

export const mseGatConfig = registerAs('mseGatConfig', (): IMsegatConfig => {
  const values = {
    apiKey: process.env.MSEGAT_API_KEY,
    userSender: process.env.MSEGAT_USER_SENDER,
    username: process.env.MSEGAT_USERNAME,
  };

  const schema = Joi.object<IMsegatConfig>({
    apiKey: baseJoiRequiredString('MSEGAT_API_KEY'),
    userSender: baseJoiRequiredString('MSEGAT_USER_SENDER'),
    username: baseJoiRequiredString('MSEGAT_USERNAME'),
  });

  const { error, value } = schema.validate(values, {
    abortEarly: false,
  });
  if (error) {
    throw new Error(
      `An error occurred while validating the environment variables for MSEGAT: ${error.message}`,
    );
  }

  return value;
});
