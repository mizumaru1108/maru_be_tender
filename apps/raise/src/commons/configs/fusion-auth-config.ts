import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { baseJoiRequiredString } from '../utils/joi-required-string';
import { baseJoiRequiredUrl } from '../utils/joi-required-url';

/**
 * FusionAuth Config (.env loader)
 * @author RDanang(iyoy)
 */
interface IFusionAuthConfig {
  baseUrl: string;
  clientKey: string;
  adminKey: string;
  tenantId: string;
  appId: string;
}

export const fusionAuthConfig = registerAs(
  'fusionAuthConfig',
  (): IFusionAuthConfig => {
    const values = {
      baseUrl: process.env.FUSIONAUTH_URL,
      clientKey: process.env.FUSIONAUTH_CLIENT_KEY,
      adminKey: process.env.FUSIONAUTH_ADMIN_KEY,
      tenantId: process.env.FUSIONAUTH_TENANT_ID,
      appId: process.env.FUSIONAUTH_APP_ID,
    };

    const schema = Joi.object<IFusionAuthConfig>({
      baseUrl: baseJoiRequiredUrl('FUSIONAUTH_URL'),
      clientKey: baseJoiRequiredString('FUSIONAUTH_CLIENT_KEY'),
      adminKey: baseJoiRequiredString('FUSIONAUTH_ADMIN_KEY'),
      tenantId: baseJoiRequiredString('FUSIONAUTH_TENANT_ID'),
      appId: baseJoiRequiredString('FUSIONAUTH_APP_ID'),
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
  },
);
