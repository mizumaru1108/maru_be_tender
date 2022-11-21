import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma, proposal } from '@prisma/client';
import { rootLogger } from '../../logger';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaErrorThrower } from '../../tender-commons/utils/prisma-error-thrower';

@Injectable()
export class TenderProposalRepository {
  private logger = rootLogger.child({
    logger: TenderProposalRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

  async fetchProposalById(proposalId: string): Promise<proposal | null> {
    try {
      return await this.prismaService.proposal.findUnique({
        where: {
          id: proposalId,
        },
      });
    } catch (error) {
      console.log(error);
      const prismaError = prismaErrorThrower(error, 'finding proposal');
      throw prismaError;
    }
  }
}
