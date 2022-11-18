import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { proposal } from '@prisma/client';
import { rootLogger } from '../../logger';
import { PrismaService } from '../../prisma/prisma.service';

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
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
