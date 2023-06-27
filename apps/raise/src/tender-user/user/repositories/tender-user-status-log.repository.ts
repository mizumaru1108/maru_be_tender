import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserStatusLogEntity } from '../entities/user-status-log.entity';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { Builder } from 'builder-pattern';
export class CreateUserStatusLogProps {
  status_id: string;
  user_id: string;
  id?: string; // optional if it's predefined,
  notes?: string | null;
  account_manager_id?: string;
}

@Injectable()
export class TenderUserStatusLogRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderUserStatusLogRepository.name,
  });
  constructor(private readonly PrismaService: PrismaService) {}

  async create(
    props: CreateUserStatusLogProps,
    session?: PrismaService,
  ): Promise<UserStatusLogEntity> {
    let prisma = this.PrismaService;
    if (session) prisma = session;
    try {
      const rawCreatedUserStatusLog = await prisma.user_status_log.create({
        data: {
          id: props.id || '',
          notes: props.notes,
          account_manager_id: props.account_manager_id,
          status_id: props.status_id,
          user_id: props.user_id,
        },
      });

      const createdUserStatusLogEntity = Builder<UserStatusLogEntity>(
        UserStatusLogEntity,
        rawCreatedUserStatusLog,
      ).build();

      return createdUserStatusLogEntity;
    } catch (error) {
      this.logger.log('info', `error while createing user status log ${error}`);
      throw error;
    }
  }
  async createMany(): Promise<any> {}
}
