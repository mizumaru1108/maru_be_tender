import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProposalProjectTimelineModule } from 'src/proposal-management/poject-timelines/proposal.project.timeline.module';
import { SendRevisionCommandHandler } from 'src/proposal-management/proposal/commands/send.revision/send.revision.command';
import { ProposalFindByIdQueryHandler } from 'src/proposal-management/proposal/queries/proposal.find.by.id.query/proposal.find.by.id.query';
import { TrackModule } from '../../track-management/track/track.module';
import { ProposalAskedEditRequestModule } from '../asked-edit-request/proposal.asked.edit.request.module';
import { ProposalEditRequestModule } from '../edit-requests/proposal.edit.request.module';
import { ProposalItemBudgetModule } from '../item-budget/proposal.item.budget.module';
import { ProposalLogModule } from '../proposal-log/proposal.log.module';
import { ProposalGovernorateModule } from '../proposal-regions/governorate/proposal.governorate.module';
import { ProposalRegionModule } from '../proposal-regions/region/proposal.region.module';
import { AskAmandementRequestCommandHandler } from './commands/ask.amandement.request/ask.amandement.request.command';
import { ChangeStateCommandHandler } from './commands/change.state/change.state.command';
import { ProposalCreateCommandHandler } from './commands/proposal.create/proposal.create.command';
import { ProposalDeleteDraftCommandHandler } from './commands/proposal.delete.draft/proposal.delete.draft.command';
import { ProposalSaveDraftCommandHandler } from './commands/proposal.save.draft/proposal.save.draft.command';
import { SendAmandementCommandHandler } from './commands/send.amandement/send.amandement.command';
import { TenderProposalController } from './controllers/proposal.controller';
import { ProposalMapper } from './mapper/proposal.mapper';
import { ProposalAskedEditRequestFindManyQueryHandler } from './queries/proposal.asked.edit.request.find.many.query/proposal.asked.edit.request.find.many.query';
import { ProposalFindMineQueryHandler } from './queries/proposal.find.mine.query/proposal.find.mine.query';
import { ProposalReportListQueryHandler } from './queries/proposal.report.list/proposal.report.list.query';
import { ProposalRepository } from './repositories/proposal.repository';
import { ProposalService } from './services/proposal.service';

const importedModule = [
  CqrsModule,
  ProposalAskedEditRequestModule,
  ProposalEditRequestModule,
  TrackModule,
  ProposalLogModule,
  ProposalItemBudgetModule,
  ProposalProjectTimelineModule,
  ProposalRegionModule,
  ProposalGovernorateModule,
];

const commands: Provider[] = [
  ChangeStateCommandHandler,
  SendAmandementCommandHandler,
  SendRevisionCommandHandler,
  ProposalCreateCommandHandler,
  ProposalSaveDraftCommandHandler,
  AskAmandementRequestCommandHandler,
  ProposalDeleteDraftCommandHandler,
];

const mapper: Provider[] = [ProposalMapper];

const queries: Provider[] = [
  ProposalFindByIdQueryHandler,
  ProposalFindMineQueryHandler,
  ProposalReportListQueryHandler,
  ProposalAskedEditRequestFindManyQueryHandler,
];

const repositories: Provider[] = [ProposalRepository];

const exportedProvider: Provider[] = [ProposalRepository];

@Module({
  imports: [...importedModule],
  controllers: [TenderProposalController],
  providers: [
    ProposalService,
    ...commands,
    ...mapper,
    ...queries,
    ...repositories,
  ],
  exports: [...exportedProvider],
})
export class ProposalModule {}
