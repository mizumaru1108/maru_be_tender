import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, proposal_log } from '@prisma/client';
import { rootLogger } from '../../logger';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenderProposalLogRepository {
  private logger = rootLogger.child({
    logger: TenderProposalLogRepository.name,
  });
  constructor(private readonly prismaService: PrismaService) {}

  async createLog(
    createPayload: Prisma.proposal_logCreateArgs,
  ): Promise<proposal_log> {
    this.logger.info('creating log');
    try {
      return await this.prismaService.proposal_log.create(createPayload);
    } catch (error) {
      console.trace(error);
      throw new InternalServerErrorException(
        'Something went wrong when creating proposal logs!',
      );
    }
  }
}
