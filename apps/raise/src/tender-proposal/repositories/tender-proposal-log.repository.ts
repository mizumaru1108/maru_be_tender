import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, proposal_log } from '@prisma/client';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaErrorThrower } from '../../tender-commons/utils/prisma-error-thrower';

@Injectable()
export class TenderProposalLogRepository {
  private readonly logger = ROOT_LOGGER.child({
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

  async findProposalLogByid(proposal_log_id: string): Promise<
    | (proposal_log & {
        proposal: {
          id: string;
          project_name: string;
          submitter_user_id: string;
          user: {
            employee_name: string | null;
            email: string;
            mobile_number: string | null;
          };
        };
        reviewer: {
          employee_name: string | null;
          email: string;
          mobile_number: string | null;
        };
      })
    | null
  > {
    this.logger.info('finding proposal log');
    try {
      const response = await this.prismaService.proposal_log.findUnique({
        where: {
          id: proposal_log_id,
        },
        include: {
          proposal: {
            select: {
              id: true,
              project_name: true,
              submitter_user_id: true,
              user: {
                select: {
                  employee_name: true,
                  email: true,
                  mobile_number: true,
                },
              },
            },
          },
          reviewer: {
            select: {
              employee_name: true,
              email: true,
              mobile_number: true,
            },
          },
        },
      });
      return response;
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalLogRepository.name,
        'fetchProposalLogById error details: ',
        'finding proposal log!',
      );
      throw theError;
    }
  }
}
