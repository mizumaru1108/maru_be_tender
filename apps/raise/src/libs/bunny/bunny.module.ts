import { Global, Module } from '@nestjs/common';
import { BunnyService } from './services/bunny.service';

@Global()
@Module({
  providers: [BunnyService],
  exports: [BunnyService],
})
export class BunnyModule {}
