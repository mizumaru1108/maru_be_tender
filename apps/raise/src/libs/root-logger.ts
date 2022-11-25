import ecsFormat from '@elastic/ecs-winston-format';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { createLogger, format, transports } from 'winston';

// createLogger of Winston
export const ROOT_LOGGER = createLogger({
  transports: [
    new transports.Console({
      format:
        process.env.LOG_FORMAT === 'ecs'
          ? format.combine(ecsFormat({ convertReqRes: true }))
          : format.combine(
              format.timestamp(),
              format.ms(),
              nestWinstonModuleUtilities.format.nestLike('convey'),
            ),
    }),
    // other transports...
  ],
  defaultMeta: {
    // https://www.elastic.co/guide/en/ecs/current/ecs-service-usage.html
    'service.name': 'tmra-raise',
    'service.environment': process.env.APP_ENV,
    'service.version': process.env.APP_VERSION,
  },
  // other options
});
