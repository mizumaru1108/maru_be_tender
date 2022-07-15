import { Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { RootController } from './root/root.controller';

@Module({
  controllers: [CoreController, RootController],
  providers: [CoreService]
})
export class CoreModule {}
