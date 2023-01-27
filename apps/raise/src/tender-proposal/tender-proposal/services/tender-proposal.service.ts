import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, proposal } from '@prisma/client';
import { nanoid } from 'nanoid';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  appRoleMappers,
  TenderAppRole,
  TenderAppRoleEnum,
} from '../../../tender-commons/types';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';

import { ChangeProposalStateDto } from '../dtos/requests/change-proposal-state.dto';

import { TenderProposalRepository } from '../repositories/tender-proposal.repository';

import { SendEmailDto } from '../../../libs/email/dtos/requests/send-email.dto';
import { EmailService } from '../../../libs/email/email.service';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { TwilioService } from '../../../libs/twilio/services/twilio.service';
import { CreateNotificationDto } from '../../../tender-notification/dtos/requests/create-notification.dto';
import { TenderNotificationService } from '../../../tender-notification/services/tender-notification.service';

import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { FileMimeTypeEnum } from '../../../commons/enums/file-mimetype.enum';
import { envLoadErrorHelper } from '../../../commons/helpers/env-loaderror-helper';
import { validateAllowedExtension } from '../../../commons/utils/validate-allowed-extension';
import { validateFileSize } from '../../../commons/utils/validate-file-size';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import {
  InnerStatusEnum,
  OutterStatusEnum,
  ProposalAction,
} from '../../../tender-commons/types/proposal';
import { CreateItemBudgetsMapper } from '../mappers/create-item-budgets.mappers';
import { IProposalLogsResponse } from '../../tender-proposal-log/interfaces/proposal-logs-response';
import { TenderProposalLogRepository } from '../../tender-proposal-log/repositories/tender-proposal-log.repository';
import { ProposalSaveDraftDto } from '../dtos/requests/proposal-save-draft';
import { ProposalCreateDto } from '../dtos/requests/proposal-create.dto';
import { CreateProposalMapper } from '../mappers/create-proposal.mapper';
import { UpdateProposalMapper } from '../mappers/update-proposal.mapper';
import { isExistAndValidPhone } from '../../../commons/utils/is-exist-and-valid-phone';

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
    const allowedType: FileMimeTypeEnum[] = [
      FileMimeTypeEnum.JPG,
      FileMimeTypeEnum.JPEG,
      FileMimeTypeEnum.PNG,
      FileMimeTypeEnum.GIF,
      FileMimeTypeEnum.PDF,
      FileMimeTypeEnum.DOC,
      FileMimeTypeEnum.DOCX,
      FileMimeTypeEnum.XLS,
      FileMimeTypeEnum.XLSX,
      FileMimeTypeEnum.PPT,
      FileMimeTypeEnum.PPTX,
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

        projectAttachmentPath = `tmra/${this.appEnv}/organization/tender-management/proposal-files/${userId}/${projectAttachmentfileName}`;

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
        validateFileSize(request.project_attachments.size, maxSize);

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
          size: request.project_attachments.size,
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

        letterOfSupportPath = `tmra/${this.appEnv}/organization/tender-management/proposal-files/${userId}/${letterOfSupportfileName}`;

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
        validateFileSize(request.project_attachments.size, maxSize);

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
          size: request.letter_ofsupport_req.size,
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
    const allowedType: FileMimeTypeEnum[] = [
      FileMimeTypeEnum.JPG,
      FileMimeTypeEnum.JPEG,
      FileMimeTypeEnum.PNG,
      FileMimeTypeEnum.GIF,
      FileMimeTypeEnum.PDF,
      FileMimeTypeEnum.DOC,
      FileMimeTypeEnum.DOCX,
      FileMimeTypeEnum.XLS,
      FileMimeTypeEnum.XLSX,
      FileMimeTypeEnum.PPT,
      FileMimeTypeEnum.PPTX,
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

        let projectAttachmentPath = `tmra/${this.appEnv}/organization/tender-management/proposal-files/${userId}/${projectAttachmentfileName}`;

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
        validateFileSize(request.project_attachments.size, maxSize);

        console.log(
          'New proposal project attachment exist, uploading to the server...',
        );
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
          size: request.project_attachments.size,
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
          if (!!oldFile.url) {
            console.log(
              'Old proposal project attachment exist, deleting from the server...',
            );
            await this.bunnyService.deleteMedia(oldFile.url, true);
          }
        }
      } catch (error) {
        console.log(
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

        let letterOfSupportPath = `tmra/${this.appEnv}/organization/tender-management/proposal-files/${userId}/${letterOfSupportfileName}`;

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
        validateFileSize(request.project_attachments.size, maxSize);

        console.log(
          'New proposal letter of support exist, uploading to the server...',
        );

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
          size: request.letter_ofsupport_req.size,
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
          if (!!oldFile.url) {
            console.log('deleting old letter of support file');
            await this.bunnyService.deleteMedia(oldFile.url, true);
          }
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

  async deleteDraft(userId: string, proposal_id: string) {
    const proposal = await this.tenderProposalRepository.fetchProposalById(
      proposal_id,
    );

    if (!proposal) {
      throw new BadRequestException('Proposal not found');
    }

    if (proposal.submitter_user_id !== userId) {
      throw new BadRequestException(
        'User not authorized to delete this proposal',
      );
    }

    const deletedProposal = await this.tenderProposalRepository.deleteProposal(
      proposal.id,
    );

    if (
      deletedProposal.project_attachments &&
      deletedProposal.project_attachments.hasOwnProperty('url') &&
      deletedProposal.project_attachments.hasOwnProperty('type') &&
      deletedProposal.project_attachments.hasOwnProperty('size')
    ) {
      const oldFile = deletedProposal.project_attachments as {
        url: string;
        type: string;
        size: number;
      };
      if (!!oldFile.url) {
        this.logger.log(
          'log',
          'Deleted Proposal has project attachment, deleting the files ...',
        );
        await this.bunnyService.deleteMedia(oldFile.url, true);
      }
    }

    if (
      deletedProposal.letter_ofsupport_req &&
      deletedProposal.letter_ofsupport_req.hasOwnProperty('url') &&
      deletedProposal.letter_ofsupport_req.hasOwnProperty('type') &&
      deletedProposal.letter_ofsupport_req.hasOwnProperty('size')
    ) {
      const oldFile = deletedProposal.letter_ofsupport_req as {
        url: string;
        type: string;
        size: number;
      };
      if (!!oldFile.url) {
        this.logger.log(
          'log',
          'Deleted Proposal has letter of support, deleting the files ...',
        );
        await this.bunnyService.deleteMedia(oldFile.url, true);
      }
    }

    return deletedProposal;
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

    let createdItemBudgetPayload: Prisma.proposal_item_budgetCreateManyInput[] =
      [];
    let updatedItemBudgetPayload: Prisma.proposal_item_budgetUncheckedUpdateInput[] =
      [];
    let deletedItemBudgetIds: string[] = [];

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
        createdItemBudgetPayload,
        updatedItemBudgetPayload,
        deletedItemBudgetIds,
      );

      proposalUpdatePayload = {
        ...proposalUpdatePayload,
        ...supervisorResult.proposalUpdatePayload,
      };
      proposalLogCreateInput = {
        ...proposalLogCreateInput,
        ...supervisorResult.proposalLogCreateInput,
      };

      createdItemBudgetPayload = [
        ...createdItemBudgetPayload,
        ...supervisorResult.createdItemBudgetPayload,
      ];
      updatedItemBudgetPayload = [
        ...updatedItemBudgetPayload,
        ...supervisorResult.updatedItemBudgetPayload,
      ];
      deletedItemBudgetIds = [
        ...deletedItemBudgetIds,
        ...supervisorResult.deletedItemBudgetIds,
      ];
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
        createdItemBudgetPayload,
        updatedItemBudgetPayload,
        deletedItemBudgetIds,
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
    createdItemBudgetPayload: Prisma.proposal_item_budgetCreateManyInput[],
    updatedItemBudgetPayload: Prisma.proposal_item_budgetUncheckedUpdateInput[],
    deletedItemBudgetIds: string[],
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
      if (!request.supervisor_payload) {
        throw new BadRequestException('Supervisor accept payload is required!');
      }

      const {
        created_proposal_budget,
        deleted_proposal_budget,
        updated_proposal_budget,
      } = request.supervisor_payload;

      if (proposal.project_track !== 'CONCESSIONAL_GRANTS') {
        /* proposal */
        proposalUpdatePayload.inner_status =
          InnerStatusEnum.ACCEPTED_BY_SUPERVISOR;
        proposalUpdatePayload.outter_status = OutterStatusEnum.ONGOING;
        proposalUpdatePayload.state = TenderAppRoleEnum.PROJECT_SUPERVISOR;

        /* propsal supervisor payload */
        if (request.supervisor_payload.inclu_or_exclu) {
          proposalUpdatePayload.inclu_or_exclu =
            request.supervisor_payload.inclu_or_exclu;
        }

        if (request.supervisor_payload.vat_percentage) {
          proposalUpdatePayload.vat_percentage =
            request.supervisor_payload.vat_percentage;
        }

        if (request.supervisor_payload.support_goal_id) {
          proposalUpdatePayload.support_goal_id =
            request.supervisor_payload.support_goal_id;
        }

        if (request.supervisor_payload.vat) {
          proposalUpdatePayload.vat = request.supervisor_payload.vat;
        }

        if (request.supervisor_payload.support_outputs) {
          proposalUpdatePayload.support_outputs =
            request.supervisor_payload.support_outputs;
        }

        if (request.supervisor_payload.number_of_payments_by_supervisor) {
          proposalUpdatePayload.number_of_payments_by_supervisor =
            request.supervisor_payload.number_of_payments_by_supervisor;
        }

        if (request.supervisor_payload.fsupport_by_supervisor) {
          proposalUpdatePayload.fsupport_by_supervisor =
            request.supervisor_payload.fsupport_by_supervisor;
        }

        if (request.supervisor_payload.does_an_agreement) {
          proposalUpdatePayload.does_an_agreement =
            request.supervisor_payload.does_an_agreement;
        }

        if (request.supervisor_payload.need_picture) {
          proposalUpdatePayload.need_picture =
            request.supervisor_payload.need_picture;
        }

        if (request.supervisor_payload.closing_report) {
          proposalUpdatePayload.closing_report =
            request.supervisor_payload.closing_report;
        }

        if (request.supervisor_payload.support_type) {
          proposalUpdatePayload.support_type =
            request.supervisor_payload.support_type;
        }

        if (request.supervisor_payload.clause) {
          proposalUpdatePayload.clause = request.supervisor_payload.clause;
        }

        if (request.supervisor_payload.clasification_field) {
          proposalUpdatePayload.clasification_field =
            request.supervisor_payload.clasification_field;
        }

        /* if there's a new created item budget */
        if (created_proposal_budget && created_proposal_budget.length > 0) {
          for (const itemBudget of created_proposal_budget) {
            createdItemBudgetPayload.push({
              id: uuidv4(),
              amount: itemBudget.amount,
              clause: itemBudget.clause,
              explanation: itemBudget.explanation,
              proposal_id: request.proposal_id,
            });
          }
        }

        if (updated_proposal_budget && updated_proposal_budget.length > 0) {
          updatedItemBudgetPayload = [...updated_proposal_budget];
        }

        if (deleted_proposal_budget && deleted_proposal_budget.length > 0) {
          for (const itemBudget of deleted_proposal_budget) {
            deletedItemBudgetIds.push(itemBudget.id);
          }
        }

        /* log */
        proposalLogCreateInput.action = ProposalAction.ACCEPT;
        proposalLogCreateInput.state = TenderAppRoleEnum.PROJECT_SUPERVISOR;
        proposalLogCreateInput.user_role = TenderAppRoleEnum.PROJECT_SUPERVISOR;
      }

      if (proposal.project_track === 'CONCESSIONAL_GRANTS') {
        //
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
      createdItemBudgetPayload,
      updatedItemBudgetPayload,
      deletedItemBudgetIds,
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
      mailType: 'template',
      to: log.data.proposal.user.email,
      from: 'no-reply@hcharity.org',
      subject,
      templatePath: `tender/ar/proposal/${
        log.data.action === 'reject' ? 'project_declined' : 'project_approved'
      }`,
      templateContext: {
        projectName: log.data.proposal.project_name,
        clientUsername: log.data.proposal.user.employee_name,
      },
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

    const clientPhone = isExistAndValidPhone(log.data.proposal.user.mobile_number);
    if (clientPhone) {
      this.twilioService.sendSMS({
        to: clientPhone,
        body: subject + ',' + clientContent,
      });
    }

    const reviewerPhone = isExistAndValidPhone(log.data.proposal.user.mobile_number);
    if (reviewerPhone) {
      this.twilioService.sendSMS({
        to: reviewerPhone,
        body: subject + ',' + employeeContent,
      });
    }
  }

  // async updateProposalByCmsUsers(
  //   user: user,
  //   body: any,
  //   id: string,
  //   role: string,
  // ) {
  //   const { action } = body;
  //   if (action === ProposalAction.ACCEPT) {
  //     return this.acceptProposal(id, body, role, user);
  //   } else if (action === ProposalAction.REJECT) {
  //     return this.rejectProposal(id, body, role, user);
  //   } else if (action === ProposalAction.STEP_BACK) {
  //     return this.proposalStepBack(id, body, role, user);
  //   } else if (
  //     action === ProposalAction.ACCEPT_AND_ASK_FOR_CONSULTION &&
  //     role === TenderAppRoleEnum.PROJECT_MANAGER
  //   ) {
  //     const proposal = await this.updateProposalStatus(
  //       id,
  //       InnerStatusEnum.ACCEPTED_AND_NEED_CONSULTANT,
  //     );
  //     await this.createProposalLog(
  //       body,
  //       role,
  //       proposal,
  //       user.id,
  //       `ProposalWasAccepteddBy@${user.employee_name}`,
  //       ProposalAction.ACCEPT_AND_ASK_FOR_CONSULTION,
  //     );
  //     return proposal;
  //   } else if (
  //     (role === TenderAppRoleEnum.CEO ||
  //       role === TenderAppRoleEnum.PROJECT_MANAGER ||
  //       role === TenderAppRoleEnum.CASHIER ||
  //       role === TenderAppRoleEnum.FINANCE) &&
  //     action === ProposalAction.ASK_FOR_UPDATE
  //   ) {
  //     await this.updateRequestToTheSuperVisor(user, body, id, role);
  //   } else {
  //     throw new UnauthorizedException('There is no such action to do!');
  //   }
  // }

  // async updateRequestToTheSuperVisor(
  //   user: user,
  //   body: any,
  //   id: string,
  //   role: string,
  // ) {
  //   const oldProposal = await this.prismaService.proposal.findUnique({
  //     where: {
  //       id,
  //     },
  //   });
  //   const old_inner_status = oldProposal?.inner_status
  //     ? oldProposal.inner_status
  //     : undefined;
  //   const proposal = await this.updateProposalStatus(
  //     id,
  //     InnerStatusEnum.ACCEPTED_BY_MODERATOR,
  //     undefined,
  //     OutterStatusEnum.UPDATE_REQUEST,
  //     old_inner_status,
  //   );
  //   await this.createProposalLog(
  //     body,
  //     role,
  //     proposal,
  //     user.id,
  //     `ProposalHasAnUpdateRequestBy@${user.employee_name}`,
  //     ProposalAction.ASK_FOR_UPDATE,
  //   );
  //   return proposal;
  // }

  // async proposalStepBack(id: string, body: any, role: string, user: user) {
  //   let proposal;
  //   if (role === TenderAppRoleEnum.PROJECT_SUPERVISOR) {
  //     proposal = await this.updateProposalStatus(
  //       id,
  //       InnerStatusEnum.CREATED_BY_CLIENT,
  //       undefined,
  //       OutterStatusEnum.ONGOING,
  //     );
  //     await this.createProposalLog(
  //       body,
  //       role,
  //       proposal,
  //       user.id,
  //       `ProposalWasRolledBackBy@${user.employee_name}`,
  //       ProposalAction.STEP_BACK,
  //     );
  //   } else if (role === TenderAppRoleEnum.PROJECT_MANAGER) {
  //     proposal = await this.updateProposalStatus(
  //       id,
  //       InnerStatusEnum.ACCEPTED_BY_MODERATOR,
  //       undefined,
  //       OutterStatusEnum.ONGOING,
  //     );
  //     await this.createProposalLog(
  //       body,
  //       role,
  //       proposal,
  //       user.id,
  //       `ProposalWasRolledBackBy@${user.employee_name}`,
  //       ProposalAction.STEP_BACK,
  //     );
  //   } else if (role === TenderAppRoleEnum.CEO) {
  //     proposal = await this.updateProposalStatus(
  //       id,
  //       InnerStatusEnum.ACCEPTED_BY_PROJECT_MANAGER,
  //       undefined,
  //       OutterStatusEnum.ONGOING,
  //     );
  //     await this.createProposalLog(
  //       body,
  //       role,
  //       proposal,
  //       user.id,
  //       `ProposalWasRolledBackBy@${user.employee_name}`,
  //       ProposalAction.STEP_BACK,
  //     );
  //   } else {
  //     throw new UnauthorizedException(
  //       "User doesn't have the required role to access this resource!",
  //     );
  //   }
  //   return proposal;
  // }

  // async rejectProposal(id: string, body: any, role: string, user: user) {
  //   let proposal;
  //   if (role === TenderAppRoleEnum.MODERATOR) {
  //     proposal = await this.updateProposalStatus(
  //       id,
  //       InnerStatusEnum.REJECTED_BY_MODERATOR,
  //       undefined,
  //       OutterStatusEnum.CANCELED,
  //     );
  //     await this.createProposalLog(
  //       body,
  //       role,
  //       proposal,
  //       user.id,
  //       `ProposalWasRejectedBy@${user.employee_name}`,
  //       ProposalAction.REJECT,
  //     );
  //   } else if (role === TenderAppRoleEnum.PROJECT_SUPERVISOR) {
  //     proposal = await this.updateProposalStatus(
  //       id,
  //       InnerStatusEnum.REJECTED_BY_SUPERVISOR,
  //       undefined,
  //       OutterStatusEnum.CANCELED,
  //     );
  //     await this.createProposalLog(
  //       body,
  //       role,
  //       proposal,
  //       user.id,
  //       `ProposalWasRejectedBy@${user.employee_name}`,
  //       ProposalAction.REJECT,
  //     );
  //   } else if (role === TenderAppRoleEnum.PROJECT_MANAGER) {
  //     proposal = await this.updateProposalStatus(
  //       id,
  //       InnerStatusEnum.REJECTED_BY_PROJECT_MANAGER,
  //       undefined,
  //       OutterStatusEnum.CANCELED,
  //     );
  //     await this.createProposalLog(
  //       body,
  //       role,
  //       proposal,
  //       user.id,
  //       `ProposalWasRejectedBy@${user.employee_name}`,
  //       ProposalAction.REJECT,
  //     );
  //   } else if (role === TenderAppRoleEnum.CONSULTANT) {
  //     proposal = await this.updateProposalStatus(
  //       id,
  //       InnerStatusEnum.REJECTED_BY_CONSULTANT,
  //     );
  //     await this.createProposalLog(
  //       body,
  //       role,
  //       proposal,
  //       user.id,
  //       `ProposalWasRejectedBy@${user.employee_name}`,
  //       ProposalAction.REJECT,
  //     );
  //   } else if (role === TenderAppRoleEnum.CEO) {
  //     proposal = await this.updateProposalStatus(
  //       id,
  //       InnerStatusEnum.REJECTED_BY_CEO,
  //       undefined,
  //       OutterStatusEnum.CANCELED,
  //     );
  //     await this.createProposalLog(
  //       body,
  //       role,
  //       proposal,
  //       user.id,
  //       `ProposalWasRejectedBy@${user.employee_name}`,
  //       ProposalAction.REJECT,
  //     );
  //   } else {
  //     throw new UnauthorizedException(
  //       "User doesn't have the required role to access this resource!",
  //     );
  //   }
  //   return proposal;
  // }

  // async acceptProposal(id: string, body: any, role: string, user: user) {
  //   let proposal;
  //   if (role === TenderAppRoleEnum.MODERATOR) {
  //     proposal = await this.updateProposalStatus(
  //       id,
  //       InnerStatusEnum.ACCEPTED_BY_MODERATOR,
  //       body.track_id,
  //     );
  //     await this.createProposalLog(
  //       body,
  //       role,
  //       proposal,
  //       user.id,
  //       `ProposalWasAcceptedBy@${user.employee_name}`,
  //       ProposalAction.ACCEPT,
  //     );
  //   } else if (role === TenderAppRoleEnum.PROJECT_SUPERVISOR) {
  //     proposal = await this.updateProposalStatus(
  //       id,
  //       InnerStatusEnum.ACCEPTED_BY_SUPERVISOR,
  //       body.track_id,
  //     );
  //     await this.createProposalLog(
  //       body,
  //       role,
  //       proposal,
  //       user.id,
  //       `ProposalWasAcceptedBy@${user.employee_name}`,
  //       ProposalAction.ACCEPT,
  //     );
  //     const track = await this.prismaService.track.findUnique({
  //       where: { id: proposal.track_id as string },
  //     });
  //     if (!track)
  //       throw new NotFoundException('this proposal does not belonge to track');
  //     if (track.name === 'مسار المنح العام') {
  //       const recommended_support_consultant =
  //         body.consultant_form.recommended_support_consultant;
  //       delete body.consultant_form.recommended_support_consultant;
  //       const consultantForm = await this.prismaService.consultant_form.create({
  //         data: {
  //           ...body.consultant_form,
  //           proposal_id: proposal.id,
  //           supervisor_id: user.id,
  //         },
  //       });
  //       for (let i = 0; i < recommended_support_consultant.length; i++) {
  //         recommended_support_consultant[i].consultant_form_id =
  //           consultantForm.id;
  //       }
  //       await this.prismaService.recommended_support_consultant.createMany({
  //         data: recommended_support_consultant,
  //       });
  //     } else {
  //       await this.prismaService.supervisor_form.create({
  //         data: {
  //           ...body.supervisor_form,
  //           proposal_id: proposal.id,
  //           supervisor_id: user.id,
  //         },
  //       });
  //     }
  //   } else if (role === TenderAppRoleEnum.PROJECT_MANAGER) {
  //     proposal = await this.updateProposalStatus(
  //       id,
  //       InnerStatusEnum.ACCEPTED_BY_PROJECT_MANAGER,
  //     );
  //     await this.createProposalLog(
  //       body,
  //       role,
  //       proposal,
  //       user.id,
  //       `ProposalWasAcceptedBy@${user.employee_name}`,
  //       ProposalAction.ACCEPT,
  //     );
  //   } else if (role === TenderAppRoleEnum.CONSULTANT) {
  //     proposal = await this.updateProposalStatus(
  //       id,
  //       InnerStatusEnum.ACCEPTED_BY_CONSULTANT,
  //     );
  //     await this.createProposalLog(
  //       body,
  //       role,
  //       proposal,
  //       user.id,
  //       `ProposalWasAcceptedBy@${user.employee_name}`,
  //       ProposalAction.ACCEPT,
  //     );
  //     const projectManager = (await this.prismaService.user.findUnique({
  //       where: {
  //         id: proposal.project_manager_id as string,
  //       },
  //     })) as user;
  //     if (!projectManager)
  //       throw new NotFoundException(
  //         'there is no project manager in this proposal',
  //       );
  //     await this.createProposalLog(
  //       body,
  //       role,
  //       proposal,
  //       projectManager.id,
  //       `ProposalWasAcceptedBy@${projectManager.employee_name}`,
  //       ProposalAction.ACCEPT,
  //     );
  //   } else if (role === TenderAppRoleEnum.CEO) {
  //     proposal = await this.updateProposalStatus(
  //       id,
  //       InnerStatusEnum.ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION,
  //     );
  //     await this.createProposalLog(
  //       body,
  //       role,
  //       proposal,
  //       user.id,
  //       `ProposalWasAcceptedBy@${user.employee_name}`,
  //       ProposalAction.ACCEPT,
  //     );
  //   } else {
  //     throw new UnauthorizedException(
  //       "User doesn't have the required role to access this resource!",
  //     );
  //   }
  //   return proposal;
  // }

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
