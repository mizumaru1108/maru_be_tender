import { Module, Provider, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProposalPaymentController } from './controllers/proposal-payment.controller';
import { ProposalInsertPaymentCommandHandler } from './commands/proposal.insert.payments.command.ts/proposal.insert.payments.command';
import { ProposalPaymentSendCloseReportCommandHandler } from './commands/proposal.send.close.report.command/proposal.send.close.report.command';
import { ProposalUpdatePaymentCommandHandler } from './commands/proposal.update.payments.command.ts/proposal.update.payments.command';
import { ProposalChequeRepository } from './repositories/proposal-cheque.repository';
import { ProposalPaymentRepository } from './repositories/proposal-payment.repository';
import { ProposalLogModule } from '../proposal-log/proposal.log.module';
import { ProposalModule } from '../proposal/proposal.module';
import { TenderTrackModule } from '../../tender-track/track.module';
import { ProposalPaymentService } from './services/proposal-payment.service';

const importedModule = [
  CqrsModule,
  forwardRef(() => ProposalModule),
  ProposalLogModule,
  TenderTrackModule,
];
const commands: Provider[] = [
  ProposalInsertPaymentCommandHandler,
  ProposalPaymentSendCloseReportCommandHandler,
  ProposalUpdatePaymentCommandHandler,
];
const queries: Provider[] = [];
const repositories: Provider[] = [
  ProposalChequeRepository,
  ProposalPaymentRepository,
];
const exportedProvider: Provider[] = [
  ProposalChequeRepository,
  ProposalPaymentRepository,
];

@Module({
  imports: [...importedModule],
  controllers: [ProposalPaymentController],
  providers: [ProposalPaymentService, ...commands, ...queries, ...repositories],
  exports: [ProposalPaymentService, ...exportedProvider],
})
export class ProposalPaymentModule {}
