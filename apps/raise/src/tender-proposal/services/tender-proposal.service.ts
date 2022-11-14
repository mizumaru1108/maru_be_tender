import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  Prisma,
  proposal,
  proposal_item_budget,
  proposal_log,
} from '@prisma/client';
import { nanoid } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';
import { BunnyService } from '../../libs/bunny/services/bunny.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  appRoleMappers,
  TenderAppRole,
  TenderFusionAuthRoles,
} from '../../tender-commons/types';
import { InnerStatus } from '../../tender-commons/types/proposal';
import { compareUrl } from '../../tender-commons/utils/compare-jsonb-imageurl';

import { ICurrentUser } from '../../user/interfaces/current-user.interface';
import { ChangeProposalStateDto } from '../dtos/requests/change-proposal-state.dto';
import { UpdateProposalDto } from '../dtos/requests/update-proposal.dto';
import { ChangeProposalStateResponseDto } from '../dtos/responses/change-proposal-state-response.dto';
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

  // for draft / edit request
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

    if (updateProposal.step) {
      updateProposalPayload.step = updateProposal.step;
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

  async handleModeratorApprove(
    currentUser: ICurrentUser,
    currentProposal: proposal,
    request: ChangeProposalStateDto,
  ): Promise<ChangeProposalStateResponseDto> {
    const { supervisor_user_id, notes, procedures, track_name } = request;

    let proposal: proposal = currentProposal;
    let log: proposal_log | null = null;

    if (proposal.project_track === 'DEFAULT_TRACK') {
      if (!track_name) throw new BadRequestException('track_name is required!');
      if (!supervisor_user_id) {
        throw new BadRequestException(
          'responsible officer (Supervisor) is required!',
        );
      }
      const nextTrack = await this.tenderProposalFlowService.fetchTrack(
        'MODERATOR',
        track_name,
        true,
      );

      // update the track proposal from default to the defined track by the moderator, also asign to the next state.
      const updatedProposal = await this.prismaService.proposal.update({
        where: {
          id: proposal.id,
        },
        data: {
          supervisor_id: supervisor_user_id,
          inner_status: 'ACCEPTED_BY_MODERATOR',
          outter_status: 'ONGOING',
          state: nextTrack.assigned_to, // move the state to the next responsible officer.
          project_track: request.track_name, // change the track name.
        },
      });
      proposal = updatedProposal;

      console.log('reviewr id', currentUser.id);
      console.log(
        'submitter / client_userid',
        currentProposal.submitter_user_id,
      );
      // create logs
      // const createdLog = await this.tenderProposalLogService.createLog(
      //   currentProposal.id,
      //   currentUser.id,
      //   currentProposal.submitter_user_id,
      //   nextTrack.assigned_to,
      //   updatedProposal.project_track,
      //   'ACCEPTED_BY_MODERATOR',
      //   'ONGOING',
      //   notes,
      //   procedures,
      // );
      // log = createdLog;
    } else {
      const nextTrack = await this.tenderProposalFlowService.fetchTrack(
        'MODERATOR',
        proposal.project_track,
        false,
      );
      console.log('next', nextTrack);

      // update the track proposal from default to the defined track by the moderator, aslo asign to the next state.
      const updatedProposal = await this.prismaService.proposal.update({
        where: {
          id: proposal.id,
        },
        data: {
          inner_status: 'ACCEPTED_BY_MODERATOR',
          outter_status: 'ONGOING',
          state: nextTrack.assigned_to, // move the state to the next responsible officer.
        },
      });
      proposal = updatedProposal;

      // create logs
      const createdLog = await this.tenderProposalLogService.createLog(
        currentProposal.id,
        currentUser.id, //should be there since it's already determined by the moderator (has track)
        currentProposal.submitter_user_id,
        nextTrack.assigned_to,
        proposal.project_track,
        'ACCEPTED_BY_MODERATOR',
        'ONGOING',
        notes,
        procedures,
      );
      log = createdLog;
    }

    return {
      proposal,
      log,
    };
  }

  async handleProjectSupervisorApprove(
    currentUser: ICurrentUser,
    currentProposal: proposal,
    request: ChangeProposalStateDto,
  ): Promise<ChangeProposalStateResponseDto> {
    let proposal: proposal = currentProposal;
    let log: proposal_log | null = null;

    const nextTrack = await this.tenderProposalFlowService.fetchTrack(
      'PROJECT_SUPERVISOR',
      proposal.project_track,
      false,
    );
    // console.log('next', nextTrack);

    // 2 is default for project supervisor set paymentsetup.
    // if the next track is 3, then the proposal shouldn't have a paymentsetup
    if (nextTrack.step_position === 3) {
      if (!request.setupPaymentPayload) {
        throw new BadRequestException('setupPaymentPayload is required!');
      }

      const {
        clause,
        clasification_field,
        support_type,
        closing_report,
        need_picture,
        does_an_agreement,
        support_amount,
        number_of_payments,
        procedures,
        notes,
        support_outputs,
        vat,
        vat_percentage,
        inclu_or_exclu,
      } = request.setupPaymentPayload;

      await this.prismaService.supervisor.create({
        data: {
          id: nanoid(),
          proposal_id: proposal.id,
          user_id: proposal.supervisor_id!, // should be there since it's already determined by the moderator (has track)
          clause,
          clasification_field,
          support_type,
          closing_report,
          need_picture,
          does_an_agreement,
          support_amount,
          number_of_payments,
          procedures,
          notes,
          support_outputs,
          vat,
          vat_percentage,
          inclu_or_exclu,
        },
      });

      const updatedProposal = await this.prismaService.proposal.update({
        where: {
          id: proposal.id,
        },
        data: {
          inner_status: 'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR',
          outter_status: 'ONGOING',
          state: nextTrack.assigned_to, // move the state to the next responsible officer.
        },
      });
      proposal = updatedProposal;

      // create logs
      const createdLog = await this.tenderProposalLogService.createLog(
        currentProposal.id,
        currentUser.id, //should be there since it's already determined by the moderator (has track)
        currentProposal.submitter_user_id,
        nextTrack.assigned_to,
        proposal.project_track,
        'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR',
        'ONGOING',
        notes,
        procedures,
      );
      log = createdLog;
    }

    // if its not defining payment setup, then apply diffrent logic like approve reject / something else.

    return {
      proposal,
      log,
    };
  }

  async handleProjectManagerApprove(
    currentUser: ICurrentUser,
    currentProposal: proposal,
    request: ChangeProposalStateDto,
  ): Promise<ChangeProposalStateResponseDto> {
    let proposal: proposal = currentProposal;
    let log: proposal_log | null = null;

    if (!request.notes) throw new BadRequestException('notes is required!');

    const nextTrack = await this.tenderProposalFlowService.fetchTrack(
      'PROJECT_MANAGER',
      currentProposal.project_track,
      false,
    );
    console.log('next', nextTrack);

    const updatedProposal = await this.prismaService.proposal.update({
      where: {
        id: proposal.id,
      },
      data: {
        inner_status: 'ACCEPTED_BY_PROJECT_MANAGER',
        outter_status: 'ONGOING',
        state: nextTrack.assigned_to, // move the state to the next responsible officer.
      },
    });
    proposal = updatedProposal;

    // create logs
    const createdLog = await this.tenderProposalLogService.createLog(
      currentProposal.id,
      currentUser.id,
      currentProposal.submitter_user_id,
      nextTrack.assigned_to,
      proposal.project_track,
      'ACCEPTED_BY_PROJECT_MANAGER',
      'ONGOING',
      request.notes,
    );
    log = createdLog;

    return {
      proposal,
      log,
    };
  }

  async handleConsultantApprove(
    currentUser: ICurrentUser,
    currentProposal: proposal,
    request: ChangeProposalStateDto,
  ): Promise<ChangeProposalStateResponseDto> {
    let proposal: proposal = currentProposal;
    let log: proposal_log | null = null;

    if (!request.notes) throw new BadRequestException('notes is required!');
    if (!request.procedures)
      throw new BadRequestException('procedures is required!');

    const nextTrack = await this.tenderProposalFlowService.fetchTrack(
      'CONSULTANT',
      currentProposal.project_track,
      false,
    );
    console.log('next', nextTrack);

    const updatedProposal = await this.prismaService.proposal.update({
      where: {
        id: proposal.id,
      },
      data: {
        inner_status: 'ACCEPTED_BY_CONSULTANT',
        outter_status: 'ONGOING',
        state: nextTrack.assigned_to, // move the state to the next responsible officer.
      },
    });
    proposal = updatedProposal;

    // create logs
    const createdLog = await this.tenderProposalLogService.createLog(
      currentProposal.id,
      currentUser.id, //should be there since it's already determined by the moderator (has track)
      currentProposal.submitter_user_id,
      nextTrack.assigned_to,
      proposal.project_track,
      'ACCEPTED_BY_CONSULTANT',
      'ONGOING',
      request.notes,
      request.procedures,
    );
    log = createdLog;

    return {
      proposal,
      log,
    };
  }

  async handleCeoApprove(
    currentUser: ICurrentUser,
    currentProposal: proposal,
  ): Promise<ChangeProposalStateResponseDto> {
    let proposal: proposal = currentProposal;
    let log: proposal_log | null = null;

    const nextTrack = await this.tenderProposalFlowService.fetchTrack(
      'CEO',
      currentProposal.project_track,
      false,
    );
    console.log('next', nextTrack);

    const updatedProposal = await this.prismaService.proposal.update({
      where: {
        id: proposal.id,
      },
      data: {
        inner_status: 'ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION',
        outter_status: 'ONGOING',
        state: nextTrack.assigned_to, // move the state to the next responsible officer.
      },
    });
    proposal = updatedProposal;

    // create logs
    const createdLog = await this.tenderProposalLogService.createLog(
      currentProposal.id,
      currentUser.id,
      currentProposal.submitter_user_id,
      nextTrack.assigned_to,
      proposal.project_track,
      'ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION',
      'ONGOING',
    );
    log = createdLog;

    return {
      proposal,
      log,
    };
  }

  async handleModeratorReject(
    currentUser: ICurrentUser,
    currentProposal: proposal,
    request: ChangeProposalStateDto,
  ) {
    if (!request.notes) throw new BadRequestException('notes is required!');

    const nextTrack = await this.tenderProposalFlowService.fetchTrack(
      'MODERATOR',
      currentProposal.project_track,
      false,
    );
    console.log('next', nextTrack);

    const updatedProposal = await this.prismaService.proposal.update({
      where: {
        id: currentProposal.id,
      },
      data: {
        inner_status: 'REJECTED_BY_MODERATOR',
        outter_status: 'ONGOING',
        state: nextTrack.assigned_to,
      },
    });

    // create logs
    const createdLog = await this.tenderProposalLogService.createLog(
      currentProposal.id,
      currentUser.id,
      currentProposal.submitter_user_id,
      nextTrack.assigned_to,
      currentProposal.project_track,
      'REJECTED_BY_MODERATOR',
      'ONGOING',
      request.notes,
    );

    return {
      proposal: updatedProposal,
      log: createdLog,
    };
  }

  async handleProjectSupervisorReject(
    currentUser: ICurrentUser,
    currentProposal: proposal,
    request: ChangeProposalStateDto,
  ) {
    if (!request.notes) throw new BadRequestException('notes is required!');

    const nextTrack = await this.tenderProposalFlowService.fetchTrack(
      'PROJECT_SUPERVISOR',
      currentProposal.project_track,
      false,
    );
    console.log('next', nextTrack);

    const updatedProposal = await this.prismaService.proposal.update({
      where: {
        id: currentProposal.id,
      },
      data: {
        inner_status: 'REJECTED_BY_SUPERVISOR_WITH_COMMENT',
        outter_status: 'ONGOING',
        state: nextTrack.assigned_to,
      },
    });

    // create logs
    const createdLog = await this.tenderProposalLogService.createLog(
      currentProposal.id,
      currentUser.id,
      currentProposal.submitter_user_id,
      nextTrack.assigned_to,
      currentProposal.project_track,
      'REJECTED_BY_SUPERVISOR_WITH_COMMENT',
      'ONGOING',
      request.notes,
    );

    return {
      proposal: updatedProposal,
      log: createdLog,
    };
  }

  async changeProposalState(
    currentUser: ICurrentUser,
    request: ChangeProposalStateDto,
  ) {
    const currentRoles = currentUser.type as TenderFusionAuthRoles;
    if (!currentRoles)
      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    // console.log('roles', currentRoles);
    const appRoles = appRoleMappers[currentRoles] as TenderAppRole;
    // console.log('app roles', appRoles);

    const proposal = await this.prismaService.proposal.findUnique({
      where: {
        id: request.proposal_id,
      },
    });
    if (!proposal) {
      throw new NotFoundException(
        `Proposal with id ${request.proposal_id} not found`,
      );
    }

    //'MODERATOR', 'PROJECT_SUPERVISOR', 'PROJECT_MANAGER', 'CEO', 'CONSULTANT'
    // 'ACCOUNTS_MANAGER' 'ADMIN'  'CASHIER' 'CLIENT'  'FINANCE';
    if (request.action === 'approve') {
      if (appRoles === 'MODERATOR') {
        const result = await this.handleModeratorApprove(
          currentUser,
          proposal,
          request,
        );
        return result;
      }
      if (appRoles === 'PROJECT_SUPERVISOR') {
        const result = await this.handleProjectSupervisorApprove(
          currentUser,
          proposal,
          request,
        );
        return result;
      }
      if (appRoles === 'PROJECT_MANAGER') {
        const result = await this.handleProjectManagerApprove(
          currentUser,
          proposal,
          request,
        );
        return result;
      }
      if (appRoles === 'CEO') {
        const result = await this.handleCeoApprove(currentUser, proposal);
        return result;
      }
      if (appRoles === 'CONSULTANT') {
        const result = await this.handleConsultantApprove(
          currentUser,
          proposal,
          request,
        );
        return result;
      }
    }

    // if the action is edit_request the track will be stopped, and the proposal will be sent to the Supervisor
    if (request.action === 'edit_request') {
      // update state to PROJECT_SUPERVISOR, and inner_status to WAITING_FOR_EDIT_REQUEST_APPROVAL_FROM_SUPERVISOR
      const updatedProposal = await this.prismaService.proposal.update({
        where: {
          id: proposal.id,
        },
        data: {
          inner_status: 'WAITING_FOR_EDIT_REQUEST_APPROVAL_FROM_SUPERVISOR',
          outter_status: 'PENDING',
          state: 'PROJECT_SUPERVISOR',
        },
      });

      const createdLog = await this.tenderProposalLogService.createLog(
        proposal.id,
        proposal.supervisor_id!, //should be there since it's already determined by the moderator (has track)
        proposal.submitter_user_id,
        'PROJECT_SUPERVISOR',
        proposal.project_track,
        'WAITING_FOR_EDIT_REQUEST_APPROVAL_FROM_SUPERVISOR',
        'PENDING',
      );

      return {
        proposal: updatedProposal,
        log: createdLog,
      };
    }

    //'MODERATOR', 'PROJECT_SUPERVISOR', 'PROJECT_MANAGER', 'CEO', 'CONSULTANT'
    if (request.action === 'reject') {
      // Moderator, PROJECT_SUPERVISOR
      if (appRoles === 'MODERATOR') {
        const result = await this.handleModeratorReject(
          currentUser,
          proposal,
          request,
        );
        return result;
      }
      if (appRoles === 'PROJECT_SUPERVISOR') {
        const result = await this.handleProjectSupervisorReject(
          currentUser,
          proposal,
          request,
        );
        return result;
      }

      //Project_Manager/CEO/Consultant if rejected by those roles the flow will stop (outter_status will be cancelled)
      if (['PROJECT_MANAGER', 'CEO', 'CONSULTANT'].includes(appRoles)) {
        let inner = '';
        if (!request.notes) throw new BadRequestException('notes is required!');
        if (appRoles === 'PROJECT_MANAGER') {
          inner = 'REJECTED_BY_PROJECT_MANAGER_WITH_COMMENT';
        }
        if (appRoles === 'CEO') {
          if (!request.procedures) {
            throw new BadRequestException('procedures is required!');
          }
          inner = 'REJECTED_BY_CEO_WITH_COMMENT';
        }
        if (appRoles === 'CONSULTANT') {
          if (!request.procedures) {
            throw new BadRequestException('procedures is required!');
          }
          inner = 'REJECTED_BY_CONSULTANT';
        }

        const updatedProposal = await this.prismaService.proposal.update({
          where: {
            id: proposal.id,
          },
          data: {
            inner_status: inner,
            outter_status: 'CANCELLED',
            state: appRoles,
          },
        });

        const createdLog = await this.tenderProposalLogService.createLog(
          proposal.id,
          currentUser.id,
          proposal.submitter_user_id,
          appRoles,
          proposal.project_track,
          inner as InnerStatus,
          'CANCELED',
          request.notes,
          request.procedures,
        );

        return {
          proposal: updatedProposal,
          log: createdLog,
        };
      }

      // if rejected by any other role the flow will go to the next track
    }
  }
}
