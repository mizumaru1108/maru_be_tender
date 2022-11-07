import { Module } from '@nestjs/common';
import { TenderClientModule } from '../tender-client/tender-client.module';
import { TenderAuthController } from './controllers/tender-auth.controller';
import { TenderAuthService } from './services/tender-auth.service';

@Module({
  controllers: [TenderAuthController],
  providers: [TenderAuthService],
  imports: [TenderClientModule],
})
export class TenderAuthModule {}
