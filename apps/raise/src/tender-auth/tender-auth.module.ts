import { Module } from '@nestjs/common';

import { TenderUserModule } from '../tender-user/tender-user.module';
import { TenderAuthController } from './controllers/tender-auth.controller';
import { TenderAuthService } from './services/tender-auth.service';
import { RegisterClientCommandHandler } from './commands/register/register.command';
import { TenderAuthRepository } from './repositories/tender-auth.repository';

const commands = [RegisterClientCommandHandler];
@Module({
  controllers: [TenderAuthController],
  providers: [TenderAuthService, TenderAuthRepository, ...commands],
  imports: [TenderUserModule],
})
export class TenderAuthModule {}
