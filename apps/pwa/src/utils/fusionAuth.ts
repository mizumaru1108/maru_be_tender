import { FusionAuthClient } from '@fusionauth/typescript-client';
import { FUSIONAUTH_API } from 'config';

export const fusionAuthClient = new FusionAuthClient(
  FUSIONAUTH_API.clientKey!,
  FUSIONAUTH_API.apiUrl!,
  FUSIONAUTH_API.tenantId!
);
