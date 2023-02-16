import { Module } from '@nestjs/common';
import { FundraisingGiftService } from './fundraising-gift.service';
import { FundraisingGiftController } from './fundraising-gift.controller';

@Module({
  providers: [FundraisingGiftService],
  controllers: [FundraisingGiftController],
})
export class FundraisingGiftModule {}
