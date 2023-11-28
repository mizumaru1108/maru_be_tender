import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { EmailService } from '../../../../libs/email/email.service';
import { FusionAuthService } from '../../../../libs/fusionauth/services/fusion-auth.service';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  ISendNotificaitonEvent,
  ProposalEntity,
} from '../../../../proposal-management/proposal/entities/proposal.entity';
import { ProposalRepository } from '../../../../proposal-management/proposal/repositories/proposal.repository';
import { RequestErrorException } from '../../../../tender-commons/exceptions/request-error.exception';
import { UserStatusUpdateDto } from '../../dtos/requests';
import { UserStatusLogEntity } from '../../entities/user-status-log.entity';
import { UserEntity } from '../../entities/user.entity';
import { TenderUserStatusLogRepository } from '../../repositories/tender-user-status-log.repository';
import { TenderUserRepository } from '../../repositories/tender-user.repository';
import { UserStatusEnum } from '../../types/user_status';
export class UserUpdateStatusCommand {
  acc_manager_id: string;
  request: UserStatusUpdateDto;
}

export class UserUpdateStatusCommandResult {
  @ApiProperty()
  updated_user: UserEntity[];
  @ApiProperty()
  created_status_log: UserStatusLogEntity[];
  @ApiProperty()
  deleted_proposals: ProposalEntity[];
}

@CommandHandler(UserUpdateStatusCommand)
export class UserUpdateStatusCommandHandler
  implements
    ICommandHandler<UserUpdateStatusCommand, UserUpdateStatusCommandResult>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly fusionAuthService: FusionAuthService,
    private readonly userRepo: TenderUserRepository,
    private readonly statusLogRepo: TenderUserStatusLogRepository,
    private readonly proposalRepo: ProposalRepository,
  ) {}

  async execute(
    command: UserUpdateStatusCommand,
  ): Promise<UserUpdateStatusCommandResult> {
    const { request, acc_manager_id } = command;
    try {
      // request.user_id jadi array
      let updatedUsers: UserEntity[] = [];
      let statusLogs: UserStatusLogEntity[] = [];
      let deletedProposals: ProposalEntity[] = [];
      let deletedUserIds: string[] = [];

      for (const user_id of request.user_id) {
        if (
          request.status === UserStatusEnum.SUSPENDED_ACCOUNT ||
          request.status === UserStatusEnum.CANCELED_ACCOUNT ||
          request.status === UserStatusEnum.DELETED
        ) {
          if (user_id === acc_manager_id) {
            throw new RequestErrorException(
              'You cant suspend / cancel your own account!',
            );
          }

          if (request.status === UserStatusEnum.DELETED) {
            const haveProposal = await this.proposalRepo.findMany({
              step: ['ZERO'],
              submitter_user_id: user_id,
            });

            if (haveProposal.length > 0) {
              throw new RequestErrorException(
                // 'Cant suspend user, user still have ongoing proposal!',
                // 'خطأ في الطلب! مزيد من التفاصيل: لا يمكن تعليق المستخدم، لا يزال لدى المستخدم اقتراح مستمر',
                'لا يمكن حذف هذا حساب الشريك لوجود طلبات دعم في حسابه',
              );
            }

            deletedUserIds.push(user_id);
          } else {
            const haveProposal = await this.userRepo.findUserOnGoingProposal(
              user_id,
            );

            if (haveProposal.length > 0) {
              throw new RequestErrorException(
                // 'Cant suspend user, user still have ongoing proposal!',
                // 'خطأ في الطلب! مزيد من التفاصيل: لا يمكن تعليق المستخدم، لا يزال لدى المستخدم اقتراح مستمر',
                'لا يمكن حذف هذا حساب الشريك لوجود طلبات دعم في حسابه',
              );
            }
          }
        }
      }

      await this.prismaService.$transaction(
        async (prismaSession) => {
          const tx =
            prismaSession instanceof PrismaService
              ? prismaSession
              : this.prismaService;

          for (const user_id of request.user_id) {
            const updatedUser = await this.userRepo.update(
              {
                id: user_id,
                status_id: request.status,
                deleted_at:
                  request.status === UserStatusEnum.DELETED ? new Date() : null,
              },
              tx,
            );
            updatedUsers.push(updatedUser);

            const createdStatusLog = await this.statusLogRepo.create(
              {
                user_id: user_id,
                status_id: request.status,
                account_manager_id: acc_manager_id,
              },
              tx,
            );
            statusLogs.push(createdStatusLog);

            if (request.status === UserStatusEnum.DELETED) {
              const draftProposals = await this.proposalRepo.findMany(
                {
                  stepNotIn: ['ZERO'], // bukan zero berarti draft
                  submitter_user_id: user_id,
                },
                tx,
              );

              if (draftProposals.length > 0) {
                deletedProposals = draftProposals;

                const draftProposalIds = draftProposals.map(
                  (proposal) => proposal.id,
                );

                // delete the proposal
                await this.proposalRepo.deleteMany(
                  {
                    ids: draftProposalIds,
                  },
                  tx,
                );
              }
            }
          }
        },
        {
          timeout: 50000,
        },
      );

      if (deletedUserIds.length > 0) {
        for (const deletedUserId of deletedUserIds) {
          await this.fusionAuthService.fusionAuthDeleteUser(deletedUserId);
        }
      }

      if (updatedUsers.length > 0) {
        for (const user of updatedUsers) {
          const notifPayloads: ISendNotificaitonEvent[] = [];

          if (request.status === UserStatusEnum.ACTIVE_ACCOUNT) {
            notifPayloads.push({
              notif_type: 'EMAIL',
              user_id: user.id,
              user_email: user.email,
              subject: 'القبول في منصة غيث للمنح',
              content: '',
              email_type: 'template',
              emailTemplateContext: {
                name: user.employee_name,
                client_email: user.email,
              },
              emailTemplatePath: `tender/ar/account/account_activate_by_acc_manager`,
            });
          }

          if (notifPayloads && notifPayloads.length > 0) {
            for (const notifPayload of notifPayloads) {
              if (
                notifPayload.notif_type === 'EMAIL' &&
                notifPayload.user_email &&
                notifPayload.email_type
              ) {
                this.emailService.sendMail({
                  mailType: notifPayload.email_type,
                  to: notifPayload.user_email,
                  subject: notifPayload.subject,
                  content: notifPayload.content,
                  templateContext: notifPayload.emailTemplateContext,
                  templatePath: notifPayload.emailTemplatePath,
                });
              }
            }
          }
        }
      }

      return {
        updated_user: updatedUsers,
        created_status_log: statusLogs,
        deleted_proposals: deletedProposals,
      };
    } catch (error) {
      throw error;
    }
  }
}
