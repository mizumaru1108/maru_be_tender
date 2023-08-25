import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RegionCreateCommandHandler } from './commands/region.create.command/region.create.command';
import { RegionDeleteCommandHandler } from './commands/region.delete.command/region.delete.command';
import { RegionUpdateCommandHandler } from './commands/region.update.command/region.update.command';
import { RegionHttpController } from './controllers/region.http.controller';
import { RegionFindManyQueryHandler } from './queries/region.find.many.query/region.find.many.query';
import { RegionRepository } from './repositories/region.repository';

const importedModule = [CqrsModule];
const controllers = [RegionHttpController];
const repositories: Provider[] = [RegionRepository];
const commands: Provider[] = [
  RegionCreateCommandHandler,
  RegionUpdateCommandHandler,
  RegionDeleteCommandHandler,
];
const queries: Provider[] = [RegionFindManyQueryHandler];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class RegionModule {}
