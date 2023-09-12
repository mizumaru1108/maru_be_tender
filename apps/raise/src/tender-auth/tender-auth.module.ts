import { Module } from '@nestjs/common';

import { CqrsModule } from '@nestjs/cqrs';
import { BankModule } from '../bank/bank.module';
import { ClientModule } from '../tender-user/client/client.module';
import { UserModule } from '../tender-user/user/user.module';
import { RegisterClientCommandHandler } from './commands/register/register.command';
import { SendEmailVerificationClassCommandHandler } from './commands/send.email.verification/send.email.verification.command';
import { VerifyEmailCommandHandler } from './commands/verify.email/verify.email.command';
import { TenderAuthController } from './controllers/tender-auth.controller';
import { TenderAuthRepository } from './repositories/tender-auth.repository';
import { TenderAuthService } from './services/tender-auth.service';
import { AuthLoginCommandHandler } from './commands/login/auth.login.command';

const commands = [
  AuthLoginCommandHandler,
  RegisterClientCommandHandler,
  SendEmailVerificationClassCommandHandler,
  VerifyEmailCommandHandler,
];

const importedModules = [CqrsModule, ClientModule, UserModule, BankModule];
@Module({
  controllers: [TenderAuthController],
  providers: [TenderAuthService, TenderAuthRepository, ...commands],
  imports: [...importedModules],
})
export class TenderAuthModule {}
