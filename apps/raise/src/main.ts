import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
// import './traces'; // MUST be the first one! because of instrumentations
import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

import { json, urlencoded } from 'express';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { validationFormaterResponse } from './commons/helpers/validation.formater.response.helper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  // Reference: https://github.com/iamolegga/nestjs-pino#expose-stack-trace-and-error-class-in-err-property
  app.useLogger(app.get(Logger));

  // global interceptor
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  // Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      transform: true,
      whitelist: true,
      // exceptionFactory: (errors) => {
      //   return new BadRequestException({
      //     statusCode: HttpStatus.BAD_REQUEST,
      //     message: validationFormaterResponse(errors),
      //     error: 'BAD_REQUEST',
      //   });
      // },
    }),
  );

  // json length(base64) / size of file upload
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ limit: '200mb', extended: true }));

  // CORS
  // app.enableCors({
  //   methods: ['OPTIONS', 'POST', 'GET', 'PATCH', 'DELETE'],
  //   allowedHeaders: [
  //     'Access-Control-Allow-Origin',
  //     'Origin',
  //     'X-Requested-With',
  //     'Accept',
  //     'Content-Type',
  //     'Authorization',
  //     'x-hasura-role',
  //     'sec-ch-ua',
  //     'sec-ch-ua-mobile',
  //     'sec-ch-ua-platform',
  //     'x-datadog-origin',
  //     'x-datadog-parent-id',
  //     'x-datadog-sampling-priority',
  //     'x-datadog-trace-id',
  //   ],
  //   exposedHeaders: ['x-hasura-role', 'Authorization'],
  //   credentials: true,
  //   origin: [
  //     'http://localhost:3000', // for local dev fetch to staging

  //     // HTTP
  //     // Hendy's note: we *never* use plain HTTP on server
  //     // 'http://dev.tmra.io', // TMRA Dev
  //     // 'http://staging.tmra.io', // TMRA staging
  //     // 'http://www.tmra.io', // TMRA production
  //     // 'http://givingsadaqah-dev.tmra.io', // GS Dev
  //     // 'http://givingsadaqah-staging.tmra.io', // GS Staging
  //     // 'http://dev.ommar.net', // Ommar Dev
  //     // 'http://staging.ommar.net', // Ommar Staging
  //     // 'http://app-dev.tmra.io', // Tender Dev
  //     // 'http://app-staging.tmra.io', // Tender Staging
  //     // HTTPS
  //     'https://dev.tmra.io', // TMRA Dev
  //     'https://staging.tmra.io', // TMRA staging
  //     'https://www.tmra.io', // TMRA production
  //     'https://givingsadaqah-dev.tmra.io', // GS Dev
  //     'https://givingsadaqah-staging.tmra.io', // GS Staging
  //     'https://dev.ommar.net', // Ommar Dev
  //     'https://staging.ommar.net', // Ommar Staging
  //     'https://tender-app-dev.tmra.io', // Tender Dev
  //     'https://tender-app-staging.tmra.io', // Tender Staging
  //     'https://gaith.hcharity.org', // Tender Staging
  //   ],
  //   preflightContinue: true,
  // });
  app.enableCors();

  const config = app.get<ConfigService>(ConfigService);

  if (config.get<string>('APP_ENV') === 'dev') {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Tmra Raise')
      .setDescription('Tmra Raise API')
      .setVersion('3.0')
      .build();

    const swaggerOptions: SwaggerDocumentOptions = {
      operationIdFactory: (controllerKey, methodKey) => methodKey,
    };

    const document = SwaggerModule.createDocument(app, config, swaggerOptions);

    SwaggerModule.setup('api', app, document);
  }

  /**
   * workaround for server not serving websocket
   */
  // app.useWebSocketAdapter(new WsAdapter(app));
  app.useWebSocketAdapter(new IoAdapter(app));

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
}

try {
  bootstrap()
    .then(() => console.log('App started at port: ', process.env.APP_PORT))
    .catch((e) => console.log(e));
} catch (error) {
  console.log(error);
}
