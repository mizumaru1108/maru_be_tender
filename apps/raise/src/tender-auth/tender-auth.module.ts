import { Module } from '@nestjs/common';

import { TenderUserModule } from '../tender-user/tender-user.module';
import { TenderAuthController } from './controllers/tender-auth.controller';
import { TenderAuthService } from './services/tender-auth.service';

@Module({
  controllers: [TenderAuthController],
  providers: [TenderAuthService],
  imports: [TenderUserModule],
})
export class TenderAuthModule {}
