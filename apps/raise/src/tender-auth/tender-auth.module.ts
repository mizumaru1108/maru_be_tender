import { Module } from '@nestjs/common';

import { CqrsModule } from '@nestjs/cqrs';
import { BankModule } from '../bank/bank.module';
import { ClientModule } from '../tender-user/client/client.module';
import { UserModule } from '../tender-user/user/user.module';
import { AskForgotPasswordUrlCommandHandler } from './commands/ask-forgot-password-url/ask.forgot.password.url.command';
import { AuthLoginCommandHandler } from './commands/login/auth.login.command';
import { RegisterClientCommandHandler } from './commands/register/register.command';
import { ResetPasswordRequestCommandHandler } from './commands/reset-password-request/reset.password.request.command';
import { SendEmailVerificationClassCommandHandler } from './commands/send.email.verification/send.email.verification.command';
import { SubmitChangePasswordCommandHandler } from './commands/submit-change-password/submit.change.password.command';
import { VerifyEmailCommandHandler } from './commands/verify.email/verify.email.command';
import { TenderAuthController } from './controllers/tender-auth.controller';
import { TenderAuthRepository } from './repositories/tender-auth.repository';

const commands = [
  AuthLoginCommandHandler,
  RegisterClientCommandHandler,
  SendEmailVerificationClassCommandHandler,
  VerifyEmailCommandHandler,
  AskForgotPasswordUrlCommandHandler,
  ResetPasswordRequestCommandHandler,
  SubmitChangePasswordCommandHandler,
];

const importedModules = [CqrsModule, ClientModule, UserModule, BankModule];
@Module({
  controllers: [TenderAuthController],
  providers: [TenderAuthRepository, ...commands],
  imports: [...importedModules],
})
export class TenderAuthModule {}
