import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProposalModule } from 'src/proposal-management/proposal/proposal.module';
import { ProposalLogModule } from '../proposal-log/proposal.log.module';
import { ProposalInsertPaymentCommandHandler } from './commands/proposal.insert.payments.command.ts/proposal.insert.payments.command';
import { ProposalPaymentSendCloseReportCommandHandler } from './commands/proposal.send.close.report.command/proposal.send.close.report.command';
import { ProposalUpdatePaymentCommandHandler } from './commands/proposal.update.payments.command.ts/proposal.update.payments.command';
import { ProposalPaymentController } from './controllers/proposal.payment.controller';
import { ProposalChequeRepository } from './repositories/proposal-cheque.repository';
import { ProposalPaymentRepository } from './repositories/proposal-payment.repository';
import { ProposalPaymentService } from './services/proposal-payment.service';
import { PaymentSubmitClosingReportCommandHandler } from 'src/proposal-management/payment/commands/payment.submit.closing.report.command';
import { ProposalCloseReportModule } from 'src/proposal-management/closing-report/close.report.module';
import { TrackModule } from '../../track-management/track/track.module';
import { PaymentSendBatchReleaseNotifCommandHandler } from './commands/payment.send.batch.release.notif/payment.send.batch.release.notif.command';

const importedModule = [
  CqrsModule,
  ProposalModule,
  ProposalLogModule,
  TrackModule,
  ProposalCloseReportModule,
];

const commands: Provider[] = [
  ProposalInsertPaymentCommandHandler,
  PaymentSendBatchReleaseNotifCommandHandler,
  ProposalPaymentSendCloseReportCommandHandler,
  ProposalUpdatePaymentCommandHandler,
  PaymentSubmitClosingReportCommandHandler,
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
