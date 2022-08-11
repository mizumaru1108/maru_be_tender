import { Module } from '@nestjs/common';
import { DonorInfoService } from './donor-info.service';
import { DonorInfoController } from './donor-info.controller';

@Module({
  controllers: [DonorInfoController],
  providers: [DonorInfoService]
})
export class DonorInfoModule {}
