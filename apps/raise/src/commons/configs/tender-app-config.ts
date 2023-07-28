import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { baseJoiRequiredUrl } from '../utils/joi-required-url';
import { baseJoiRequiredString } from 'src/commons/utils/joi-required-string';
/**
 * Bunny Config (.env loader)
 * @author RDanang(iyoy)
 */
export interface ITenderAppConfig {
  env: string;
  baseUrl: string;
  apiUrl: string;
}

export const tenderAppConfig = registerAs(
  'tenderAppConfig',
  (): ITenderAppConfig => {
    const values = {
      env: process.env.APP_ENV,
      baseUrl: process.env.TENDER_BASE_URL,
      apiUrl: process.env.TENDER_API_URL,
    };

    const schema = Joi.object<ITenderAppConfig>({
      env: baseJoiRequiredString('APP_ENV'),
      baseUrl: baseJoiRequiredUrl('TENDER_BASE_URL'),
      apiUrl: Joi.string().optional(), // optional for now
    });

    const { error, value } = schema.validate(values, {
      abortEarly: false,
    });
    if (error) {
      throw new Error(
        `An error occurred while validating the environment variables for Tender App Config: ${error.message}`,
      );
    }

    return value;
  },
);
