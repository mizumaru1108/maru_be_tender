import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { baseJoiRequiredUrl } from '../utils/joi-required-url';
/**
 * Bunny Config (.env loader)
 * @author RDanang(iyoy)
 */
interface INodeMailerConfig {
  transportUrl: string;
}

export const nodeMailerConfig = registerAs(
  'nodeMailerConfig',
  (): INodeMailerConfig => {
    const values = {
      transportUrl: process.env.MAILER_TRANSPORT_URL,
    };

    const schema = Joi.object<INodeMailerConfig>({
      transportUrl: baseJoiRequiredUrl('MAILER_TRANSPORT_URL'),
    });

    const { error, value } = schema.validate(values, {
      abortEarly: false,
    });
    if (error) {
      throw new Error(
        `An error occurred while validating the environment variables for NodeMailer: ${error.message}`,
      );
    }

    return value;
  },
);
