import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { envLoadErrorHelper } from '../../commons/helpers/env-loaderror-helper';
@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const transporterUrl = config.get<string>('MAILER_TRANSPORT_URL')!;
        if (!transporterUrl) envLoadErrorHelper('MAILER_TRANSPORT_URL');

        return {
          transport: transporterUrl,
          defaults: {
            from: 'hello@tmra.io',
          },
          template: {
            dir: join(__dirname, './templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
