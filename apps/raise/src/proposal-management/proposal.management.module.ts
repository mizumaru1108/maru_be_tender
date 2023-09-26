import { Module } from '@nestjs/common';

import { CqrsModule } from '@nestjs/cqrs';
import { ProposalEditRequestModule } from './edit-requests/proposal.edit.request.module';
import { ProposalFollowUpModule } from './follow-up/proposal.follow.up.module';
import { ProposalItemBudgetModule } from './item-budget/proposal.item.budget.module';
import { ProposalPaymentModule } from './payment/proposal.payment.module';
import { ProposalProjectTimelineModule } from './poject-timelines/proposal.project.timeline.module';
import { ProposalLogModule } from './proposal-log/proposal.log.module';
import { ProposalModule } from './proposal/proposal.module';
import { ProposalCloseReportModule } from 'src/proposal-management/closing-report/close.report.module';
import { ProposalAskedEditRequestModule } from './asked-edit-request/proposal.asked.edit.request.module';
import { ProposalRegionsModule } from './proposal-regions/proposal.region.management.module';

const importedModules = [
  CqrsModule,
  ProposalAskedEditRequestModule,
  ProposalEditRequestModule,
  ProposalFollowUpModule,
  ProposalItemBudgetModule,
  ProposalPaymentModule,
  ProposalProjectTimelineModule,
  ProposalModule,
  ProposalLogModule,
  ProposalCloseReportModule,
  ProposalRegionsModule,
];

@Module({
  imports: [...importedModules],
})
export class ProposalManagementModule {}
