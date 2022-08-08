import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BunnyService } from './services/bunny.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [BunnyService],
  exports: [BunnyService],
})
export class BunnyModule {}
