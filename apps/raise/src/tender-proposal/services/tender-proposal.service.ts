import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, proposal, proposal_item_budget, user } from '@prisma/client';
import { nanoid } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import {
  appRoleMappers,
  TenderAppRole,
  TenderAppRoleEnum,
} from '../../tender-commons/types';
import { compareUrl } from '../../tender-commons/utils/compare-jsonb-imageurl';
import { TenderCurrentUser } from '../../tender-user/user/interfaces/current-user.interface';

import { ChangeProposalStateDto } from '../dtos/requests/proposal/change-proposal-state.dto';
import { UpdateProposalDto } from '../dtos/requests/proposal/update-proposal.dto';

import { UpdateProposalResponseDto } from '../dtos/responses/proposal/update-proposal-response.dto';
import { TenderProposalRepository } from '../repositories/tender-proposal.repository';

import { SendEmailDto } from '../../libs/email/dtos/requests/send-email.dto';
import { EmailService } from '../../libs/email/email.service';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { TwilioService } from '../../libs/twilio/services/twilio.service';
import { CreateNotificationDto } from '../../tender-notification/dtos/requests/create-notification.dto';
import { TenderNotificationService } from '../../tender-notification/services/tender-notification.service';

import { IProposalLogsResponse } from '../interfaces/proposal-logs-response';
import { TenderProposalLogRepository } from '../repositories/tender-proposal-log.repository';
import {
  InnerStatusEnum,
  OutterStatusEnum,
  ProposalAction,
} from '../../tender-commons/types/proposal';

