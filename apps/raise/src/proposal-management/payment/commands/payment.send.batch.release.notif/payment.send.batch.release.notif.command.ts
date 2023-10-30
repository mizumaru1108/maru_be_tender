import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProposalPaymentRepository } from '../../repositories/proposal-payment.repository';
import { TenderNotificationRepository } from '../../../../notification-management/notification/repository/tender-notification.repository';
import { logUtil } from '../../../../commons/utils/log-util';
export class PaymentSendBatchReleaseNotifCommand {}

@CommandHandler(PaymentSendBatchReleaseNotifCommand)
export class PaymentSendBatchReleaseNotifCommandHandler
  implements ICommandHandler<PaymentSendBatchReleaseNotifCommand>
{
  constructor(
    private readonly paymentRepo: ProposalPaymentRepository,
    private readonly notificationRepo: TenderNotificationRepository,
  ) {}

  async execute(command: PaymentSendBatchReleaseNotifCommand): Promise<void> {
    try {
      const payments = await this.paymentRepo.findMany({
        payment_date: new Date(),
        paid: '0',
        include_relations: ['proposal'],
      });

      // console.log('notif sent', payments.length);
      // console.log(logUtil(payments));

      if (payments.length > 0) {
        for (const payment of payments) {
          if (payment.proposal.supervisor_id) {
            // web notif for batch release to supervisor
            await this.notificationRepo.create({
              user_id: payment.proposal.supervisor_id,
              //content: You have a batch release for a project (project name) on today's date
              content: `يوجد لديكم إصدار دفعة لمشروع (${payment.proposal.project_name}) في تاريخ اليوم`,
              //subject: batch release reminder
              subject: 'تذكير بإصدار دفعة',
              proposal_id: payment.proposal_id,
              type: 'PROPOSAL',
              specific_type: 'PAYMENT_RELEASE_REMINDER',
            });
          }
        }
      }
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
}
