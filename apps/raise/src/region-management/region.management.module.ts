import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RegionModule } from './region/region.module';

const importedModule = [CqrsModule, RegionModule];
@Module({
  imports: [...importedModule],
})
export class RegionManagementModule {}
