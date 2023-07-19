import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AdvertisementCreateHandler } from 'src/advertisements/commands/advertisement.create/advertisement.create.command';
import { AdvertisementUpdateHandler } from 'src/advertisements/commands/advertisement.update/advertisement.update.command';
import { AdvertisementHttpController } from 'src/advertisements/controller/advertisements.http.controller';
import { AdvertisementFindManyQueryHandler } from 'src/advertisements/queries/advertisement.find.many.query/advertisement.find.many.query';
import { AdvertisementRepository } from 'src/advertisements/repositories/advertisement.repository';

const importedModule = [CqrsModule];
const controllers = [AdvertisementHttpController];
const repositories: Provider[] = [AdvertisementRepository];
const commands: Provider[] = [
  AdvertisementCreateHandler,
  AdvertisementUpdateHandler,
];
const queries: Provider[] = [AdvertisementFindManyQueryHandler];
const exportedProviders: Provider[] = [];

@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class AdvertisementsModule {}
