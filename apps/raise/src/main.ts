import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { initTracing } from './tracing';

async function bootstrap() {
  await initTracing();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  const config = app.get<ConfigService>(ConfigService);
  console.log(config.get<string>('APP_ENV'));

  if (config.get<string>('APP_ENV') === 'dev') {
    const config = new DocumentBuilder()
      .setTitle('Tmra Raise')
      .setDescription('Tmra Raise API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
