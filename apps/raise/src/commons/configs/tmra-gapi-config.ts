import { registerAs } from '@nestjs/config';
// import * as Joi from 'joi';
// import { baseJoiRequiredString } from '../utils/joi-required-string';
// import { baseJoiRequiredUrl } from '../utils/joi-required-url';

/**
 * FusionAuth Config (.env loader)
 * @author RDanang(iyoy)
 */
interface IGapiConfig {
  tmraClientId?: string;
  tmraProjectId?: string;
  tmraAuthUri?: string;
  tmraTokenUri?: string;
  tmraAuthProviderX509CertUrl?: string;
  tmraClientSecret?: string;
  tmraRedirectUrl?: string;
}

export const gapiConfig = registerAs('gapiConfig', (): IGapiConfig => {
  const values = {
    tmraClientId: process.env.TMRA_GAPI_CLIENT_ID,
    tmraProjectId: process.env.TMRA_GAPI_PROJECT_ID,
    tmraAuthUri: process.env.TMRA_GAPI_AUTH_URI,
    tmraTokenUri: process.env.TMRA_GAPI_TOKEN_URI,
    tmraAuthProviderX509CertUrl:
      process.env.TMRA_GAPI_AUTH_PROVIDER_X509_CERT_URL,
    tmraClientSecret: process.env.TMRA_GAPI_CLIENT_SECRET,
    tmraRedirectUrl: process.env.TMRA_GAPI_REDIRECT_URL,
  };

  // PLEASE TURN BACK ON WHEN THE ENV IS IMPORTED TO THE SERVER.
  // const schema = Joi.object<IGapiConfig>({
  //   tmraClientId: baseJoiRequiredString('TMRA_GAPI_CLIENT_ID'),
  //   tmraProjectId: baseJoiRequiredString('TMRA_GAPI_PROJECT_ID'),
  //   tmraAuthUri: baseJoiRequiredUrl('TMRA_GAPI_AUTH_URI'),
  //   tmraTokenUri: baseJoiRequiredUrl('TMRA_GAPI_TOKEN_URI'),
  //   tmraAuthProviderX509CertUrl: baseJoiRequiredUrl(
  //     'TMRA_GAPI_AUTH_PROVIDER_X509_CERT_URL',
  //   ),
  //   tmraClientSecret: baseJoiRequiredString('TMRA_GAPI_CLIENT_SECRET'),
  //   tmraRedirectUrl: baseJoiRequiredUrl('TMRA_GAPI_REDIRECT_URL'),
  // });

  // const { error, value } = schema.validate(values, {
  //   abortEarly: false,
  // });
  // if (error) {
  //   throw new Error(
  //     `An error occurred while validating the environment variables for G-API: ${error.message}`,
  //   );
  // }

  return values;
});
