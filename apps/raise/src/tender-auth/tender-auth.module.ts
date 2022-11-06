import { Module } from '@nestjs/common';
import { TenderAuthController } from './controllers/tender-auth.controller';
import { TenderAuthService } from './services/tender-auth.service';

@Module({
  controllers: [TenderAuthController],
  providers: [TenderAuthService],
})
export class TenderAuthModule {}
