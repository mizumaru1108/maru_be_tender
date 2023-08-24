import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserStatusEnum } from '../../types/user_status';
import { TenderUserRepository } from '../../repositories/tender-user.repository';
import { UserStatusUpdateDto } from '../../dtos/requests';
import { RequestErrorException } from '../../../../tender-commons/exceptions/request-error.exception';
import { UserEntity } from '../../entities/user.entity';
import { PrismaService } from '../../../../prisma/prisma.service';
import { TenderUserStatusLogRepository } from '../../repositories/tender-user-status-log.repository';
import { UserStatusLogEntity } from '../../entities/user-status-log.entity';
import { ApiProperty } from '@nestjs/swagger';
export class UserUpdateStatusCommand {
  acc_manager_id: string;
  request: UserStatusUpdateDto;
}

export class UserUpdateStatusCommandResult {
  @ApiProperty()
  updated_user: UserEntity;
  @ApiProperty()
  created_status_log: UserStatusLogEntity;
}

@CommandHandler(UserUpdateStatusCommand)
export class UserUpdateStatusCommandHandler
  implements
    ICommandHandler<UserUpdateStatusCommand, UserUpdateStatusCommandResult>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userRepo: TenderUserRepository,
    private readonly statusLogRepo: TenderUserStatusLogRepository,
  ) {}
  async execute(
    command: UserUpdateStatusCommand,
  ): Promise<UserUpdateStatusCommandResult> {
    const { request, acc_manager_id } = command;
    try {
      if (request.status === UserStatusEnum.SUSPENDED_ACCOUNT) {
        const haveProposal = await this.userRepo.isUserHasProposal(
          request.user_id,
        );

        if (haveProposal.length > 0) {
          throw new RequestErrorException(
            'Cant suspend user, user still have ongoing proposal!',
          );
        }
      }

      const dbRes = await this.prismaService.$transaction(
        async (prismaSession) => {
          const tx =
            prismaSession instanceof PrismaService
              ? prismaSession
              : this.prismaService;

          const updatedUser = await this.userRepo.update(
            {
              id: request.user_id,
              status_id: request.status,
            },
            tx,
          );

          const createdStatusLog = await this.statusLogRepo.create(
            {
              user_id: request.user_id,
              status_id: request.status,
              account_manager_id: acc_manager_id,
            },
            tx,
          );

          return {
            updated_user: updatedUser,
            created_status_log: createdStatusLog,
          };
        },
      );

      //   await this.sendChangeStatusNotification(
      //     response.user_status_log,
      //     request.selectLang,
      //   );
      //   return response;
      // }

      // async sendChangeStatusNotification(
      //   status_log: IUserStatusLogResponseDto['data'],
      //   selected_language?: 'ar' | 'en',
      // ) {
      //   let subject = '';
      //   let clientContent = '';
      //   const employeeContent = `You have changed the account status of ${status_log.user_detail.email} to ${status_log.user_status.id}`;
      //   if (status_log.user_status.id === UserStatusEnum.ACTIVE_ACCOUNT) {
      //     subject = 'Your account has been activated!';
      //     clientContent = `Your account (${status_log.user_detail.email}) has been activated by the Account Manager`;
      //   } else if (
      //     status_log.user_status.id === UserStatusEnum.WAITING_FOR_ACTIVATION
      //   ) {
      //     subject = "You're account is waiting for activation!";
      //     clientContent =
      //       'You have been successfully registered as a user on tender-app, please be patience untill your account being reviewed and approved!';
      //   } else if (status_log.user_status.id === UserStatusEnum.SUSPENDED_ACCOUNT) {
      //     subject = 'Your account has been suspended!';
      //     clientContent = `Your account (${status_log.user_detail.email}) has been suspended by the Account Manager`;
      //   } else if (status_log.user_status.id === UserStatusEnum.CANCELED_ACCOUNT) {
      //     subject = 'Your account has been canceled!';
      //     clientContent = `Your account (${status_log.user_detail.email}) has been canceled by the Account Manager`;
      //   } else if (status_log.user_status.id === UserStatusEnum.REVISED_ACCOUNT) {
      //     subject = 'Your account has been revised!';
      //     clientContent = `Your account (${status_log.user_detail.email}) has been revised by the Account Manager`;
      //   } else if (
      //     status_log.user_status.id === UserStatusEnum.WAITING_FOR_EDITING_APPROVAL
      //   ) {
      //     subject = 'Your account editing request has been sent!';
      //     clientContent = `Your account editing request has been sent to the Account Manager, please be patience untill your account being reviewed and approved!`;
      //   }

      //   // email notification
      //   const clientEmailNotifPayload: SendEmailDto = {
      //     mailType: 'plain',
      //     to: status_log.user_detail.email,
      //     from: 'no-reply@hcharity.org',
      //     subject,
      //     content: clientContent,
      //   };

      //   if (status_log.user_status.id === UserStatusEnum.SUSPENDED_ACCOUNT) {
      //     clientEmailNotifPayload.mailType = 'template';
      //     clientEmailNotifPayload.templatePath = `tender/${
      //       selected_language || 'ar'
      //     }/account/account_deactivation`;
      //     clientEmailNotifPayload.templateContext = {
      //       name: status_log.user_detail.employee_name || 'Client...',
      //     };
      //   }
      //   this.emailService.sendMail(clientEmailNotifPayload);

      //   const clientWebNotifPayload: CreateNotificationDto = {
      //     type: 'ACCOUNT',
      //     specific_type: 'NEW_SUSPENDED_ACCOUNT',
      //     user_id: status_log.user_detail.id,
      //     subject,
      //     content: clientContent,
      //   };
      //   this.tenderNotificationService.create(clientWebNotifPayload);

      //   const clientPhone = isExistAndValidPhone(
      //     status_log.user_detail.mobile_number,
      //   );
      //   if (clientPhone) {
      //     this.twilioService.sendSMS({
      //       to: clientPhone,
      //       body: subject + ',' + clientContent,
      //     });
      //   }

      //   if (status_log.account_manager_detail) {
      //     const employeeEmailNotifPayload: SendEmailDto = {
      //       mailType: 'plain',
      //       to: status_log.account_manager_detail.email,
      //       from: 'no-reply@hcharity.org',
      //       subject,
      //       content: employeeContent,
      //     };
      //     this.emailService.sendMail(employeeEmailNotifPayload);

      //     // const employeeWebNotifPayload: CreateNotificationDto = {
      //     //   type: 'ACCOUNT',
      //     //   specific_type: 'NEW_SUSPENDED_ACCOUNT',
      //     //   user_id: status_log.account_manager_detail.id,
      //     //   subject,
      //     //   content: employeeContent,
      //     // };
      //     // this.tenderNotificationService.create(employeeWebNotifPayload);

      //     const accManagerPhone = isExistAndValidPhone(
      //       status_log.account_manager_detail.mobile_number,
      //     );
      //     if (accManagerPhone) {
      //       this.twilioService.sendSMS({
      //         to: accManagerPhone,
      //         body: subject + ',' + employeeContent,
      //       });
      //     }
      //   }
      // }
      return {
        updated_user: dbRes.updated_user,
        created_status_log: dbRes.created_status_log,
      };
    } catch (error) {
      throw error;
    }
  }
}