@Injectable()
export class TenderProposalService {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderProposalService.name,
  });

  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly twilioService: TwilioService,
    private readonly tenderNotificationService: TenderNotificationService,
    private readonly tenderProposalLogRepository: TenderProposalLogRepository,
    private readonly tenderProposalRepository: TenderProposalRepository,
  ) {}

  // for draft / edit request
  async updateProposal(
    userId: string,
    updateProposal: UpdateProposalDto,
  ): Promise<UpdateProposalResponseDto> {
    // create payload for update proposal
    const updateProposalPayload: Prisma.proposalUpdateInput = {};
    let itemBudgets: proposal_item_budget[] | null = null;
    // const updateProposalPayload: any = {};
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
      // proposal item budgets payload.
      itemBudgets = updateProposal.form4.detail_project_budgets.map(
        (item_budget) => {
          const itemBudget = {
            id: uuidv4(),
            proposal_id: updateProposal.proposal_id,
            amount: new Prisma.Decimal(item_budget.amount),
            clause: item_budget.clause,
            explanation: item_budget.explanation,
            created_at: new Date(),
            updated_at: new Date(),
          };
          return itemBudget;
        },
      );

      if (updateProposal.form4.amount_required_fsupport) {
        updateProposalPayload.amount_required_fsupport = new Prisma.Decimal(
          updateProposal.form4.amount_required_fsupport,
        );
      }

      message = message + ` some changes from4 has been applied.`;
    }

    if (updateProposal.form5) {
      if (updateProposal.form5.proposal_bank_information_id) {
        updateProposalPayload.bank_information = {
          connect: {
            id: updateProposal.form5.proposal_bank_information_id,
          },
        };
      }
      message = message + ` some changes from5 has been applied.`;
    }

    if (updateProposal.step) {
      // updateProposalPayload.step = updateProposal.step;
      updateProposalPayload.proposal_step = {
        connect: {
          id: updateProposal.step,
        },
      };
    }

    let update: proposal | null = null;
    // if updateProposalPayload !== {} then update the proposal
    if (Object.keys(updateProposalPayload).length > 0) {
      const updatedProposal =
        await this.tenderProposalRepository.updateProposal(
          updateProposal.proposal_id,
          updateProposalPayload,
          itemBudgets,
        );

      if (Array.isArray(updatedProposal)) {
        update = updatedProposal[2];
      } else {
        update = updatedProposal;
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

  async changeProposalState(
    currentUser: TenderCurrentUser,
    request: ChangeProposalStateDto,
  ) {
    const proposal = await this.tenderProposalRepository.fetchProposalById(
      request.proposal_id,
    );

    if (!proposal) {
      throw new NotFoundException(
        `Proposal with id ${request.proposal_id} not found`,
      );
    }

    let proposalUpdatePayload: Prisma.proposalUncheckedUpdateInput = {};
    let proposalLogCreateInput: Prisma.proposal_logUncheckedCreateInput = {
      id: nanoid(),
      proposal_id: request.proposal_id,
      reviewer_id: currentUser.id,
      state: appRoleMappers[currentUser.choosenRole] as TenderAppRole, //(default) will be changed later on based on the action
    };
    request.notes && (proposalLogCreateInput.notes = request.notes);
    request.message && (proposalLogCreateInput.message = request.message);

    /* if user is moderator */
    if (currentUser.choosenRole === 'tender_moderator') {
      const mod = await this.moderatorChangeState(
        proposalUpdatePayload,
        proposalLogCreateInput,
        request,
      );
      proposalUpdatePayload = {
        ...proposalUpdatePayload,
        ...mod.proposalUpdatePayload,
      };
      proposalLogCreateInput = {
        ...proposalLogCreateInput,
        ...mod.proposalLogCreateInput,
      };
    }

    /* if user is supervisor */
    if (currentUser.choosenRole === 'tender_project_supervisor') {
      const supervisorResult = await this.supervisorChangeState(
        proposal,
        proposalUpdatePayload,
        proposalLogCreateInput,
        request,
      );
      proposalUpdatePayload = {
        ...proposalUpdatePayload,
        ...supervisorResult.proposalUpdatePayload,
      };
      proposalLogCreateInput = {
        ...proposalLogCreateInput,
        ...supervisorResult.proposalLogCreateInput,
      };
    }

    /* if user is project manager */
    if (currentUser.choosenRole === 'tender_project_manager') {
      const pm = await this.projectManagerChangeState(
        proposal,
        proposalUpdatePayload,
        proposalLogCreateInput,
        request,
      );
      proposalUpdatePayload = {
        ...proposalUpdatePayload,
        ...pm.proposalUpdatePayload,
      };
      proposalLogCreateInput = {
        ...proposalLogCreateInput,
        ...pm.proposalLogCreateInput,
      };
    }

    /* if user is ceo */
    if (currentUser.choosenRole === 'tender_ceo') {
    }

    /* update proposal and create the logs */
    const updateProposalResult =
      await this.tenderProposalRepository.updateProposalState(
        request.proposal_id,
        proposalUpdatePayload,
        proposalLogCreateInput,
      );

    const { proposal_logs } = updateProposalResult;
    await this.sendChangeStateNotification(
      {
        data: proposal_logs,
      },
      currentUser.choosenRole,
    );

    return updateProposalResult.proposal;
    // 'ACCOUNTS_MANAGER' 'ADMIN'  'CASHIER' 'CLIENT'  'FINANCE';
  }

  /* Moderator Done */
  async moderatorChangeState(
    proposalUpdatePayload: Prisma.proposalUncheckedUpdateInput,
    proposalLogCreateInput: Prisma.proposal_logUncheckedCreateInput,
    request: ChangeProposalStateDto,
  ) {
    /* moderator only allowed to acc and reject */
    if (
      [ProposalAction.ACCEPT, ProposalAction.REJECT].indexOf(request.action) < 0
    ) {
      throw new BadRequestException(
        `You are not allowed to perform this action ${request.action}`,
      );
    }
    /* if moderator_acc_payload is not exist  */
    if (!request.moderator_payload) {
      throw new BadRequestException('Moderator accept payload is required!');
    }

    /* validate the sended track */
    const track = await this.tenderProposalRepository.findTrackById(
      request.moderator_payload.project_track,
    );
    if (!track) {
      throw new BadRequestException(
        `Invalid Track (${request.moderator_payload.project_track})`,
      );
    }

    if (request.action === ProposalAction.ACCEPT) {
      /* proposal */
      proposalUpdatePayload.inner_status =
        InnerStatusEnum.ACCEPTED_BY_MODERATOR;
      proposalUpdatePayload.outter_status = OutterStatusEnum.ONGOING;
      proposalUpdatePayload.state = TenderAppRoleEnum.PROJECT_SUPERVISOR;
      proposalUpdatePayload.project_track = track.id;

      /* if track not ALL, only for supervisor in defined track */
      if (request.moderator_payload.supervisor_id) {
        proposalUpdatePayload.supervisor_id =
          request.moderator_payload.supervisor_id;
      }

      /* log */
      proposalLogCreateInput.action = ProposalAction.ACCEPT;
      proposalLogCreateInput.state = TenderAppRoleEnum.MODERATOR;
      proposalLogCreateInput.user_role = TenderAppRoleEnum.MODERATOR;
    }

    if (request.action === ProposalAction.REJECT) {
      /* proposal */
      proposalUpdatePayload.inner_status =
        InnerStatusEnum.REJECTED_BY_MODERATOR;
      proposalUpdatePayload.outter_status = OutterStatusEnum.CANCELED;
      proposalUpdatePayload.state = TenderAppRoleEnum.MODERATOR;
      proposalUpdatePayload.project_track = track.id;

      /* log */
      proposalLogCreateInput.action = ProposalAction.REJECT;
      proposalLogCreateInput.state = TenderAppRoleEnum.MODERATOR;
      proposalLogCreateInput.user_role = TenderAppRoleEnum.MODERATOR;
    }

    return {
      proposalUpdatePayload,
      proposalLogCreateInput,
    };
  }

  async supervisorChangeState(
    proposal: proposal,
    proposalUpdatePayload: Prisma.proposalUncheckedUpdateInput,
    proposalLogCreateInput: Prisma.proposal_logUncheckedCreateInput,
    request: ChangeProposalStateDto,
  ) {
    /* supervisor only allowed to acc and reject and step back */
    if (
      [
        ProposalAction.ACCEPT,
        ProposalAction.REJECT,
        ProposalAction.STEP_BACK,
      ].indexOf(request.action) < 0
    ) {
      throw new BadRequestException(
        `You are not allowed to perform this action ${request.action}`,
      );
    }

    /* acc */
    if (request.action === ProposalAction.ACCEPT) {
      if (proposal.project_track === 'CONCESSIONAL_GRANTS') {
        //
      } else {
      }
    }

    /* reject (same for grants and not grants) DONE */
    if (request.action === ProposalAction.REJECT) {
      /* proposal */
      proposalUpdatePayload.inner_status = 'REJECTED_BY_SUPERVISOR';
      proposalUpdatePayload.outter_status = 'CANCELED';
      proposalUpdatePayload.state = 'PROJECT_SUPERVISOR';

      /* log */
      proposalLogCreateInput.action = ProposalAction.REJECT;
      proposalLogCreateInput.state = 'PROJECT_SUPERVISOR';
      proposalLogCreateInput.user_role = 'PROJECT_SUPERVISOR';
    }

    /* step back (same for grants and not grants) DONE */
    if (request.action === ProposalAction.STEP_BACK) {
      /* proposal */
      proposalUpdatePayload.inner_status = 'CREATED_BY_CLIENT';
      proposalUpdatePayload.outter_status = 'ONGOING';
      proposalUpdatePayload.state = 'MODERATOR';

      /* log */
      proposalLogCreateInput.action = ProposalAction.STEP_BACK;
      proposalLogCreateInput.state = 'PROJECT_SUPERVISOR';
      proposalLogCreateInput.user_role = 'PROJECT_SUPERVISOR';
    }

    return {
      proposalUpdatePayload,
      proposalLogCreateInput,
    };
  }

  /* Project Manager Done */
  async projectManagerChangeState(
    proposal: proposal,
    proposalUpdatePayload: Prisma.proposalUncheckedUpdateInput,
    proposalLogCreateInput: Prisma.proposal_logUncheckedCreateInput,
    request: ChangeProposalStateDto,
  ) {
    /* Project manager only allowed to acc and reject and step back, and ask for consultation*/
    if (
      [
        ProposalAction.ACCEPT,
        ProposalAction.REJECT,
        ProposalAction.STEP_BACK,
        ProposalAction.ACCEPT_AND_ASK_FOR_CONSULTION,
      ].indexOf(request.action) < 0
    ) {
      throw new BadRequestException(
        `You are not allowed to perform this action ${request.action}`,
      );
    }

    if (request.action === ProposalAction.ACCEPT) {
      /* proposal */
      proposalUpdatePayload.inner_status =
        InnerStatusEnum.ACCEPTED_BY_PROJECT_MANAGER;
      proposalUpdatePayload.outter_status = OutterStatusEnum.ONGOING;
      proposalUpdatePayload.state = TenderAppRoleEnum.CEO;

      /* log */
      proposalLogCreateInput.action = ProposalAction.ACCEPT;
      proposalLogCreateInput.state = TenderAppRoleEnum.PROJECT_MANAGER;
      proposalLogCreateInput.user_role = TenderAppRoleEnum.PROJECT_MANAGER;
    }

    if (request.action === ProposalAction.ACCEPT_AND_ASK_FOR_CONSULTION) {
      /* proposal */
      proposalUpdatePayload.inner_status =
        InnerStatusEnum.ACCEPTED_AND_NEED_CONSULTANT;
      proposalUpdatePayload.outter_status = OutterStatusEnum.ONGOING;
      proposalUpdatePayload.state = TenderAppRoleEnum.CONSULTANT;

      /* log */
      proposalLogCreateInput.action = ProposalAction.ACCEPT;
      proposalLogCreateInput.state = TenderAppRoleEnum.PROJECT_MANAGER;
      proposalLogCreateInput.user_role = TenderAppRoleEnum.PROJECT_MANAGER;
    }

    if (request.action === ProposalAction.REJECT) {
      /* proposal */
      proposalUpdatePayload.inner_status =
        InnerStatusEnum.REJECTED_BY_PROJECT_MANAGER;
      proposalUpdatePayload.outter_status = OutterStatusEnum.CANCELED;
      proposalUpdatePayload.state = TenderAppRoleEnum.PROJECT_MANAGER;

      /* log */
      proposalLogCreateInput.action = ProposalAction.REJECT;
      proposalLogCreateInput.state = TenderAppRoleEnum.PROJECT_MANAGER;
      proposalLogCreateInput.user_role = TenderAppRoleEnum.PROJECT_MANAGER;
    }

    if (request.action === ProposalAction.STEP_BACK) {
      /* proposal */
      proposalUpdatePayload.inner_status =
        InnerStatusEnum.ACCEPTED_BY_MODERATOR;
      proposalUpdatePayload.outter_status = OutterStatusEnum.ONGOING;
      proposalUpdatePayload.state = TenderAppRoleEnum.PROJECT_SUPERVISOR;
      proposalUpdatePayload.project_manager_id = null;

      /* log */
      proposalLogCreateInput.action = ProposalAction.STEP_BACK;
      proposalLogCreateInput.state = TenderAppRoleEnum.PROJECT_MANAGER;
      proposalLogCreateInput.user_role = TenderAppRoleEnum.PROJECT_MANAGER;
    }

    return {
      proposalUpdatePayload,
      proposalLogCreateInput,
    };
  }

  /* CEO DONE */
  async ceoChangeState(
    proposal: proposal,
    proposalUpdatePayload: Prisma.proposalUncheckedUpdateInput,
    proposalLogCreateInput: Prisma.proposal_logUncheckedCreateInput,
    request: ChangeProposalStateDto,
  ) {
    /* CEO only allowed to acc and reject and step back */
    if (
      [
        ProposalAction.ACCEPT,
        ProposalAction.REJECT,
        ProposalAction.STEP_BACK,
      ].indexOf(request.action) < 0
    ) {
      throw new BadRequestException(
        `You are not allowed to perform this action ${request.action}`,
      );
    }

    if (request.action === ProposalAction.ACCEPT) {
      /* proposal */
      proposalUpdatePayload.inner_status =
        InnerStatusEnum.ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION;
      proposalUpdatePayload.outter_status = 'ONGOING';
      proposalUpdatePayload.state = TenderAppRoleEnum.CEO;

      /* log */
      proposalLogCreateInput.action = ProposalAction.ACCEPT;
      proposalLogCreateInput.state = TenderAppRoleEnum.CEO;
      proposalLogCreateInput.user_role = TenderAppRoleEnum.CEO;
    }

    if (request.action === ProposalAction.REJECT) {
      /* proposal */
      proposalUpdatePayload.inner_status = InnerStatusEnum.REJECTED_BY_CEO;
      proposalUpdatePayload.outter_status = OutterStatusEnum.CANCELED;
      proposalUpdatePayload.state = TenderAppRoleEnum.CEO;

      /* log */
      proposalLogCreateInput.action = ProposalAction.REJECT;
      proposalLogCreateInput.state = TenderAppRoleEnum.CEO;
      proposalLogCreateInput.user_role = TenderAppRoleEnum.CEO;
    }

    if (request.action === ProposalAction.STEP_BACK) {
      /* proposal */
      proposalUpdatePayload.inner_status =
        InnerStatusEnum.ACCEPTED_BY_SUPERVISOR;
      proposalUpdatePayload.outter_status = OutterStatusEnum.ONGOING;
      proposalUpdatePayload.state = TenderAppRoleEnum.PROJECT_MANAGER;
      /* log */
      proposalLogCreateInput.action = ProposalAction.STEP_BACK;
      proposalLogCreateInput.state = TenderAppRoleEnum.CEO;
      proposalLogCreateInput.user_role = TenderAppRoleEnum.CEO;
    }
  }

  /* Consultant Done */
  async consultantChangeState(
    proposal: proposal,
    proposalUpdatePayload: Prisma.proposalUncheckedUpdateInput,
    proposalLogCreateInput: Prisma.proposal_logUncheckedCreateInput,
    request: ChangeProposalStateDto,
  ) {
    /* Consultant only allowed to acc and reject and step back */
    if (
      [ProposalAction.ACCEPT, ProposalAction.REJECT].indexOf(request.action) < 0
    ) {
      throw new BadRequestException(
        `You are not allowed to perform this action ${request.action}`,
      );
    }

    if (request.action === ProposalAction.ACCEPT) {
      /* proposal */
      proposalUpdatePayload.inner_status =
        InnerStatusEnum.ACCEPTED_BY_CONSULTANT;
      proposalUpdatePayload.outter_status = OutterStatusEnum.ONGOING;
      proposalUpdatePayload.state = TenderAppRoleEnum.CEO;

      /* log */
      proposalLogCreateInput.action = ProposalAction.ACCEPT;
      proposalLogCreateInput.state = TenderAppRoleEnum.CONSULTANT;
      proposalLogCreateInput.user_role = TenderAppRoleEnum.CONSULTANT;
    }

    if (request.action === ProposalAction.REJECT) {
      /* proposal */
      proposalUpdatePayload.inner_status =
        InnerStatusEnum.REJECTED_BY_CONSULTANT;
      proposalUpdatePayload.outter_status = OutterStatusEnum.ONGOING;
      proposalUpdatePayload.state = TenderAppRoleEnum.PROJECT_MANAGER;

      /* log */
      proposalLogCreateInput.action = ProposalAction.REJECT;
      proposalLogCreateInput.state = TenderAppRoleEnum.CONSULTANT;
      proposalLogCreateInput.user_role = TenderAppRoleEnum.CONSULTANT;
    }
  }

  async sendChangeStateNotification(
    log: IProposalLogsResponse,
    reviewerRole: string,
  ) {
    const actions =
      log.data.action && ['accept', 'reject'].indexOf(log.data.action) > -1
        ? log.data.action
        : 'review';

    let subject = `Proposal ${actions}ed Notification`;
    let clientContent = `Your proposal (${log.data.proposal.project_name}), has been ${actions}ed by ${reviewerRole} (${log.data.reviewer.employee_name}) at (${log.data.created_at})`;
    let employeeContent = `Your review has been submitted for proposal (${log.data.proposal.project_name}) at (${log.data.created_at}), and already been notified to the user ${log.data.proposal.user.employee_name} (${log.data.proposal.user.email})`;

    // email notification
    const employeeEmailNotifPayload: SendEmailDto = {
      mailType: 'plain',
      to: log.data.reviewer.email,
      from: 'no-reply@hcharity.org',
      subject,
      content: employeeContent,
    };

    const clientEmailNotifPayload: SendEmailDto = {
      mailType: 'plain',
      to: log.data.proposal.user.email,
      from: 'no-reply@hcharity.org',
      subject,
      content: clientContent,
    };

    this.emailService.sendMail(employeeEmailNotifPayload);
    this.emailService.sendMail(clientEmailNotifPayload);

    // create web app notification
    const employeeWebNotifPayload: CreateNotificationDto = {
      type: 'PROPOSAL',
      user_id: log.data.reviewer_id,
      proposal_id: log.data.proposal_id,
      subject,
      content: employeeContent,
    };

    const clientWebNotifPayload: CreateNotificationDto = {
      type: 'PROPOSAL',
      user_id: log.data.proposal.submitter_user_id,
      proposal_id: log.data.proposal_id,
      subject,
      content: clientContent,
    };

    await this.tenderNotificationService.createMany({
      payloads: [employeeWebNotifPayload, clientWebNotifPayload],
    });

    if (
      log.data.proposal.user.mobile_number &&
      log.data.proposal.user.mobile_number !== ''
    ) {
      this.twilioService.sendSMS({
        to: log.data.proposal.user.mobile_number,
        body: subject + ',' + clientContent,
      });
    }
    if (
      log.data.reviewer.mobile_number &&
      log.data.reviewer.mobile_number !== ''
    ) {
      this.twilioService.sendSMS({
        to: log.data.reviewer.mobile_number,
        body: subject + ',' + employeeContent,
      });
    }
  }

  async updateProposalByCmsUsers(
    user: user,
    body: any,
    id: string,
    role: string,
  ) {
    const { action } = body;
    if (action === ProposalAction.ACCEPT) {
      return this.acceptProposal(id, body, role, user);
    } else if (action === ProposalAction.REJECT) {
      return this.rejectProposal(id, body, role, user);
    } else if (action === ProposalAction.STEP_BACK) {
      return this.proposalStepBack(id, body, role, user);
    } else if (
      action === ProposalAction.ACCEPT_AND_ASK_FOR_CONSULTION &&
      role === TenderAppRoleEnum.PROJECT_MANAGER
    ) {
      const proposal = await this.updateProposalStatus(
        id,
        InnerStatusEnum.ACCEPTED_AND_NEED_CONSULTANT,
      );
      await this.createProposalLog(
        body,
        role,
        proposal,
        user.id,
        `ProposalWasAccepteddBy@${user.employee_name}`,
        ProposalAction.ACCEPT_AND_ASK_FOR_CONSULTION,
      );
      return proposal;
    } else if (
      (role === TenderAppRoleEnum.CEO ||
        role === TenderAppRoleEnum.PROJECT_MANAGER ||
        role === TenderAppRoleEnum.CASHIER ||
        role === TenderAppRoleEnum.FINANCE) &&
      action === ProposalAction.ASK_FOR_UPDATE
    ) {
      await this.updateRequestToTheSuperVisor(user, body, id, role);
    } else {
      throw new UnauthorizedException('There is no such action to do!');
    }
  }

  async updateRequestToTheSuperVisor(
    user: user,
    body: any,
    id: string,
    role: string,
  ) {
    const oldProposal = await this.prismaService.proposal.findUnique({
      where: {
        id,
      },
    });
    const old_inner_status = oldProposal?.inner_status
      ? oldProposal.inner_status
      : undefined;
    const proposal = await this.updateProposalStatus(
      id,
      InnerStatusEnum.ACCEPTED_BY_MODERATOR,
      undefined,
      OutterStatusEnum.UPDATE_REQUEST,
      old_inner_status,
    );
    await this.createProposalLog(
      body,
      role,
      proposal,
      user.id,
      `ProposalHasAnUpdateRequestBy@${user.employee_name}`,
      ProposalAction.ASK_FOR_UPDATE,
    );
    return proposal;
  }

  async proposalStepBack(id: string, body: any, role: string, user: user) {
    let proposal;
    if (role === TenderAppRoleEnum.PROJECT_SUPERVISOR) {
      proposal = await this.updateProposalStatus(
        id,
        InnerStatusEnum.CREATED_BY_CLIENT,
        undefined,
        OutterStatusEnum.ONGOING,
      );
      await this.createProposalLog(
        body,
        role,
        proposal,
        user.id,
        `ProposalWasRolledBackBy@${user.employee_name}`,
        ProposalAction.STEP_BACK,
      );
    } else if (role === TenderAppRoleEnum.PROJECT_MANAGER) {
      proposal = await this.updateProposalStatus(
        id,
        InnerStatusEnum.ACCEPTED_BY_MODERATOR,
        undefined,
        OutterStatusEnum.ONGOING,
      );
      await this.createProposalLog(
        body,
        role,
        proposal,
        user.id,
        `ProposalWasRolledBackBy@${user.employee_name}`,
        ProposalAction.STEP_BACK,
      );
    } else if (role === TenderAppRoleEnum.CEO) {
      proposal = await this.updateProposalStatus(
        id,
        InnerStatusEnum.ACCEPTED_BY_PROJECT_MANAGER,
        undefined,
        OutterStatusEnum.ONGOING,
      );
      await this.createProposalLog(
        body,
        role,
        proposal,
        user.id,
        `ProposalWasRolledBackBy@${user.employee_name}`,
        ProposalAction.STEP_BACK,
      );
    } else {
      throw new UnauthorizedException(
        "User doesn't have the required role to access this resource!",
      );
    }
    return proposal;
  }

  async rejectProposal(id: string, body: any, role: string, user: user) {
    let proposal;
    if (role === TenderAppRoleEnum.MODERATOR) {
      proposal = await this.updateProposalStatus(
        id,
        InnerStatusEnum.REJECTED_BY_MODERATOR,
        undefined,
        OutterStatusEnum.CANCELED,
      );
      await this.createProposalLog(
        body,
        role,
        proposal,
        user.id,
        `ProposalWasRejectedBy@${user.employee_name}`,
        ProposalAction.REJECT,
      );
    } else if (role === TenderAppRoleEnum.PROJECT_SUPERVISOR) {
      proposal = await this.updateProposalStatus(
        id,
        InnerStatusEnum.REJECTED_BY_SUPERVISOR,
        undefined,
        OutterStatusEnum.CANCELED,
      );
      await this.createProposalLog(
        body,
        role,
        proposal,
        user.id,
        `ProposalWasRejectedBy@${user.employee_name}`,
        ProposalAction.REJECT,
      );
    } else if (role === TenderAppRoleEnum.PROJECT_MANAGER) {
      proposal = await this.updateProposalStatus(
        id,
        InnerStatusEnum.REJECTED_BY_PROJECT_MANAGER,
        undefined,
        OutterStatusEnum.CANCELED,
      );
      await this.createProposalLog(
        body,
        role,
        proposal,
        user.id,
        `ProposalWasRejectedBy@${user.employee_name}`,
        ProposalAction.REJECT,
      );
    } else if (role === TenderAppRoleEnum.CONSULTANT) {
      proposal = await this.updateProposalStatus(
        id,
        InnerStatusEnum.REJECTED_BY_CONSULTANT,
      );
      await this.createProposalLog(
        body,
        role,
        proposal,
        user.id,
        `ProposalWasRejectedBy@${user.employee_name}`,
        ProposalAction.REJECT,
      );
    } else if (role === TenderAppRoleEnum.CEO) {
      proposal = await this.updateProposalStatus(
        id,
        InnerStatusEnum.REJECTED_BY_CEO,
        undefined,
        OutterStatusEnum.CANCELED,
      );
      await this.createProposalLog(
        body,
        role,
        proposal,
        user.id,
        `ProposalWasRejectedBy@${user.employee_name}`,
        ProposalAction.REJECT,
      );
    } else {
      throw new UnauthorizedException(
        "User doesn't have the required role to access this resource!",
      );
    }
    return proposal;
  }

  async acceptProposal(id: string, body: any, role: string, user: user) {
    let proposal;
    if (role === TenderAppRoleEnum.MODERATOR) {
      proposal = await this.updateProposalStatus(
        id,
        InnerStatusEnum.ACCEPTED_BY_MODERATOR,
        body.track_id,
      );
      await this.createProposalLog(
        body,
        role,
        proposal,
        user.id,
        `ProposalWasAcceptedBy@${user.employee_name}`,
        ProposalAction.ACCEPT,
      );
    } else if (role === TenderAppRoleEnum.PROJECT_SUPERVISOR) {
      proposal = await this.updateProposalStatus(
        id,
        InnerStatusEnum.ACCEPTED_BY_SUPERVISOR,
        body.track_id,
      );
      await this.createProposalLog(
        body,
        role,
        proposal,
        user.id,
        `ProposalWasAcceptedBy@${user.employee_name}`,
        ProposalAction.ACCEPT,
      );
      const track = await this.prismaService.track.findUnique({
        where: { id: proposal.track_id as string },
      });
      if (!track)
        throw new NotFoundException('this proposal does not belonge to track');
      if (track.name === 'مسار المنح العام') {
        const recommended_support_consultant =
          body.consultant_form.recommended_support_consultant;
        delete body.consultant_form.recommended_support_consultant;
        const consultantForm = await this.prismaService.consultant_form.create({
          data: {
            ...body.consultant_form,
            proposal_id: proposal.id,
            supervisor_id: user.id,
          },
        });
        for (let i = 0; i < recommended_support_consultant.length; i++) {
          recommended_support_consultant[i].consultant_form_id =
            consultantForm.id;
        }
        await this.prismaService.recommended_support_consultant.createMany({
          data: recommended_support_consultant,
        });
      } else {
        await this.prismaService.supervisor_form.create({
          data: {
            ...body.supervisor_form,
            proposal_id: proposal.id,
            supervisor_id: user.id,
          },
        });
      }
    } else if (role === TenderAppRoleEnum.PROJECT_MANAGER) {
      proposal = await this.updateProposalStatus(
        id,
        InnerStatusEnum.ACCEPTED_BY_PROJECT_MANAGER,
      );
      await this.createProposalLog(
        body,
        role,
        proposal,
        user.id,
        `ProposalWasAcceptedBy@${user.employee_name}`,
        ProposalAction.ACCEPT,
      );
    } else if (role === TenderAppRoleEnum.CONSULTANT) {
      proposal = await this.updateProposalStatus(
        id,
        InnerStatusEnum.ACCEPTED_BY_CONSULTANT,
      );
      await this.createProposalLog(
        body,
        role,
        proposal,
        user.id,
        `ProposalWasAcceptedBy@${user.employee_name}`,
        ProposalAction.ACCEPT,
      );
      const projectManager = (await this.prismaService.user.findUnique({
        where: {
          id: proposal.project_manager_id as string,
        },
      })) as user;
      if (!projectManager)
        throw new NotFoundException(
          'there is no project manager in this proposal',
        );
      await this.createProposalLog(
        body,
        role,
        proposal,
        projectManager.id,
        `ProposalWasAcceptedBy@${projectManager.employee_name}`,
        ProposalAction.ACCEPT,
      );
    } else if (role === TenderAppRoleEnum.CEO) {
      proposal = await this.updateProposalStatus(
        id,
        InnerStatusEnum.ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION,
      );
      await this.createProposalLog(
        body,
        role,
        proposal,
        user.id,
        `ProposalWasAcceptedBy@${user.employee_name}`,
        ProposalAction.ACCEPT,
      );
    } else {
      throw new UnauthorizedException(
        "User doesn't have the required role to access this resource!",
      );
    }
    return proposal;
  }

  async updateProposalStatus(
    id: string,
    inner_status: string,
    track_id?: string,
    outter_status?: string,
    old_inner_status?: string,
  ) {
    return this.prismaService.proposal.update({
      where: {
        id,
      },
      data: {
        inner_status,
        track_id,
        outter_status,
        old_inner_status,
      },
    });
  }

  async createProposalLog(
    body: any,
    user_role: string,
    proposal: proposal,
    reviewer_id: string,
    message: string,
    action: string,
  ) {
    await this.prismaService.proposal_log.create({
      data: {
        id: body.log_id,
        proposal_id: proposal.id,
        ...(body.notes && { notes: body.notes }),
        message,
        reviewer_id,
        user_role,
        client_user_id: proposal.submitter_user_id,
        action,
      },
    });
  }

  async fetchTrack(limit: number, page: number) {
    return await this.tenderProposalRepository.fetchTrack(limit, page);
  }
}
