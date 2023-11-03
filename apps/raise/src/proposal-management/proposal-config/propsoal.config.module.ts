import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProposalConfigHttpController } from './controllers/proposal.config.http.controller';
import { ProposalConfigUpdateCommandHandler } from './commands/config.update.command/config.update.command';
import { ProposalConfigFindFirstHandler } from './queries/proposal.config.find.first.query';
import { ProposalConfigRepository } from './repositories/proposal.config.repository';

const importedModule = [CqrsModule];
const controllers = [ProposalConfigHttpController];
const repositories: Provider[] = [ProposalConfigRepository];
const commands: Provider[] = [ProposalConfigUpdateCommandHandler];
const queries: Provider[] = [ProposalConfigFindFirstHandler];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class ProposalConfigModule {}
