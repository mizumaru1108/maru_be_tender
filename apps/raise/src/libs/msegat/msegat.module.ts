import { Global, Module } from '@nestjs/common';
import { MsegatService } from './services/msegat.service';

@Global()
@Module({
  providers: [MsegatService],
  exports: [MsegatService],
})
export class MsegatModule {}
