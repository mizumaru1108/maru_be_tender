import './traces'; // MUST be the first one! because of instrumentations
import ecsPinoFormat from '@elastic/ecs-pino-format';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { contentParser } from 'fastify-multer';
import { WinstonModule } from 'nest-winston';
import pino from 'pino';
import { ROOT_LOGGER } from './libs/root-logger';

async function bootstrap() {
  // bootstrap NestJS
  const pinoLogger = pino(ecsPinoFormat());
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: process.env.LOG_FORMAT === 'ecs' ? pinoLogger : true,
    }),
    {
      logger: WinstonModule.createLogger({
        instance: ROOT_LOGGER,
      }),
    },
  );

  app.enableCors({
    allowedHeaders: ['Content-Type', 'Authorization', 'x-hasura-role'],
    origin: [
      'http://127.0.0.1:4040', // ngrok testing
      'http://localhost:3000',
      'http://localhost:8081',
      // HTTP
      'http://dev.tmra.io', // TMRA Dev
      'http://staging.tmra.io', // TMRA staging
      'http://www.tmra.io', // TMRA production
      'http://givingsadaqah-dev.tmra.io', // GS Dev
      'http://givingsadaqah-staging.tmra.io', // GS Staging
      'http://dev.ommar.net', // Ommar Dev
      'http://staging.ommar.net', // Ommar Staging
      'http://app-dev.tmra.io', // Tender Dev
      'http://app-staging.tmra.io', // Tender Staging
      // HTTPS
      'https://b00f-2001-448a-2083-d889-dfa1-9100-90-1774.ap.ngrok.io', // ngrok testing
      'https://dev.tmra.io', // TMRA Dev
      'https://staging.tmra.io', // TMRA staging
      'https://www.tmra.io', // TMRA production
      'https://givingsadaqah-dev.tmra.io', // GS Dev
      'https://givingsadaqah-staging.tmra.io', // GS Staging
      'https://dev.ommar.net', // Ommar Dev
      'https://staging.ommar.net', // Ommar Staging
      'https://app-dev.tmra.io', // Tender Dev
      'https://app-staging.tmra.io', // Tender Staging
      'https://gaith.hcharity.org', // Tender Staging
    ],
    credentials: true,
  });

  const config = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  if (config.get<string>('APP_ENV') === 'dev') {
    const config = new DocumentBuilder()
      .setTitle('Tmra Raise')
      .setDescription('Tmra Raise API')
      .setVersion('3.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  app.register(contentParser);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
