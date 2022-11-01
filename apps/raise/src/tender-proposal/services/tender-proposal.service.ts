import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  Prisma,
  project_track_flows,
  proposal,
  proposal_item_budget,
} from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { BunnyService } from '../../libs/bunny/services/bunny.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  appRoleMappers,
  TenderAppRole,
  TenderFusionAuthRoles,
} from '../../tender/commons/types';
import { compareUrl } from '../../tender/commons/utils/compare-jsonb-imageurl';
import { UploadProposalFilesDto } from '../../tender/dto/upload-proposal-files.dto';
import { ICurrentUser } from '../../user/interfaces/current-user.interface';
import { ChangeProposalStateDto } from '../dtos/requests/change-proposal-state.dto';
import { UpdateProposalDto } from '../dtos/requests/update-proposal.dto';
import { UpdateProposalResponseDto } from '../dtos/responses/update-proposal-response.dto';
import { TenderProposalFlowService } from './tender-proposal-flow.service';
import { TenderProposalLogService } from './tender-proposal-log.service';
@Injectable()
export class TenderProposalService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bunnyService: BunnyService,
    private readonly tenderProposalLogService: TenderProposalLogService,
    private readonly tenderProposalFlowService: TenderProposalFlowService,
  ) {}

  async updateProposal(
    userId: string,
    updateProposal: UpdateProposalDto,
  ): Promise<UpdateProposalResponseDto> {
    // create payload for update proposal
    // const updateProposalPayload: Prisma.proposalUpdateInput = {}; // idk why proposal_bank_id didn't exist on the type.
    const updateProposalPayload: any = {};
    let message = 'Proposal updated successfully';

    // find proposal by id
    const proposal = await this.prismaService.proposal.findUniqueOrThrow({
      where: {
        id: updateProposal.proposal_id,
      },
    });

    // match proposal.submitter_user_id with current user id for permissions
    // if (proposal.submitter_user_id !== userId) {
    //   throw new BadRequestException(
    //     `You're not allowed to update this proposal`,
    //   );
    // }

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
      if (project_beneficiaries) {
        updateProposalPayload.proposal_beneficiaries = {
          connect: {
            id: project_beneficiaries,
          },
        };
      }

      // if there's any new upload request for replace the old one
      if (project_attachments) {
        // TODO: when the flow is changed u have to create a new func to upload
        // it should be here latter on if fe decided to upload the file when submit button is pressed

        // if old proposal value exist
        let isSame = true;
        if (proposal.project_attachments) {
          const sameUrl = await compareUrl(
            proposal.project_attachments, // old object value
            project_attachments, // new object from request
          );
          if (!sameUrl) isSame = false;
        }

        // changes to new one if it's not the same
        if (!isSame) {
          updateProposalPayload.project_attachments = {
            url: project_attachments.url,
            type: project_attachments.type,
            size: project_attachments.size,
          };
        }
      }

      if (letter_ofsupport_req) {
        let isSame = true;
        if (proposal.letter_ofsupport_req) {
          const sameUrl = await compareUrl(
            proposal.project_attachments, // old object value
            letter_ofsupport_req, // new object from request
          );
          if (!sameUrl) isSame = false;
        }

        // changes to new one if it's not the same
        if (!isSame) {
          updateProposalPayload.letter_ofsupport_req = {
            url: letter_ofsupport_req.url,
            type: letter_ofsupport_req.type,
            size: letter_ofsupport_req.size,
          };
        }
      }

      message = message + ` some changes from1 has been applied.`;
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
      message = message + ` some changes from2 has been applied.`;
    }

    if (updateProposal.form3) {
      const { pm_name, pm_mobile, pm_email, region, governorate } =
        updateProposal.form3;

      pm_name && (updateProposalPayload.pm_name = pm_name);
      pm_mobile && (updateProposalPayload.pm_mobile = pm_mobile);
      pm_email && (updateProposalPayload.pm_email = pm_email);
      region && (updateProposalPayload.region = region);
      governorate && (updateProposalPayload.governorate = governorate);
      message = message + ` some changes from3 has been applied.`;
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
          throw new InternalServerErrorException(error.message);
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
          throw new InternalServerErrorException(error.message);
        }
      }
      message = message + ` some changes from4 has been applied.`;
    }

    if (updateProposal.form5) {
      if (updateProposal.form5.proposal_bank_information_id) {
        updateProposalPayload.proposal_bank_id =
          updateProposal.form5.proposal_bank_information_id;
      }
      message = message + ` some changes from5 has been applied.`;
    }

    let update: proposal | null = null;
    // if updateProposalPayload !== {} then update the proposal
    if (Object.keys(updateProposalPayload).length > 0) {
      try {
        const updatedProposal = await this.prismaService.proposal.update({
          where: {
            id: updateProposal.proposal_id,
          },
          data: {
            ...updateProposalPayload,
          },
        });
        update = updatedProposal;
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException(error.message);
      }
    }
    if (!update) message = 'No changes made to proposal';

    let response: UpdateProposalResponseDto = {
      currentProposal: proposal,
      updatedProposal: update,
      details: message,
    };

    return response;
  }

  async fetchTrack(
    position: number,
    track_name: string,
  ): Promise<project_track_flows> {
    const track = await this.prismaService.project_track_flows.findFirst({
      where: {
        step_position: position,
        belongs_to_track: track_name,
      },
    });
    if (!track) {
      throw new NotFoundException(
        `Track with position ${position} and track name ${track_name} not found`,
      );
    }
    return track;
  }

  async changeProposalState(
    currentUser: ICurrentUser,
    request: ChangeProposalStateDto,
  ) {
    // console.log('currentUser', currentUser);
    // console.log('request', request);

    const currentRoles = currentUser.type as TenderFusionAuthRoles;
    if (!currentRoles)
      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    console.log('roles', currentRoles);
    const appRoles = appRoleMappers[currentRoles] as TenderAppRole;
    console.log('app roles', appRoles);

    // get proposal by id
    const proposal = await this.prismaService.proposal.findUniqueOrThrow({
      where: {
        id: request.proposal_id,
      },
    });
    // console.log('proposal', proposal);

    if (appRoles === 'MODERATOR') {
      if (request.action === 'approve') {
        if (
          // if it still on default track
          proposal.track_position === 1 &&
          proposal.project_track === 'DEFAULT_TRACK'
        ) {
          if (!request.user_id) {
            throw new BadRequestException('Supervisor is required');
          }
          if (!request.track_name) {
            throw new BadRequestException('Track name is required');
          }

          // find the next track for the proposal
          const nextTrack = await this.fetchTrack(
            proposal.track_position + 1,
            request.track_name,
          );
          console.log('track', nextTrack);

          // update proposal track position and state
          const updatedProposal = await this.prismaService.proposal.update({
            where: {
              id: proposal.id,
            },
            data: {
              track_position: proposal.track_position + 1,
              state: nextTrack.assigned_to,
              project_track: request.track_name,
            },
          });
        }
      }
    }

    // get the flow to determine where is the next step
    // const proposalLogPayload = {
    //   // id require nano id (cant just import bescause es module on tsconfig)
    //   id: nano(),
    //   proposalId: request.proposal_id,
    //   reviewer_id: currentUser.id,
    // };
    // const result = await this.prismaService.project_tracks.findMany();
    // console.log('result', result);
    // return result;
  }
}
