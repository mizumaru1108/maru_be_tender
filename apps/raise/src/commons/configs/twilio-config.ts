import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { baseJoiRequiredString } from '../utils/joi-required-string';

/**
 * FusionAuth Config (.env loader)
 * @author RDanang(iyoy)
 */
interface ITwilioConfig {
  accountSid: string;
  authToken: string;
  twilioNumber: string;
}

export const twilioConfig = registerAs('twilioConfig', (): ITwilioConfig => {
  const values = {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    twilioNumber: process.env.TWILIO_PHONE_NUMBER,
  };

  const schema = Joi.object<ITwilioConfig>({
    accountSid: baseJoiRequiredString('TWILIO_ACCOUNT_SID'),
    authToken: baseJoiRequiredString('TWILIO_AUTH_TOKEN'),
    twilioNumber: baseJoiRequiredString('TWILIO_PHONE_NUMBER'),
  });

  const { error, value } = schema.validate(values, {
    abortEarly: false,
  });
  if (error) {
    throw new Error(
      `An error occurred while validating the environment variables for Twilio: ${error.message}`,
    );
  }

  return value;
});
