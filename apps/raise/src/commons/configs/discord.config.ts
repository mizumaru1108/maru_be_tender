import { registerAs } from '@nestjs/config';
import Joi from 'joi';
import { baseJoiOptionalString } from 'src/commons/utils/joi.opitonal.string';
// import * as Joi from 'joi';
// import { baseJoiRequiredString } from '../utils/joi-required-string';
// import { baseJoiRequiredUrl } from '../utils/joi-required-url';

/**
 * Discord Config (.env loader)
 * @author RDanang(iyoy)
 */
export interface IDiscordConfig {
  dcFusionAuthChannelId?: string;
  dcFusionAuthToken?: string;
}

export const discordConfig = registerAs('discordConfig', (): IDiscordConfig => {
  const values = {
    dcFusionAuthChannelId: process.env.DISCORD_FUSION_AUTH_CHANNEL_ID,
    dcFusionAuthToken: process.env.DISCORD_FUSION_AUTH_TOKEN,
  };

  const schema = Joi.object<IDiscordConfig>({
    dcFusionAuthChannelId: baseJoiOptionalString(
      'DISCORD_FUSION_AUTH_CHANNEL_ID',
    ),
    dcFusionAuthToken: baseJoiOptionalString('DISCORD_FUSION_AUTH_TOKEN'),
  });

  const { error, value } = schema.validate(values, {
    abortEarly: false,
  });
  if (error) {
    throw new Error(
      `An error occurred while validating the environment variables for Discord: ${error.message}`,
    );
  }

  return values;
});
