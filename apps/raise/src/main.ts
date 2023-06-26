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
import pino from 'pino';
// import { WsAdapter } from '@nestjs/platform-ws';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Logger as PinoLogger, LoggerErrorInterceptor } from 'nestjs-pino';

async function bootstrap() {
  // bootstrap NestJS
  const pinoLogger = pino(ecsPinoFormat());
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: process.env.LOG_FORMAT === 'pretty' ? true : pinoLogger,
      // in express we can use json and urlencoded. u can see in code that i define below
      bodyLimit: 52428800, // prevent 413 Payload Too Large (fastify)
      // how to limit json and urlencoded (form submit) in express
      // app.use(json({ limit: '50mb' }));
      // app.use(urlencoded({ limit: '50mb', extended: true }));
    }),
    {
      bufferLogs: true,
    },
  );
  app.useLogger(app.get(PinoLogger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  app.enableCors({
    methods: ['OPTIONS', 'POST', 'GET', 'PATCH'],
    allowedHeaders: [
      'Access-Control-Allow-Origin',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Content-Type',
      'Authorization',
      'x-hasura-role',
      'sec-ch-ua',
      'sec-ch-ua-mobile',
      'sec-ch-ua-platform',
      'x-datadog-origin',
      'x-datadog-parent-id',
      'x-datadog-sampling-priority',
      'x-datadog-trace-id',
    ],
    exposedHeaders: ['x-hasura-role', 'Authorization'],
    credentials: true,
    origin: [
      'http://localhost:3000', // for local dev fetch to staging

      // HTTP
      // Hendy's note: we *never* use plain HTTP on server
      // 'http://dev.tmra.io', // TMRA Dev
      // 'http://staging.tmra.io', // TMRA staging
      // 'http://www.tmra.io', // TMRA production
      // 'http://givingsadaqah-dev.tmra.io', // GS Dev
      // 'http://givingsadaqah-staging.tmra.io', // GS Staging
      // 'http://dev.ommar.net', // Ommar Dev
      // 'http://staging.ommar.net', // Ommar Staging
      // 'http://app-dev.tmra.io', // Tender Dev
      // 'http://app-staging.tmra.io', // Tender Staging
      // HTTPS
      'https://dev.tmra.io', // TMRA Dev
      'https://staging.tmra.io', // TMRA staging
      'https://www.tmra.io', // TMRA production
      'https://givingsadaqah-dev.tmra.io', // GS Dev
      'https://givingsadaqah-staging.tmra.io', // GS Staging
      'https://dev.ommar.net', // Ommar Dev
      'https://staging.ommar.net', // Ommar Staging
      'https://tender-app-dev.tmra.io', // Tender Dev
      'https://tender-app-qc.tmra.io', // Tender QC
      'https://tender-app-staging.tmra.io', // Tender Staging
      'https://gaith.hcharity.org', // Tender Staging
    ],
    preflightContinue: true,
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

  /**
   * workaround for server not serving websocket
   */
  // app.useWebSocketAdapter(new WsAdapter(app));
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
