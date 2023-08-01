import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BannerCreateHandler } from 'src/banners/commands/banner.create/banner.create.command';
import { BannerDeleteCommandHandler } from 'src/banners/commands/banner.delete/banner.delete.command';
import { BannerUpdateHandler } from 'src/banners/commands/banner.update/banner.update.command';
import { BannerHttpController } from 'src/banners/controller/banner.http.controller';
import { BannerFindByIdQueryHandler } from 'src/banners/queries/banner.find.by.id.query/banner.find.by.id.query';
import { BannerFindManyQueryHandler } from 'src/banners/queries/banner.find.many.query/banner.find.many.query';
import { BannerFindMyAdsQueryHandler } from 'src/banners/queries/banner.find.my.ads.query/banner.find.my.ads.query';
import { BannerRepository } from 'src/banners/repositories/banner.repository';

const importedModule = [CqrsModule];
const controllers = [BannerHttpController];
const repositories: Provider[] = [BannerRepository];
const commands: Provider[] = [
  BannerCreateHandler,
  BannerUpdateHandler,
  BannerDeleteCommandHandler,
];
const queries: Provider[] = [
  BannerFindByIdQueryHandler,
  BannerFindManyQueryHandler,
  BannerFindMyAdsQueryHandler,
];
const exportedProviders: Provider[] = [];

@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class BannerModule {}
