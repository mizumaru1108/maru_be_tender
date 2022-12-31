import { BadRequestException, Injectable } from '@nestjs/common';
import { user } from '@prisma/client';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaErrorThrower } from '../../tender-commons/utils/prisma-error-thrower';

@Injectable()
export class TenderRepository {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderRepository.name,
  });

  constructor(private readonly prismaService: PrismaService) {}

  async findUserById(userId: string): Promise<
    | (user & {
        roles: {
          user_type_id: string;
        }[];
      })
    | null
  > {
    try {
      return await this.prismaService.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            select: {
              user_type_id: true,
            },
          },
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        'TenderRepository Hook Handler (find user)',
        'TenderRepository Hook Handler (find user) error:',
        `finding user!`,
      );
      throw theError;
    }
  }

  async updateFollowUp(
    followup_id: string,
    user_id: string,
    selectedRole: string,
  ) {
    try {
      return await this.prismaService.proposal_follow_up.update({
        where: { id: followup_id },
        data: {
          user_id: user_id,
          submitter_role: selectedRole,
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        'TenderRepository Follow Up Hook Handler (update followup)',
        'TenderRepository Follow Up Hook Handler (update followup) error:',
        `finding user!`,
      );
      throw theError;
    }
  }
}
