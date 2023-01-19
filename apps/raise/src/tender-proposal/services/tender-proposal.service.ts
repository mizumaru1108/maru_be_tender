import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, proposal, user } from '@prisma/client';
import { nanoid } from 'nanoid';
import { PrismaService } from '../../prisma/prisma.service';
import {
  appRoleMappers,
  TenderAppRole,
  TenderAppRoleEnum,
} from '../../tender-commons/types';
import { TenderCurrentUser } from '../../tender-user/user/interfaces/current-user.interface';

import { ChangeProposalStateDto } from '../dtos/requests/proposal/change-proposal-state.dto';

import { TenderProposalRepository } from '../repositories/tender-proposal.repository';

import { SendEmailDto } from '../../libs/email/dtos/requests/send-email.dto';
import { EmailService } from '../../libs/email/email.service';
import { ROOT_LOGGER } from '../../libs/root-logger';
import { TwilioService } from '../../libs/twilio/services/twilio.service';
import { CreateNotificationDto } from '../../tender-notification/dtos/requests/create-notification.dto';
import { TenderNotificationService } from '../../tender-notification/services/tender-notification.service';

import { ConfigService } from '@nestjs/config';
import { AllowedFileType } from '../../commons/enums/allowed-filetype.enum';
import { envLoadErrorHelper } from '../../commons/helpers/env-loaderror-helper';
import { validateAllowedExtension } from '../../commons/utils/validate-allowed-extension';
import { validateFileSize } from '../../commons/utils/validate-file-size';
import { BunnyService } from '../../libs/bunny/services/bunny.service';
import {
  InnerStatusEnum,
  OutterStatusEnum,
  ProposalAction,
} from '../../tender-commons/types/proposal';
import { ProposalCreateDto } from '../dtos/requests/proposal/proposal-create.dto';
import { ProposalSaveDraftDto } from '../dtos/requests/proposal/proposal-save-draft';
import { IProposalLogsResponse } from '../interfaces/proposal-logs-response';
import { CreateItemBudgetsMapper } from '../mappers/create-item-budgets.mappers';
import { CreateProposalMapper } from '../mappers/create-proposal.mapper';
import { UpdateProposalMapper } from '../mappers/update-proposal.mapper';
import { TenderProposalLogRepository } from '../repositories/tender-proposal-log.repository';

