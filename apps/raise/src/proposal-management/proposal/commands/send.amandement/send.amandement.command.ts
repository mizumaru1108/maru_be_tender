import { ConfigService } from '@nestjs/config';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import { ITenderAppConfig } from 'src/commons/configs/tender-app-config';
import { isExistAndValidPhone } from '../../../../commons/utils/is-exist-and-valid-phone';
import { TenderNotificationRepository } from '../../../../notification-management/notification/repository/tender-notification.repository';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DataNotFoundException } from '../../../../tender-commons/exceptions/data-not-found.exception';
import { RequestErrorException } from '../../../../tender-commons/exceptions/request-error.exception';
import { TenderAppRoleEnum } from '../../../../tender-commons/types';
import {
  OutterStatusEnum,
  ProposalAction,
} from '../../../../tender-commons/types/proposal';
import { TenderCurrentUser } from '../../../../tender-user/user/interfaces/current-user.interface';
import {
  CreateProposalEditRequestProps,
  ProposalEditRequestRepository,
} from '../../../edit-requests/repositories/proposal.edit.request.repository';
import { ProposalLogRepository } from '../../../proposal-log/repositories/proposal.log.repository';
import { SendAmandementDto } from '../../dtos/requests';
import {
  ISendNotificaitonEvent,
  ProposalEntity,
} from '../../entities/proposal.entity';
import { ProposalRepository } from '../../repositories/proposal.repository';
import { ProposalUpdateProps } from '../../types';

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
  // private readonly logger = ROOT_LOGGER.child({
  //   'log.logger': SendAmandementCommandHandler.name,
  // });

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly proposalRepo: ProposalRepository,
    private readonly logRepo: ProposalLogRepository,
    private readonly editRequestRepo: ProposalEditRequestRepository,
    private readonly notifRepo: TenderNotificationRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}
  async execute(command: SendAmandementCommand): Promise<any> {
    const appConfig =
      this.configService.get<ITenderAppConfig>('tenderAppConfig');

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
            throw new RequestErrorException('Give at least one revision!');
          }

          const proposal = await this.proposalRepo.fetchById(
            { id: proposal_id, includes_relation: ['user'] },
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

          const proposalUpdateProps = Builder<ProposalUpdateProps>(
            ProposalUpdateProps,
            {
              id: proposal.id,
              supervisor_id: currentUser.id,
              outter_status: OutterStatusEnum.ON_REVISION,
              state: 'CLIENT',
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
          const clientContent = `"مرحبًا ${proposal.user.employee_name}، نود إبلاغك بأنه تم طلب تعديل معلومات مشروعك '${proposal.project_name}'. يرجى التحقق من حسابك الشخصي للحصول على مزيد من المعلومات، أو انقر هنا."`;

          // web notif
          const notification = await this.notifRepo.create(
            {
              user_id: proposal.user.id,
              content: clientContent,
              subject,
              type: 'PROPOSAL',
              specific_type: 'NEW_AMANDEMENT_REQUEST_FROM_SUPERVISOR',
              proposal_id: proposal_id,
            },
            session,
          );

          return {
            db_result: {
              updated_proposal: updatedProposal,
              created_requests: createdRequest,
              created_logs: createdLogs,
              created_web_notificaiton: notification,
            },
            notif_payload: [
              {
                notif_type: 'EMAIL',
                user_id: proposal.user.id,
                user_email: proposal.user.email,
                subject,
                content: clientContent,
                email_type: 'template',
                emailTemplateContext: {
                  clientUsername: `${proposal.user.employee_name}`,
                  projectPageLink: `${
                    appConfig?.baseUrl || ''
                  }/client/dashboard/previous-funding-requests/${
                    proposal.id
                  }/show-project`,
                },
                emailTemplatePath:
                  'tender/ar/proposal/project_new_amandement_request',
              },
              {
                notif_type: 'SMS',
                user_id: proposal.user.id,
                user_phone:
                  proposal.user.mobile_number !== null
                    ? proposal.user.mobile_number
                    : undefined,
                subject,
                content: clientContent,
              },
            ] as ISendNotificaitonEvent[],
          };
        },
        {
          timeout: 50000,
        },
      );

      const publisher = this.eventPublisher.mergeObjectContext(
        result.db_result.updated_proposal,
      );

      for (const notifPayload of result.notif_payload) {
        if (notifPayload.notif_type === 'SMS') {
          const validPhone = isExistAndValidPhone(notifPayload.user_phone);
          if (validPhone) {
            publisher.sendNotificaitonEvent({
              ...notifPayload,
              user_phone: validPhone,
            });
          }
        } else {
          publisher.sendNotificaitonEvent({
            ...notifPayload,
          });
        }
      }

      publisher.commit();
      return result;
    } catch (error) {
      throw error;
    }
  }
}
