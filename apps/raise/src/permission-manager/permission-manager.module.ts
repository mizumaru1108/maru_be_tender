import { Module } from '@nestjs/common';
import { PermissionManagerService } from './permission-manager.service';
import { PermissionManagerController } from './permission-manager.controller';

@Module({
  controllers: [PermissionManagerController],
  providers: [PermissionManagerService]
})
export class PermissionManagerModule {}