@Injectable()
export class TenderProposalService {
  private readonly appEnv: string;
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderProposalService.name,
  });

  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly twilioService: TwilioService,
    private readonly configService: ConfigService,
    private readonly bunnyService: BunnyService,
    private readonly tenderProposalRepository: TenderProposalRepository,
    private readonly tenderNotificationService: TenderNotificationService,
    private readonly tenderProposalLogRepository: TenderProposalLogRepository,
  ) {
    const environment = this.configService.get('APP_ENV');
    if (!environment) envLoadErrorHelper('APP_ENV');
    this.appEnv = environment;
  }

  async create(userId: string, request: ProposalCreateDto) {
    const proposalCreatePayload: Prisma.proposalUncheckedCreateInput =
      CreateProposalMapper(userId, request);

    const proposal_id = nanoid();
    proposalCreatePayload.id = proposal_id;

    let projectAttachmentPath: string | undefined = undefined;
    let projectAttachmentBuffer: Buffer | undefined = undefined;
    let uploadedProjectAttachmentPath: string | undefined = undefined;
    let letterOfSupportPath: string | undefined = undefined;
    let letterOfSupportBuffer: Buffer | undefined = undefined;
    let uploadedLetterOfSupportPath: string | undefined = undefined;
    let uploadedFilePath: string[] = [];

    let proposal_item_budgets:
      | Prisma.proposal_item_budgetCreateManyInput[]
      | undefined = undefined;

    /* validate and create path */
    const maxSize: number = 1024 * 1024 * 512; // 512MB
    const allowedType: AllowedFileType[] = [
      AllowedFileType.JPG,
      AllowedFileType.JPEG,
      AllowedFileType.PNG,
      AllowedFileType.GIF,
      AllowedFileType.PDF,
      AllowedFileType.DOC,
      AllowedFileType.DOCX,
      AllowedFileType.XLS,
      AllowedFileType.XLSX,
      AllowedFileType.PPT,
      AllowedFileType.PPTX,
    ];

    if (request.proposal_bank_information_id) {
      const isMyOwnBank =
        await this.tenderProposalRepository.validateOwnBankAccount(
          userId,
          request.proposal_bank_information_id,
        );
      if (!isMyOwnBank) {
        throw new BadRequestException('Bank account is not yours');
      }
      proposalCreatePayload.proposal_bank_id =
        request.proposal_bank_information_id;
    }

    // upload the project_attachments to bunny cloud service
    if (request.project_attachments) {
      try {
        /* project attachment */
        let projectAttachmentfileName =
          request.project_attachments.fullName
            .replace(/[^a-zA-Z0-9]/g, '')
            .slice(0, 10) +
          new Date().getTime() +
          '.' +
          request.project_attachments.fileExtension.split('/')[1];

        projectAttachmentPath = `tmra/${this.appEnv}/organization/tender-management/proposal-files/${userId}-${projectAttachmentfileName}`;

        projectAttachmentBuffer = Buffer.from(
          request.project_attachments.base64Data.replace(
            /^data:.*;base64,/,
            '',
          ),
          'base64',
        );

        validateAllowedExtension(
          request.project_attachments.fileExtension,
          allowedType,
        );
        validateFileSize(projectAttachmentBuffer.length, maxSize);

        const imageUrl = await this.bunnyService.uploadFileBase64(
          request.project_attachments.fullName,
          projectAttachmentBuffer,
          projectAttachmentPath,
          `Uploading Proposal Project Attachment from user ${userId}`,
        );

        uploadedProjectAttachmentPath = imageUrl;
        uploadedFilePath.push(imageUrl);
        proposalCreatePayload.project_attachments = {
          url: imageUrl,
          type: request.project_attachments.fileExtension,
          size: projectAttachmentBuffer.length,
        };
      } catch (error) {
        this.logger.error('Error while uploading project attachment: ' + error);
        if (uploadedFilePath.length > 0) {
          uploadedFilePath.forEach(async (path) => {
            await this.bunnyService.deleteMedia(path, true);
          });
        }
        throw error;
      }
    }

    if (request.letter_ofsupport_req) {
      try {
        /* letter of support */
        let letterOfSupportfileName =
          request.letter_ofsupport_req.fullName
            .replace(/[^a-zA-Z0-9]/g, '')
            .slice(0, 10) +
          new Date().getTime() +
          '.' +
          request.letter_ofsupport_req.fileExtension.split('/')[1];

        letterOfSupportPath = `tmra/${this.appEnv}/organization/tender-management/proposal-files/${userId}-${letterOfSupportfileName}`;

        letterOfSupportBuffer = Buffer.from(
          request.letter_ofsupport_req.base64Data.replace(
            /^data:.*;base64,/,
            '',
          ),
          'base64',
        );

        validateAllowedExtension(
          request.letter_ofsupport_req.fileExtension,
          allowedType,
        );
        validateFileSize(letterOfSupportBuffer.length, maxSize);

        const imageUrl = await this.bunnyService.uploadFileBase64(
          request.letter_ofsupport_req.fullName,
          letterOfSupportBuffer,
          letterOfSupportPath,
          `Uploading Proposal Letter of support from user ${userId}`,
        );

        uploadedLetterOfSupportPath = imageUrl;
        uploadedFilePath.push(imageUrl);
        proposalCreatePayload.letter_ofsupport_req = {
          url: imageUrl,
          type: request.letter_ofsupport_req.fileExtension,
          size: letterOfSupportBuffer.length,
        };
      } catch (error) {
        this.logger.error('Error while uploading letter of support: ' + error);
        if (uploadedFilePath.length > 0) {
          uploadedFilePath.forEach(async (path) => {
            await this.bunnyService.deleteMedia(path, true);
          });
        }
        throw error;
      }
    }

    if (request.detail_project_budgets) {
      proposal_item_budgets = CreateItemBudgetsMapper(
        proposal_id,
        request.detail_project_budgets,
      );
    }

    // create proposal and the logs
    const createdProposal = await this.tenderProposalRepository.create(
      proposalCreatePayload,
      uploadedProjectAttachmentPath,
      uploadedLetterOfSupportPath,
      proposal_item_budgets,
    );

    return createdProposal;
  }

  async saveDraft(userId: string, request: ProposalSaveDraftDto) {
    // create payload for update proposal
    const updateProposalPayload: Prisma.proposalUncheckedUpdateInput =
      UpdateProposalMapper(request);

    let proposal_item_budgets:
      | Prisma.proposal_item_budgetCreateManyInput[]
      | undefined = undefined;

    let projectAttachmentBuffer: Buffer | undefined = undefined;
    let letterOfSupportBuffer: Buffer | undefined = undefined;
    let uploadedFilePath: string[] = [];

    // find proposal by id
    const proposal = await this.tenderProposalRepository.fetchProposalById(
      request.proposal_id,
    );
    if (!proposal) {
      throw new BadRequestException(`Proposal not found`);
    }

    if (proposal.submitter_user_id !== userId) {
      throw new BadRequestException(
        `You are not allowed to edit this proposal`,
      );
    }

    if (request.proposal_bank_information_id) {
      const isMyOwnBank =
        await this.tenderProposalRepository.validateOwnBankAccount(
          userId,
          request.proposal_bank_information_id,
        );
      if (!isMyOwnBank) {
        throw new BadRequestException('Bank account is not yours');
      }
    }

    /* validate and create path */
    const maxSize: number = 1024 * 1024 * 512; // 512MB
    const allowedType: AllowedFileType[] = [
      AllowedFileType.JPG,
      AllowedFileType.JPEG,
      AllowedFileType.PNG,
      AllowedFileType.GIF,
      AllowedFileType.PDF,
      AllowedFileType.DOC,
      AllowedFileType.DOCX,
      AllowedFileType.XLS,
      AllowedFileType.XLSX,
      AllowedFileType.PPT,
      AllowedFileType.PPTX,
    ];

    // upload the project_attachments to bunny cloud service
    if (
      request.project_attachments &&
      request.project_attachments.hasOwnProperty('base64Data') &&
      typeof request.project_attachments.base64Data === 'string' &&
      !!request.project_attachments.base64Data &&
      request.project_attachments.hasOwnProperty('fullName') &&
      typeof request.project_attachments.fullName === 'string' &&
      !!request.project_attachments.fullName &&
      request.project_attachments.hasOwnProperty('fileExtension') &&
      typeof request.project_attachments.fileExtension === 'string' &&
      !!request.project_attachments.fileExtension &&
      request.project_attachments.fileExtension.match(
        /^([a-z]+\/[a-z]+)(;[a-z]+=[a-z]+)*$/i,
      )
    ) {
      try {
        /* project attachment */
        let projectAttachmentfileName =
          request.project_attachments.fullName
            .replace(/[^a-zA-Z0-9]/g, '')
            .slice(0, 10) +
          new Date().getTime() +
          '.' +
          request.project_attachments.fileExtension.split('/')[1];

        let projectAttachmentPath = `tmra/${this.appEnv}/organization/tender-management/proposal-files/${userId}/${userId}-${projectAttachmentfileName}`;

        projectAttachmentBuffer = Buffer.from(
          request.project_attachments.base64Data.replace(
            /^data:.*;base64,/,
            '',
          ),
          'base64',
        );

        validateAllowedExtension(
          request.project_attachments.fileExtension,
          allowedType,
        );
        validateFileSize(projectAttachmentBuffer.length, maxSize);

        const imageUrl = await this.bunnyService.uploadFileBase64(
          request.project_attachments.fullName,
          projectAttachmentBuffer,
          projectAttachmentPath,
          `Uploading Proposal Project Attachment from user ${userId}`,
        );

        uploadedFilePath.push(imageUrl);
        updateProposalPayload.project_attachments = {
          url: imageUrl,
          type: request.project_attachments.fileExtension,
          size: projectAttachmentBuffer.length,
        };

        if (
          proposal.project_attachments &&
          proposal.project_attachments.hasOwnProperty('url') &&
          proposal.project_attachments.hasOwnProperty('type') &&
          proposal.project_attachments.hasOwnProperty('size')
        ) {
          const oldFile = proposal.project_attachments as {
            url: string;
            type: string;
            size: number;
          };
          await this.bunnyService.deleteMedia(oldFile.url, true);
        }
      } catch (error) {
        this.logger.log(
          'log',
          'upload project attachments failed, deleting all uploaded files before this file upload',
        );
        if (uploadedFilePath.length > 0) {
          uploadedFilePath.forEach(async (path) => {
            await this.bunnyService.deleteMedia(path, true);
          });
        }
        throw error;
      }
    }

    if (
      request.letter_ofsupport_req &&
      request.letter_ofsupport_req.hasOwnProperty('base64Data') &&
      typeof request.letter_ofsupport_req.base64Data === 'string' &&
      !!request.letter_ofsupport_req.base64Data &&
      request.letter_ofsupport_req.hasOwnProperty('fullName') &&
      typeof request.letter_ofsupport_req.fullName === 'string' &&
      !!request.letter_ofsupport_req.fullName &&
      request.letter_ofsupport_req.hasOwnProperty('fileExtension') &&
      typeof request.letter_ofsupport_req.fileExtension === 'string' &&
      !!request.letter_ofsupport_req.fileExtension &&
      request.letter_ofsupport_req.fileExtension.match(
        /^([a-z]+\/[a-z]+)(;[a-z]+=[a-z]+)*$/i,
      )
    ) {
      try {
        /* letter of support */
        let letterOfSupportfileName =
          request.letter_ofsupport_req.fullName
            .replace(/[^a-zA-Z0-9]/g, '')
            .slice(0, 10) +
          new Date().getTime() +
          '.' +
          request.letter_ofsupport_req.fileExtension.split('/')[1];

        let letterOfSupportPath = `tmra/${this.appEnv}/organization/tender-management/proposal-files/${userId}/${userId}-${letterOfSupportfileName}`;

        letterOfSupportBuffer = Buffer.from(
          request.letter_ofsupport_req.base64Data.replace(
            /^data:.*;base64,/,
            '',
          ),
          'base64',
        );

        validateAllowedExtension(
          request.letter_ofsupport_req.fileExtension,
          allowedType,
        );
        validateFileSize(letterOfSupportBuffer.length, maxSize);

        const imageUrl = await this.bunnyService.uploadFileBase64(
          request.letter_ofsupport_req.fullName,
          letterOfSupportBuffer,
          letterOfSupportPath,
          `Uploading Proposal Letter of support from user ${userId}`,
        );

        uploadedFilePath.push(imageUrl);
        updateProposalPayload.letter_ofsupport_req = {
          url: imageUrl,
          type: request.letter_ofsupport_req.fileExtension,
          size: letterOfSupportBuffer.length,
        };

        if (
          proposal.letter_ofsupport_req &&
          proposal.letter_ofsupport_req.hasOwnProperty('url') &&
          proposal.letter_ofsupport_req.hasOwnProperty('type') &&
          proposal.letter_ofsupport_req.hasOwnProperty('size')
        ) {
          const oldFile = proposal.letter_ofsupport_req as {
            url: string;
            type: string;
            size: number;
          };
          await this.bunnyService.deleteMedia(oldFile.url, true);
        }
      } catch (error) {
        this.logger.log(
          'log',
          'upload letter of support failed, deleting all uploaded files before this file upload',
        );
        if (uploadedFilePath.length > 0) {
          uploadedFilePath.forEach(async (path) => {
            await this.bunnyService.deleteMedia(path, true);
          });
        }
        throw error;
      }
    }

    if (request.detail_project_budgets) {
      proposal_item_budgets = CreateItemBudgetsMapper(
        proposal.id,
        request.detail_project_budgets,
      );
    }

    // create proposal and the logs
    const updatedProposal = await this.tenderProposalRepository.saveDraft(
      proposal.id,
      updateProposalPayload,
      proposal_item_budgets,
      uploadedFilePath,
    );

    return updatedProposal;
  }

  async changeProposalState(
    currentUser: TenderCurrentUser,
    request: ChangeProposalStateDto,
  ) {
    const proposal = await this.tenderProposalRepository.fetchProposalById(
      request.proposal_id,
    );

    const lastLog =
      await this.tenderProposalLogRepository.findLastLogCreateAtByProposalId(
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

    if (currentUser.choosenRole === 'tender_consultant') {
      const consultant = await this.consultantChangeState(
        proposal,
        proposalUpdatePayload,
        proposalLogCreateInput,
        request,
      );
      proposalUpdatePayload = {
        ...proposalUpdatePayload,
        ...consultant.proposalUpdatePayload,
      };
      proposalLogCreateInput = {
        ...proposalLogCreateInput,
        ...consultant.proposalLogCreateInput,
      };
    }

    /* if user is ceo */
    if (currentUser.choosenRole === 'tender_ceo') {
      const ceo = await this.ceoChangeState(
        proposal,
        proposalUpdatePayload,
        proposalLogCreateInput,
        request,
      );
      proposalUpdatePayload = {
        ...proposalUpdatePayload,
        ...ceo.proposalUpdatePayload,
      };
      proposalLogCreateInput = {
        ...proposalLogCreateInput,
        ...ceo.proposalLogCreateInput,
      };
    }

    /* update proposal and create the logs */
    const updateProposalResult =
      await this.tenderProposalRepository.updateProposalState(
        request.proposal_id,
        proposalUpdatePayload,
        proposalLogCreateInput,
        lastLog,
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
      if (!request.reject_reason) {
        throw new BadRequestException('You must provide a reject reason!');
      }
      /* proposal */
      proposalUpdatePayload.inner_status =
        InnerStatusEnum.REJECTED_BY_MODERATOR;
      proposalUpdatePayload.outter_status = OutterStatusEnum.CANCELED;
      proposalUpdatePayload.state = TenderAppRoleEnum.MODERATOR;
      proposalUpdatePayload.project_track = track.id;

      /* log */
      proposalLogCreateInput.action = ProposalAction.REJECT;
      proposalLogCreateInput.reject_reason = request.reject_reason;
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

    return {
      proposalUpdatePayload,
      proposalLogCreateInput,
    };
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

    return {
      proposalUpdatePayload,
      proposalLogCreateInput,
    };
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
    let clientContent = `Your proposal (${log.data.proposal.project_name}), has been ${actions}ed by ${reviewerRole} at (${log.data.created_at})`;
    if (log.data.reviewer) {
      clientContent = `Your proposal (${log.data.proposal.project_name}), has been ${actions}ed by ${reviewerRole} (${log.data.reviewer.employee_name}) at (${log.data.created_at})`;
    }
    let employeeContent = `Your review has been submitted for proposal (${log.data.proposal.project_name}) at (${log.data.created_at}), and already been notified to the user ${log.data.proposal.user.employee_name} (${log.data.proposal.user.email})`;

    // email notification
    if (log.data.reviewer) {
      const employeeEmailNotifPayload: SendEmailDto = {
        mailType: 'plain',
        to: log.data.reviewer.email,
        from: 'no-reply@hcharity.org',
        subject,
        content: employeeContent,
      };
      this.emailService.sendMail(employeeEmailNotifPayload);
    }

    const clientEmailNotifPayload: SendEmailDto = {
      mailType: 'plain',
      to: log.data.proposal.user.email,
      from: 'no-reply@hcharity.org',
      subject,
      content: clientContent,
    };

    this.emailService.sendMail(clientEmailNotifPayload);

    // create web app notification
    if (log.data.reviewer_id) {
      const employeeWebNotifPayload: CreateNotificationDto = {
        type: 'PROPOSAL',
        user_id: log.data.reviewer_id,
        proposal_id: log.data.proposal_id,
        subject,
        content: employeeContent,
      };
      await this.tenderNotificationService.create(employeeWebNotifPayload);
    }

    const clientWebNotifPayload: CreateNotificationDto = {
      type: 'PROPOSAL',
      user_id: log.data.proposal.submitter_user_id,
      proposal_id: log.data.proposal_id,
      subject,
      content: clientContent,
    };
    await this.tenderNotificationService.create(clientWebNotifPayload);

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
      log.data.reviewer &&
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
