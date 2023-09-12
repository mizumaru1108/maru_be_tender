import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { Builder } from 'builder-pattern';
import { UserRoleEntity } from '../entities/user-role.entity';
import { ROOT_LOGGER } from '../../../libs/root-logger';

export class CreateRoleProps {
  id?: string; //optional incase of predefined
  user_id: string;
  user_type_id: string;
}

@Injectable()
export class TenderUserRoleRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderUserRoleRepository.name,
  });

  constructor(private readonly prismaService: PrismaService) {}

  async create(props: CreateRoleProps, session?: PrismaService) {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawRole = await prisma.user_role.create({
        data: {
          id: props.id || uuidv4(),
          user_id: props.user_id,
          user_type_id: props.user_type_id,
        },
      });

      const roleEntity = Builder<UserRoleEntity>(
        UserRoleEntity,
        rawRole,
      ).build();

      return roleEntity;
    } catch (error) {
      this.logger.log('info', `Error when creating user role ${error}`);
      throw error;
    }
  }

  async deleteByUserId(user_id: string, session?: PrismaService) {
    let prisma = this.prismaService;
    if (session) prisma = session;
    try {
      const rawRole = await prisma.user_role.deleteMany({
        where: { user_id },
      });
      return rawRole.count;
    } catch (error) {
      this.logger.log('info', `Error when creating user role ${error}`);
      throw error;
    }
  }
}
