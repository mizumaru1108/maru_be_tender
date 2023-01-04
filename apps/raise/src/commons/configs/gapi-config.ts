import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { baseJoiRequiredString } from '../utils/joi-required-string';
import { baseJoiRequiredUrl } from '../utils/joi-required-url';

/**
 * FusionAuth Config (.env loader)
 * @author RDanang(iyoy)
 */
interface IGapiConfig {
  clientId: string;
  projectId: string;
  authUri: string;
  tokenUri: string;
  authProviderX509CertUrl: string;
  clientSecret: string;
}

export const gapiConfig = registerAs('gapiConfig', (): IGapiConfig => {
  const values = {
    clientId: process.env.GAPI_CLIENT_ID,
    projectId: process.env.GAPI_PROJECT_ID,
    authUri: process.env.GAPI_AUTH_URI,
    tokenUri: process.env.GAPI_TOKEN_URI,
    authProviderX509CertUrl: process.env.GAPI_AUTH_PROVIDER_X509_CERT_URL,
    clientSecret: process.env.GAPI_CLIENT_SECRET,
  };

  const schema = Joi.object<IGapiConfig>({
    clientId: baseJoiRequiredString('GAPI_CLIENT_ID'),
    projectId: baseJoiRequiredString('GAPI_PROJECT_ID'),
    authUri: baseJoiRequiredUrl('GAPI_AUTH_URI'),
    tokenUri: baseJoiRequiredUrl('GAPI_TOKEN_URI'),
    authProviderX509CertUrl: baseJoiRequiredUrl(
      'GAPI_AUTH_PROVIDER_X509_CERT_URL',
    ),
    clientSecret: baseJoiRequiredString('GAPI_CLIENT_SECRET'),
  });

  const { error, value } = schema.validate(values, {
    abortEarly: false,
  });
  if (error) {
    throw new Error(
      `An error occurred while validating the environment variables for G-API: ${error.message}`,
    );
  }

  return value;
});
