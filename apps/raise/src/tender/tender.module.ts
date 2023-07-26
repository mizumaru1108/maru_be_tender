import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TenderController } from 'src/tender/controllers/tender.controller';
import { TenderRepository } from 'src/tender/repositories/tender.repository';
import { TenderService } from 'src/tender/services/tender.service';

const importedModule = [CqrsModule];
const controllers = [TenderController];
const repositories: Provider[] = [];
const commands: Provider[] = [];
const queries: Provider[] = [];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [
    ...repositories,
    ...commands,
    ...queries,
    TenderService,
    TenderRepository,
  ],
  exports: [...exportedProviders],
})
export class TenderModule {}
