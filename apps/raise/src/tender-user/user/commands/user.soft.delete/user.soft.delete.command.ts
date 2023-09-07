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
export class UserSoftDeleteCommand {
  user_id: string;
}

export class UserSoftDeleteCommandResult {
  @ApiProperty()
  updated_user: UserEntity;
  @ApiProperty()
  created_status_log: UserStatusLogEntity;
}

@CommandHandler(UserSoftDeleteCommand)
export class UserSoftDeleteCommandHandler
  implements
    ICommandHandler<UserSoftDeleteCommand, UserSoftDeleteCommandResult>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userRepo: TenderUserRepository,
    private readonly statusLogRepo: TenderUserStatusLogRepository,
  ) {}
  async execute(
    command: UserSoftDeleteCommand,
  ): Promise<UserSoftDeleteCommandResult> {
    try {
      const dbRes = await this.prismaService.$transaction(
        async (prismaSession) => {
          const tx =
            prismaSession instanceof PrismaService
              ? prismaSession
              : this.prismaService;

          const updatedUser = await this.userRepo.update(
            {
              id: command.user_id,
              is_deleted: true,
            },
            tx,
          );

          const createdStatusLog = await this.statusLogRepo.create(
            {
              user_id: command.user_id,
              status_id: 'DELETED',
            },
            tx,
          );

          return {
            updated_user: updatedUser,
            created_status_log: createdStatusLog,
          };
        },
      );

      return {
        updated_user: dbRes.updated_user,
        created_status_log: dbRes.created_status_log,
      };
    } catch (error) {
      throw error;
    }
  }
}
