import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, proposal_item_budget } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { AllowedFileType } from '../../commons/enums/allowed-filetype.enum';
import { BunnyService } from '../../libs/bunny/services/bunny.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ICurrentUser } from '../../user/interfaces/current-user.interface';
import { ChangeProposalStateDto } from '../dtos/requests/change-proposal-state.dto';
import { UpdateProposalDto } from '../dtos/requests/update-proposal.dto';
import { TenderProposalFlowService } from './tender-proposal-flow.service';
import { TenderProposalLogService } from './tender-proposal-log.service';
// import { nanoid } from 'nanoid';
@Injectable()
export class TenderProposalService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bunnyService: BunnyService,
    private readonly tenderProposalLogService: TenderProposalLogService,
    private readonly tenderProposalFlowService: TenderProposalFlowService,
  ) {}

  async checkOldImageUrl(oldUrl: string, newUrl: string) {
    // if there's any old attachment, and it not the same as the old one, delete it
    if (oldUrl !== newUrl) {
      console.log(
        "the old image url is different from the new one, let's delete it",
      );
      // if it's including prefix, remove it
      if (oldUrl.includes('https://media.tmra.io/')) {
        oldUrl = oldUrl.replace('https://media.tmra.io/', '');
      }

      // if there's any old data on db, check if it's exist on bunny storage
      const isExist = await this.bunnyService.checkIfImageExists(oldUrl);

      // if it's exist, delete it
      if (isExist) {
        const deleteImages = await this.bunnyService.deleteImage(oldUrl);
        if (!deleteImages) {
          throw new Error(`Failed to delete at update proposal`);
        }
      }
    }
  }

  async updateProposal(userId: string, updateProposal: UpdateProposalDto) {
    // create payload for update proposal
    const updateProposalPayload: Prisma.proposalUpdateInput = {};

    // console.log('userid', userId);

    // find proposal by id
    const proposal = await this.prismaService.proposal.findUniqueOrThrow({
      where: {
        id: updateProposal.proposal_id,
      },
    });
    console.log('old proposal', proposal);

    // match proposal.submitter_user_id with current user id for permissions
    if (proposal.submitter_user_id !== userId) {
      throw new BadRequestException(
        `You're not allowed to update this proposal`,
      );
    }

    // check if there is any data to update on the form1
    if (updateProposal.form1) {
      const {
        project_name,
        project_location,
        project_implement_date,
        project_idea,
        project_beneficiaries,
        project_attachments,
        letter_ofsupport_req,
        execution_time,
      } = updateProposal.form1;

      project_name && (updateProposalPayload.project_name = project_name);
      if (project_location) {
        updateProposalPayload.project_location = project_location;
      }
      if (project_implement_date) {
        updateProposalPayload.project_implement_date = project_implement_date;
      }
      project_idea && (updateProposalPayload.project_idea = project_idea);
      execution_time && (updateProposalPayload.execution_time = execution_time);
      // project_beneficiaries &&

      // if there's any new upload request for replace the old one
      if (project_attachments) {
        // TODO: when the flow is changed u have to create a new func to upload
        // it should be here

        // if old proposal value exist
        if (proposal.project_attachments) {
          await this.checkOldImageUrl(
            project_attachments.url,
            proposal.project_attachments,
          );
        }

        proposal.project_attachments = project_attachments.url;
        proposal.project_attachments_size = project_attachments.size;
        proposal.project_attachments_type = project_attachments.type;
      }

      if (letter_ofsupport_req) {
        if (proposal.letter_ofsupport_req) {
          await this.checkOldImageUrl(
            letter_ofsupport_req.url,
            proposal.letter_ofsupport_req,
          );
        }

        proposal.letter_ofsupport_req = letter_ofsupport_req.url;
        proposal.letter_ofsupport_req_size = letter_ofsupport_req.size;
        proposal.letter_ofsupport_req_type = letter_ofsupport_req.type;
      }
    }

    if (updateProposal.form2) {
      const {
        num_ofproject_binicficiaries,
        project_goals,
        project_outputs,
        project_strengths,
        project_risks,
      } = updateProposal.form2;

      if (num_ofproject_binicficiaries) {
        updateProposalPayload.num_ofproject_binicficiaries =
          num_ofproject_binicficiaries;
      }
      project_goals && (updateProposalPayload.project_goals = project_goals);
      if (project_outputs) {
        updateProposalPayload.project_outputs = project_outputs;
      }
      if (project_strengths) {
        updateProposalPayload.project_strengths = project_strengths;
      }
      project_risks && (updateProposalPayload.project_risks = project_risks);
    }

    if (updateProposal.form3) {
      const { pm_name, pm_mobile, pm_email, region, governorate } =
        updateProposal.form3;

      pm_name && (updateProposalPayload.pm_name = pm_name);
      pm_mobile && (updateProposalPayload.pm_mobile = pm_mobile);
      pm_email && (updateProposalPayload.pm_email = pm_email);
      region && (updateProposalPayload.region = region);
      governorate && (updateProposalPayload.governorate = governorate);
    }

    if (updateProposal.form4) {
      // delete all previous item budget
      await this.prismaService.proposal_item_budget.deleteMany({
        where: {
          proposal_id: updateProposal.proposal_id,
        },
      });

      // create new item budget when there is any
      if (updateProposal.form4.detail_project_budgets.length > 0) {
        const itemBudgets = updateProposal.form4.detail_project_budgets.map(
          (item_budget) => {
            const itemBudget: proposal_item_budget = {
              id: uuidv4(),
              proposal_id: updateProposal.proposal_id,
              amount: new Prisma.Decimal(item_budget.amount),
              clause: item_budget.clause,
              explanation: item_budget.explanation,
            };
            return itemBudget;
          },
        );

        try {
          await this.prismaService.proposal_item_budget.createMany({
            data: itemBudgets,
          });
        } catch (error) {
          throw new BadRequestException(error.message);
        }
      }

      if (updateProposal.form4.amount_required_fsupport) {
        try {
          await this.prismaService.proposal.update({
            where: {
              id: updateProposal.proposal_id,
            },
            data: {
              amount_required_fsupport: new Prisma.Decimal(
                updateProposal.form4.amount_required_fsupport,
              ),
            },
          });
        } catch (error) {
          throw new BadRequestException(error.message);
        }
      }
    }

    // if updateProposalPayload !== {} then update the proposal
    if (Object.keys(updateProposalPayload).length > 0) {
      // update proposal
      const updatedProposal = await this.prismaService.proposal.update({
        where: {
          id: updateProposal.proposal_id,
        },
        data: {
          ...updateProposalPayload,
        },
      });
      console.log('proposal updated', updatedProposal);
    }
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
