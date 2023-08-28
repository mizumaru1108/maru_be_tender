import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GovernorateModule } from './governorate/governorate.module';
import { RegionModule } from './region/region.module';

const importedModule = [CqrsModule, RegionModule, GovernorateModule];
@Module({
  imports: [...importedModule],
})
export class RegionManagementModule {}
