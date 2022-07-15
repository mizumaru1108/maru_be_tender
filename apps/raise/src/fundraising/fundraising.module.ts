import { Module } from '@nestjs/common';
import { FundraisingService } from './fundraising.service';
import { FundraisingController } from './fundraising.controller';

@Module({
  providers: [FundraisingService],
  controllers: [FundraisingController]
})
export class FundraisingModule {}
