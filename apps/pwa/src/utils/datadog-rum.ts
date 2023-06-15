import { datadogRum } from '@datadog/browser-rum';
import { HASURA_GRAPHQL_URL, TMRA_RAISE_URL } from '../config';

console.debug('Datadog RUM:', process.env.REACT_APP_DATADOG_RUM ? true : false);
if (process.env.REACT_APP_DATADOG_RUM) {
  if (!process.env.REACT_APP_SERVICE_ENV) {
    throw new Error('REACT_APP_SERVICE_ENV is required');
  }
  if (!process.env.REACT_APP_SERVICE_VERSION) {
    throw new Error('REACT_APP_SERVICE_VERSION is required');
  }
  datadogRum.init({
    applicationId: 'e38d9e0d-a6cc-4a8e-aed4-073ab605d9ec',
    clientToken: 'pub06d25281552d9cf7a33398db806b8b99',
    site: 'us5.datadoghq.com',
    service: 'tmra-tender-pwa',
    env: process.env.REACT_APP_SERVICE_ENV,
    // Specify a version number to identify the deployed version of your application in Datadog
    version: process.env.REACT_APP_SERVICE_VERSION,
    sessionSampleRate: 100,
    premiumSampleRate: 100,
    trackUserInteractions: true,
    defaultPrivacyLevel: 'mask-user-input',
    allowedTracingUrls: [TMRA_RAISE_URL!, HASURA_GRAPHQL_URL],
  });

  datadogRum.startSessionReplayRecording();
}
