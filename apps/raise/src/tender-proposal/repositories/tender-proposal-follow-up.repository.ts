import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, proposal_log } from '@prisma/client';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaErrorThrower } from '../../tender-commons/utils/prisma-error-thrower';

@Injectable()
export class TenderProposalFollowUpRepository {
  private readonly logger = ROOT_LOGGER.child({
    logger: TenderProposalFollowUpRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    followUpCreatePayload: Prisma.proposal_follow_upUncheckedCreateInput,
  ) {
    try {
      return await this.prismaService.proposal_follow_up.create({
        data: followUpCreatePayload,
        include: {
          proposal: {
            include: {
              user: true,
              supervisor: true,
              project_manager: true,
            },
          },
          user: true,
        },
      });
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalFollowUpRepository.name,
        'Creating Follow Up Error:',
        `Creating Follow Up!`,
      );
      throw theError;
    }
  }
}
