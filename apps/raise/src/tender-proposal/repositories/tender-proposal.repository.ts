import { Injectable } from '@nestjs/common';
import { Prisma, proposal, proposal_item_budget } from '@prisma/client';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { PrismaService } from '../../prisma/prisma.service';
import { prismaErrorThrower } from '../../tender-commons/utils/prisma-error-thrower';
@Injectable()
export class TenderProposalRepository {
  private readonly logger = ROOT_LOGGER.child({
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
      const theError = prismaErrorThrower(
        error,
        TenderProposalRepository.name,
        'fetchProposalById error details: ',
        'finding proposal!',
      );
      throw theError;
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
      const theError = prismaErrorThrower(
        error,
        TenderProposalRepository.name,
        'updateStepFour error details: ',
        'updating proposal step four!',
      );
      throw theError;
    }
  }

  async updateProposal(
    proposalId: string,
    proposalPayload: Prisma.proposalUpdateInput,
    itemBudgetPayloads?: proposal_item_budget[] | null,
  ) {
    try {
      if (itemBudgetPayloads) {
        return await this.prismaService.$transaction([
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
          // update the proposal
          this.prismaService.proposal.update({
            where: {
              id: proposalId,
            },
            data: proposalPayload,
          }),
        ]);
      } else {
        return await this.prismaService.proposal.update({
          where: {
            id: proposalId,
          },
          data: proposalPayload,
        });
      }
    } catch (error) {
      const theError = prismaErrorThrower(
        error,
        TenderProposalRepository.name,
        'updateProposal error details: ',
        'updating proposal!',
      );
      throw theError;
    }
  }
}
