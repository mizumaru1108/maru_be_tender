import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AdvertisementCreateHandler } from 'src/advertisements/commands/advertisement.create/advertisement.create.command';
import { AdvertisementDeleteCommandHandler } from 'src/advertisements/commands/advertisement.delete/advertisement.delete.command';
import { AdvertisementUpdateHandler } from 'src/advertisements/commands/advertisement.update/advertisement.update.command';
import { AdvertisementHttpController } from 'src/advertisements/controller/advertisements.http.controller';
import { AdvertisementFindByIdQueryHandler } from 'src/advertisements/queries/advertisement.find.by.id.query/advertisement.find.by.id.query';
import { AdvertisementFindManyQueryHandler } from 'src/advertisements/queries/advertisement.find.many.query/advertisement.find.many.query';
import { AdvertisementFindMyAdsQueryHandler } from 'src/advertisements/queries/advertisement.find.my.ads.query/advertisement.find.my.ads.query';
import { AdvertisementRepository } from 'src/advertisements/repositories/advertisement.repository';

const importedModule = [CqrsModule];
const controllers = [AdvertisementHttpController];
const repositories: Provider[] = [AdvertisementRepository];
const commands: Provider[] = [
  AdvertisementCreateHandler,
  AdvertisementUpdateHandler,
  AdvertisementDeleteCommandHandler,
];
const queries: Provider[] = [
  AdvertisementFindByIdQueryHandler,
  AdvertisementFindManyQueryHandler,
  AdvertisementFindMyAdsQueryHandler,
];
const exportedProviders: Provider[] = [];

@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class AdvertisementsModule {}
