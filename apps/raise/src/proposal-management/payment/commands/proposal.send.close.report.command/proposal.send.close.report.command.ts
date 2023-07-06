import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import moment from 'moment';
import { nanoid } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';
import { ITenderAppConfig } from '../../../../commons/configs/tender-app-config';
import { isExistAndValidPhone } from '../../../../commons/utils/is-exist-and-valid-phone';
import { EmailService } from '../../../../libs/email/email.service';
import { MsegatService } from '../../../../libs/msegat/services/msegat.service';
import { ROOT_LOGGER } from '../../../../libs/root-logger';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DataNotFoundException } from '../../../../tender-commons/exceptions/data-not-found.exception';
import { TenderAppRoleEnum } from '../../../../tender-commons/types';
import {
  InnerStatusEnum,
  OutterStatusEnum,
  ProposalAction,
} from '../../../../tender-commons/types/proposal';
import {
  CreateNotificaitonProps,
  TenderNotificationRepository,
} from '../../../../tender-notification/repository/tender-notification.repository';
import { TenderCurrentUser } from '../../../../tender-user/user/interfaces/current-user.interface';
import {
  CreateProposalLogProps,
  ProposalLogRepository,
} from '../../../proposal-log/repositories/proposal.log.repository';
import { ProposalRepository } from '../../../proposal/repositories/proposal.repository';
import { UpdateProposalProps } from '../../../proposal/types';
import { SendClosingReportDto } from '../../dtos/requests';

export class ProposalPaymentSendCloseReportCommand {
  currentUser: TenderCurrentUser;
  request: SendClosingReportDto;
}

@CommandHandler(ProposalPaymentSendCloseReportCommand)
export class ProposalPaymentSendCloseReportCommandHandler
  implements ICommandHandler<ProposalPaymentSendCloseReportCommand>
{
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': ProposalPaymentSendCloseReportCommandHandler.name,
  });

  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly msegatService: MsegatService,
    private readonly configService: ConfigService,
    private readonly proposalRepo: ProposalRepository,
    private readonly logRepo: ProposalLogRepository,
    private readonly notifRepo: TenderNotificationRepository,
  ) {}

  async execute(command: ProposalPaymentSendCloseReportCommand): Promise<any> {
    const { currentUser } = command;
    const { id, send } = command.request;
    const appConfig =
      this.configService.get<ITenderAppConfig>('tenderAppConfig');

    try {
      return await this.prismaService.$transaction(async (prismaSession) => {
        const session =
          prismaSession instanceof PrismaService
            ? prismaSession
            : this.prismaService;

        const proposal = await this.proposalRepo.fetchById(
          { id, includes_relation: ['user'] },
          session,
        );
        if (!proposal) {
          throw new DataNotFoundException(
            'No proposal data found on this payment',
          );
        }
        if (!proposal.user) {
          throw new DataNotFoundException(
            `Failed to fetch proposal submitter user data`,
          );
        }

        const updateProposalPayload: UpdateProposalProps =
          Builder<UpdateProposalProps>(UpdateProposalProps, {
            id: proposal.id,
            inner_status: send
              ? InnerStatusEnum.REQUESTING_CLOSING_FORM
              : InnerStatusEnum.PROJECT_COMPLETED,
            state: TenderAppRoleEnum.CLIENT,
          }).build();

        if (!send) {
          updateProposalPayload.outter_status = OutterStatusEnum.COMPLETED;
        }

        // update the proposal
        this.logger.log('info', `Updating proposal`);
        const updatedProposal = await this.proposalRepo.update(
          updateProposalPayload,
          session,
        );

        // get the last log
        const lastLog = await this.logRepo.findMany(
          {
            proposal_id: proposal.id,
            page: 1,
            limit: 1,
            sort_by: 'created_at',
            sort_direction: 'desc',
          },
          session,
        );

        const proposalLogCreatePayload: CreateProposalLogProps =
          Builder<CreateProposalLogProps>(CreateProposalLogProps, {
            id: nanoid(),
            proposal_id: proposal.id,
            action: send
              ? ProposalAction.SENDING_CLOSING_REPORT
              : ProposalAction.PROJECT_COMPLETED,
            reviewer_id: currentUser.id,
            state: TenderAppRoleEnum.PROJECT_SUPERVISOR,
            user_role: TenderAppRoleEnum.PROJECT_SUPERVISOR,
            response_time: lastLog[0]
              ? Math.round(
                  (new Date().getTime() - lastLog[0].created_at.getTime()) /
                    60000,
                )
              : null,
          }).build();

        this.logger.log('info', `creating proposal log`);
        const createdLogs = await this.logRepo.create(
          proposalLogCreatePayload,
          session,
        );

        // Define the notification message
        const subject = `تقرير إغلاق المشروع`; //close report
        const clientContent = `اقتراحك ${
          proposal.project_name
        } قريب من الاكتمال، خطوة واحدة فقط للحصول على تقرير الإغلاق! عليك فقط تقديم نموذج تقرير إغلاق المشروع \n${moment(
          new Date(),
        ).format('llll')}`;

        const notifPayload: CreateNotificaitonProps =
          Builder<CreateNotificaitonProps>(CreateNotificaitonProps, {
            id: uuidv4(),
            user_id: proposal.user.id,
            type: 'PROPOSAL',
            specific_type: 'SEND_TO_CLIENT_FOR_FILLING_CLOSE_REPORT_FORM',
            proposal_id: proposal.id,
            subject,
            content: clientContent,
          }).build();

        this.logger.log(
          'info',
          `create notification for user ${proposal.user.email}`,
        );
        const createdNotif = await this.notifRepo.create(notifPayload, session);

        // if the supervisor decided to send the notif
        if (send) {
          // email notif for
          this.emailService.sendMail({
            subject,
            mailType: 'template',
            templateContext: {
              projectName: proposal.project_name,
              clientUsername: proposal.user.employee_name,
              paymentPageLink: appConfig?.baseUrl
                ? `/client/dashboard/project-report/${appConfig.baseUrl}/show-details/finished`
                : '#',
            },
            templatePath: 'tender/ar/proposal/payment_finish',
            to: proposal.user.email,
          });

          // send sms notif for close report
          // validate client phone
          this.logger.log(
            'info',
            `validating client phone ${proposal.user.mobile_number}`,
          );
          const clientPhone = isExistAndValidPhone(proposal.user.mobile_number);

          // sms notif for payment release
          if (clientPhone) {
            this.logger.log(
              'info',
              `valid phone number, trying to sending sms to ${clientPhone}`,
            );
            await this.msegatService.sendSMSAsync({
              numbers: clientPhone.includes('+')
                ? clientPhone.substring(1)
                : clientPhone,
              msg: subject + clientContent,
            });
          }
        }

        return {
          updated_proposal: updatedProposal,
          created_logs: createdLogs,
          created_notification: createdNotif,
        };
      });
    } catch (error) {
      throw error;
    }
  }
}
