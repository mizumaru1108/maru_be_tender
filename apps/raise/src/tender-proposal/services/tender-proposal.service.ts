import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, proposal_item_budget } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ProposalItemBudget } from '../../tender/commons/types/proposal';
import { ICurrentUser } from '../../user/interfaces/current-user.interface';
import { ChangeProposalStateDto } from '../dtos/requests/change-proposal-state.dto';
import { UpdateProposalDraftFourthStepDto } from '../dtos/requests/update-proposal-draft-fourth-step.dto';
import { UpdateProposalFourthStepResponseDto } from '../dtos/responses/update-proposal-fourth-step-response.dto';
import { TenderProposalFlowService } from './tender-proposal-flow.service';
import { TenderProposalLogService } from './tender-proposal-log.service';
import { v4 as uuidv4 } from 'uuid';
// import { nanoid } from 'nanoid';
@Injectable()
export class TenderProposalService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tenderProposalLogService: TenderProposalLogService,
    private readonly tenderProposalFlowService: TenderProposalFlowService,
  ) {}

  // async updateFourthStep(
  //   payload: UpdateProposalDraftFourthStepDto,
  // ): Promise<UpdateProposalFourthStepResponseDto> {
  //   // fetch the proposal item budget to get all exising item budget
  //   const dataOnDb = await this.prismaService.proposal_item_budget.findMany({
  //     where: {
  //       proposal_id: payload.proposal_id,
  //     },
  //   });

  //   // tmp
  //   const mapResult = {
  //     tmpCreated: [] as ProposalItemBudget[],
  //     created: [] as proposal_item_budget[],
  //     updated: [] as proposal_item_budget[],
  //     deleted: [] as string[],
  //   };

  //   // map to determine which item budget is new data or old data
  //   const requestData = payload.detail_project_budgets.map((request) => {
  //     if (!request.id) {
  //       const itemBudgets: ProposalItemBudget = {
  //         id: require('nanoid').nanoid(),
  //         proposal_id: payload.proposal_id,
  //         amount: new Prisma.Decimal(request.amount),
  //         clause: request.clause,
  //         explanation: request.explanation,
  //       };
  //       mapResult.tmpCreated.push(itemBudgets);
  //     }
  //     request.amount = new Prisma.Decimal(request.amount);
  //     // if the data has id then it means it exist on db so we have to check it latter
  //     // wether it has been deleted or updated
  //     return request as ProposalItemBudget;
  //   });

  //   // create new item budget if there is any
  //   if (mapResult.tmpCreated.length > 0) {
  //     try {
  //       await this.prismaService.proposal_item_budget.createMany({
  //         data: mapResult.tmpCreated as Prisma.proposal_item_budgetCreateManyInput[],
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  //   // loop through the data on db to determine which item budget has been deleted/updated
  //   if (dataOnDb.length > 0) {
  //     for (const exisingData of dataOnDb) {
  //       // if the request data.id is not found on db then it means it has been deleted
  //       const index = requestData.findIndex(
  //         (data) => data.id === exisingData.id,
  //       );

  //       // if the index is -1 then it means the data has been deleted
  //       if (index === -1) mapResult.deleted.push(exisingData.id);

  //       // if the index is not -1 && the stringified data is not equal to the stringified data on db
  //       // then it means the data has been updated
  //       if (
  //         index !== -1 &&
  //         JSON.stringify(requestData[index]) !== JSON.stringify(exisingData)
  //       ) {
  //         // use try catch to prevent error when updating and cut the loop
  //         try {
  //           const updatedProposal =
  //             await this.prismaService.proposal_item_budget.update({
  //               where: {
  //                 id: requestData[index].id,
  //               },
  //               data: requestData[
  //                 index
  //               ] as Prisma.proposal_item_budgetUpdateInput,
  //             });
  //           mapResult.updated.push(updatedProposal);
  //         } catch (error) {
  //           throw new BadRequestException(error.message);
  //         }
  //       }
  //     }
  //   }

  //   // delete the item budget if there is any
  //   if (mapResult.deleted.length > 0) {
  //     try {
  //       await this.prismaService.proposal_item_budget.deleteMany({
  //         where: {
  //           id: {
  //             in: mapResult.deleted,
  //           },
  //         },
  //       });
  //     } catch (error) {
  //       throw new BadRequestException(error.message);
  //     }
  //   }

  //   // update the proposal amount_required_fsupport if there is any
  //   if (payload.amount_required_fsupport) {
  //     try {
  //       await this.prismaService.proposal.update({
  //         where: {
  //           id: payload.proposal_id,
  //         },
  //         data: {
  //           amount_required_fsupport: new Prisma.Decimal(
  //             payload.amount_required_fsupport,
  //           ),
  //         },
  //       });
  //     } catch (error) {
  //       throw new BadRequestException(error.message);
  //     }
  //   }

  //   const updateFourthStepResult: UpdateProposalFourthStepResponseDto = {
  //     created: mapResult.created || null,
  //     updated: mapResult.updated || null,
  //     deleted: mapResult.deleted || null,
  //   };

  //   return updateFourthStepResult;
  // }

  async updateFourthStep(
    payload: UpdateProposalDraftFourthStepDto,
  ): Promise<UpdateProposalFourthStepResponseDto> {
    // delete all previous item budget
    const result = await this.prismaService.proposal_item_budget.deleteMany({
      where: {
        proposal_id: payload.proposal_id,
      },
    });

    let newItemBudgets: proposal_item_budget[] = [];
    let itemBudgetCreated: number = 0;

    // create new item budget when there is any
    if (payload.detail_project_budgets.length > 0) {
      const itemBudgets = payload.detail_project_budgets.map((item_budget) => {
        const itemBudget: proposal_item_budget = {
          id: uuidv4(),
          proposal_id: payload.proposal_id,
          amount: new Prisma.Decimal(item_budget.amount),
          clause: item_budget.clause,
          explanation: item_budget.explanation,
        };
        newItemBudgets.push(itemBudget);
        return itemBudget;
      });

      try {
        const createdItemBudget =
          await this.prismaService.proposal_item_budget.createMany({
            data: itemBudgets,
          });
        itemBudgetCreated = createdItemBudget.count;
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }

    let fsupport = 'no amount required fsuport update';
    if (payload.amount_required_fsupport) {
      try {
        await this.prismaService.proposal.update({
          where: {
            id: payload.proposal_id,
          },
          data: {
            amount_required_fsupport: new Prisma.Decimal(
              payload.amount_required_fsupport,
            ),
          },
        });
        fsupport = `amount required fsuport updated to ${payload.amount_required_fsupport}`;
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }

    const response: UpdateProposalFourthStepResponseDto = {
      fsupportLog: fsupport,
      created: newItemBudgets,
      successfullyCreatedCount: itemBudgetCreated,
      deletedCount: result.count,
    };

    return response;
  }

  async changeProposalState(
    currentUser: ICurrentUser,
    request: ChangeProposalStateDto,
  ) {
    // console.log('currentUser', currentUser);
    // console.log('request', request);

    // get the flow to determine where is the next step
    const flow = await this.tenderProposalFlowService.getFlow(
      request.track_name,
    );

    const proposalLogPayload = {
      // id require nano id (cant just import bescause es module on tsconfig)
      id: require('nanoid').nanoid(),
      proposalId: request.proposal_id,
      reviewer_id: currentUser.id,
    };
    const result = await this.prismaService.project_tracks.findMany();
    console.log('result', result);
    return result;
  }
}
