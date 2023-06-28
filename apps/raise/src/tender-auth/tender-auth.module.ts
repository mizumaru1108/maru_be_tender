import { Module } from '@nestjs/common';

import { TenderUserModule } from '../tender-user/tender-user.module';
import { TenderAuthController } from './controllers/tender-auth.controller';
import { TenderAuthService } from './services/tender-auth.service';
import { RegisterClientCommandHandler } from './commands/register/register.command';
import { TenderAuthRepository } from './repositories/tender-auth.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { BankModule } from '../bank/bank.module';
import { SendEmailVerificationClassCommandHandler } from './commands/send.email.verification/send.email.verification.command';
import { VerifyEmailCommandHandler } from './commands/verify.email/verify.email.command';

const commands = [
  RegisterClientCommandHandler,
  SendEmailVerificationClassCommandHandler,
  VerifyEmailCommandHandler,
];

const importedModules = [CqrsModule, TenderUserModule, BankModule];
@Module({
  controllers: [TenderAuthController],
  providers: [TenderAuthService, TenderAuthRepository, ...commands],
  imports: [...importedModules],
})
export class TenderAuthModule {}
