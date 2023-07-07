import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DataNotFoundException } from '../../../../tender-commons/exceptions/data-not-found.exception';
import { PayloadErrorException } from '../../../../tender-commons/exceptions/payload-error.exception';
import { RequestErrorException } from '../../../../tender-commons/exceptions/request-error.exception';
import {
  OutterStatusEnum,
  ProposalAction,
} from '../../../../tender-commons/types/proposal';
import { TenderCurrentUser } from '../../../../tender-user/user/interfaces/current-user.interface';
import {
  CreateProposalEditRequestProps,
  ProposalEditRequestRepository,
} from '../../../edit-requests/repositories/proposal.edit.request.repository';
import { SendAmandementDto } from '../../dtos/requests';
import { ProposalEntity } from '../../entities/proposal.entity';
import { ProposalRepository } from '../../repositories/proposal.repository';
import { UpdateProposalProps } from '../../types';
import { ProposalLogRepository } from '../../../proposal-log/repositories/proposal.log.repository';
import { TenderAppRoleEnum } from '../../../../tender-commons/types';
import { EmailService } from '../../../../libs/email/email.service';
import { ROOT_LOGGER } from '../../../../libs/root-logger';
import { isExistAndValidPhone } from '../../../../commons/utils/is-exist-and-valid-phone';
import { MsegatService } from '../../../../libs/msegat/services/msegat.service';
import { UserEntity } from '../../../../tender-user/user/entities/user.entity';
import { TenderNotificationRepository } from '../../../../notification-management/notification/repository/tender-notification.repository';

export class SendAmandementCommand {
  currentUser: TenderCurrentUser;
  request: SendAmandementDto;
}

export class SendAmandementCommandResult {
  proposal: ProposalEntity;
}

@CommandHandler(SendAmandementCommand)
export class SendAmandementCommandHandler
  implements
    ICommandHandler<SendAmandementCommand, SendAmandementCommandResult>
{
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': SendAmandementCommandHandler.name,
  });

  async sendNotif(
    proposal: ProposalEntity,
    user: UserEntity,
    subject: string,
    content: string,
  ) {
    // email notif
    this.emailService.sendMail({
      subject,
      mailType: 'template',
      templateContext: {
        clientUsername: `${user.employee_name}`,
        projectPageLink: `lll/client/dashboard/previous-funding-requests/${proposal.id}/show-project`,
      },
      templatePath: 'tender/ar/proposal/project_new_amandement_request',
      to: user.email,
    });

    // send sms notif for close report
    // validate client phone
    this.logger.log('info', `validating client phone ${user.mobile_number}`);
    const clientPhone = isExistAndValidPhone(user.mobile_number);

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
        msg: subject + content,
      });
    }
  }

  constructor(
    private readonly prismaService: PrismaService,
    private readonly proposalRepo: ProposalRepository,
    private readonly logRepo: ProposalLogRepository,
    private readonly editRequestRepo: ProposalEditRequestRepository,
    private readonly notifRepo: TenderNotificationRepository,
    private readonly emailService: EmailService,
    private readonly msegatService: MsegatService,
    private readonly eventPublisher: EventPublisher,
  ) {}
  async execute(command: SendAmandementCommand): Promise<any> {
    const { currentUser, request } = command;
    const { proposal_id } = request;
    try {
      const result = await this.prismaService.$transaction(
        async (prismaSession) => {
          const session =
            prismaSession instanceof PrismaService
              ? prismaSession
              : this.prismaService;

          /* object atleas has id, and one more payload (notes), if not then throw err */
          if (Object.keys(request).length < 2) {
            throw new PayloadErrorException('Give at least one revision!');
          }

          const proposal = await this.proposalRepo.fetchById(
            { id: proposal_id },
            session,
          );
          if (!proposal) {
            throw new DataNotFoundException('Proposal Not Found!');
          }
          if (!proposal.user) {
            throw new DataNotFoundException(
              'Failed to fetch proposal submitter user data',
            );
          }

          if (proposal.outter_status === OutterStatusEnum.ON_REVISION) {
            throw new RequestErrorException(
              'Unprocessable, You cant send amandement that already on revision',
            );
          }

          const proposalUpdateProps = Builder<UpdateProposalProps>(
            UpdateProposalProps,
            {
              id: proposal.id,
              supervisor_id: currentUser.id,
              outter_status: OutterStatusEnum.ON_REVISION,
            },
          ).build();

          // for creating detail
          const reqWithoutId: Omit<SendAmandementDto, 'id'> = request;
          const detail = Object.entries(reqWithoutId).reduce(
            (acc, [key, value]) => {
              acc[key] = value;
              return acc;
            },
            {} as Record<string, string>,
          );
          delete detail.proposal_id;

          const editRequestCreateProps =
            Builder<CreateProposalEditRequestProps>(
              CreateProposalEditRequestProps,
              {
                detail: JSON.stringify(detail),
                user_id: proposal.submitter_user_id,
                proposal_id: proposal.id,
                reviewer_id: currentUser.id,
              },
            ).build();

          const updatedProposal = await this.proposalRepo.update(
            proposalUpdateProps,
            session,
          );

          const oldData = await this.editRequestRepo.findOne(
            { proposal_id },
            session,
          );

          if (oldData)
            await this.editRequestRepo.deleteById(oldData.id, session);

          const createdRequest = await this.editRequestRepo.create(
            editRequestCreateProps,
            session,
          );

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

          const createdLogs = await this.logRepo.create(
            {
              proposal_id: proposal.id,
              user_role: TenderAppRoleEnum.PROJECT_SUPERVISOR,
              reviewer_id: currentUser.id,
              action: ProposalAction.SEND_BACK_FOR_REVISION, //revised
              state: TenderAppRoleEnum.CLIENT,
              notes: command.request.notes,
              response_time:
                lastLog[0] && lastLog[0].created_at
                  ? Math.round(
                      (new Date().getTime() - lastLog[0].created_at.getTime()) /
                        60000,
                    )
                  : null,
            },
            session,
          );

          // notifications  (new amandement request from supervisor to user notif)
          // template subject and content
          const subject = `طلب تعديل جديد`;
          const clientContent = `"مرحبًا ${proposal.user.employee_name}، نود إبلاغك بأنه تم طلب تعديل معلومات مشروعك '${proposal.project_name}'.
        يرجى التحقق من حسابك الشخصي للحصول على مزيد من المعلومات، أو انقر هنا."`;

          // web notif
          const notification = await this.notifRepo.create({
            user_id: proposal.user.id,
            content: clientContent,
            subject,
            type: 'PROPOSAL',
            specific_type: 'NEW_AMANDEMENT_REQUEST_FROM_SUPERVISOR',
            proposal_id: proposal_id,
          });

          return {
            db_result: {
              updated_proposal: updatedProposal,
              created_requests: createdRequest,
              created_logs: createdLogs,
              created_web_notificaiton: notification,
            },
            notif_payload: [
              {
                user_id: '',
                phone: '',
                email: '',
                subject: '',
                content: '',
              },
            ],
          };
        },
      );

      const publisher = this.eventPublisher.mergeObjectContext(
        result.db_result.updated_proposal,
      );

      // send / emit an event for send email
      for (const emailNotif of result.notif_payload) {
        // publisher.sendNotificaitonEvent();
        // // send / emit an event for send sms
        // publisher.sendNotificaitonEvent();
      }

      publisher.commit();
      return result;
    } catch (error) {
      throw error;
    }
  }
}
