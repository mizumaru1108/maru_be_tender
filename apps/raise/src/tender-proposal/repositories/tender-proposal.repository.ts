import { Injectable } from '@nestjs/common';
import { Prisma, proposal, proposal_item_budget } from '@prisma/client';
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

  async updateStepFour(
    proposalId: string,
    itemBudgetPayloads: proposal_item_budget[],
  ) {
    try {
      await this.prismaService.$transaction([
        // delete all previous item budget
        this.prismaService.proposal_item_budget.deleteMany({
          where: {
            proposal_id: proposalId,
          },
        }),
        // create a new one
        this.prismaService.proposal_item_budget.createMany({
          data: itemBudgetPayloads,
        }),
      ]);
    } catch (error) {
      const prismaError = prismaErrorThrower(error, 'finding proposal');
      throw prismaError;
    }
  }

  async updateProposal(
    proposalId: string,
    proposalPayload: Prisma.proposalUpdateInput,
  ) {
    try {
      return await this.prismaService.proposal.update({
        where: {
          id: proposalId,
        },
        data: proposalPayload,
      });
    } catch (error) {
      const prismaError = prismaErrorThrower(error, 'finding proposal');
      throw prismaError;
    }
  }
}
