import winston from 'winston';

export const rootLogger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'combined.log' })
  ],
});
