import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { baseJoiRequiredUrl } from '../utils/joi-required-url';
/**
 * Bunny Config (.env loader)
 * @author RDanang(iyoy)
 */
interface ITenderAppConfig {
  baseUrl: string;
}

export const tenderAppConfig = registerAs(
  'tenderAppConfig',
  (): ITenderAppConfig => {
    const values = {
      baseUrl: process.env.TENDER_BASE_URL,
    };

    const schema = Joi.object<ITenderAppConfig>({
      baseUrl: baseJoiRequiredUrl('TENDER_BASE_URL'),
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
