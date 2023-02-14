import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
import { SupervisorRegularTrackAccMapper } from '../mappers/supervisor-regular-track-acc.mapper';
import { SupervisorAccCreatedItemBudgetMapper } from '../mappers/supervisor-acc-created-item-budget-mapper';
import { SupervisorGrantTrackAccMapper } from '../mappers/supervisor-grant-track-acc.mapper';
import { SupervisorAccCreatedRecommendedSupportMapper } from '../mappers/supervisor-acc-created-recommend-support-mapper';
import { TenderFilePayload } from '../../../tender-commons/dto/tender-file-payload.dto';
import { generateFileName } from '../../../tender-commons/utils/generate-filename';
import { isTenderFilePayload } from '../../../tender-commons/utils/is-tender-file-payload';
import { isUploadFileJsonb } from '../../../tender-commons/utils/is-upload-file-jsonb';
import { logUtil } from '../../../commons/utils/log-util';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';

@Injectable()
export class TenderProposalService {
  private readonly appEnv: string;
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderProposalService.name,
  });

  constructor(
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

  async uploadProposalFile(
    userId: string,
    proposalId: string,
    uploadMessage: string,
    file: TenderFilePayload,
    folderName: string,
    AllowedFileTypes: FileMimeTypeEnum[],
    maxSize: number = 1024 * 1024 * 4,
    uploadedFilePath: string[],
  ) {
    try {
      let fileName = generateFileName(
        file.fullName,
        file.fileExtension as FileMimeTypeEnum,
      );

      let filePath = `tmra/${this.appEnv}/organization/tender-management/proposal/${proposalId}/${userId}/${folderName}/${fileName}`;

      let fileBuffer = Buffer.from(
        file.base64Data.replace(/^data:.*;base64,/, ''),
        'base64',
      );

      validateAllowedExtension(file.fileExtension, AllowedFileTypes);
      validateFileSize(file.size, maxSize);

      const imageUrl = await this.bunnyService.uploadFileBase64(
        file.fullName,
        fileBuffer,
        filePath,
        `${uploadMessage} ${userId}`,
      );

      uploadedFilePath.push(imageUrl);
      let fileObj = {
        url: imageUrl,
        type: file.fileExtension,
        size: file.size,
      };

      return {
        uploadedFilePath,
        fileObj,
      };
    } catch (error) {
      if (uploadedFilePath.length > 0) {
        this.logger.log(
          'info',
          `${uploadMessage} error, deleting all previous uploaded files: ${error}`,
        );
        uploadedFilePath.forEach(async (path) => {
          await this.bunnyService.deleteMedia(path, true);
        });
      }
      const theError = prismaErrorThrower(
        error,
        TenderProposalService.name,
        `${uploadMessage}, error:`,
        `${uploadMessage}`,
      );
      throw theError;
    }
  }

  async create(userId: string, request: ProposalCreateDto) {
    const proposalCreatePayload: Prisma.proposalUncheckedCreateInput =
      CreateProposalMapper(userId, request);

    // this.logger.log('info', `request payload, ${logUtil(request)}`);

    const proposal_id = nanoid();
    proposalCreatePayload.id = proposal_id;

    let uploadedFilePath: string[] = [];

    let proposal_item_budgets:
      | Prisma.proposal_item_budgetCreateManyInput[]
      | undefined = undefined;

    const fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[] =
      [];

    /* validate and create path */
    const maxSize: number = 1024 * 1024 * 6; // 6 MB
    const allowedType: FileMimeTypeEnum[] = [
      FileMimeTypeEnum.JPG,
      FileMimeTypeEnum.JPEG,
      FileMimeTypeEnum.PNG,
      FileMimeTypeEnum.GIF,
      FileMimeTypeEnum.PDF,
      // FileMimeTypeEnum.DOC,
      // FileMimeTypeEnum.DOCX,
      // FileMimeTypeEnum.XLS,
      // FileMimeTypeEnum.XLSX,
      // FileMimeTypeEnum.PPT,
      // FileMimeTypeEnum.PPTX,
    ];

    if (request.proposal_bank_information_id) {
      const isMyOwnBank =
        await this.tenderProposalRepository.validateOwnBankAccount(
          userId,
          request.proposal_bank_information_id,
        );
      if (!isMyOwnBank) {
        throw new BadRequestException('Bank account is not yours!');
      }
      proposalCreatePayload.proposal_bank_id =
        request.proposal_bank_information_id;
    }

    // upload the project_attachments to bunny cloud service
    if (request.project_attachments) {
      const uploadResult = await this.uploadProposalFile(
        userId,
        proposalCreatePayload.id,
        'uploading project attachments',
        request.project_attachments,
        'project-attachments',
        allowedType,
        maxSize,
        uploadedFilePath,
      );
      uploadedFilePath = uploadResult.uploadedFilePath;
      proposalCreatePayload.project_attachments = uploadResult.fileObj;

      const payload: Prisma.file_managerUncheckedCreateInput = {
        id: uuidv4(),
        user_id: userId,
        name: uploadResult.fileObj.url.split('/').pop() as string,
        url: uploadResult.fileObj.url,
        mimetype: uploadResult.fileObj.type,
        size: uploadResult.fileObj.size,
        column_name: 'project-attachments',
        table_name: 'proposal',
        proposal_id: proposalCreatePayload.id,
      };
      fileManagerCreateManyPayload.push(payload);
    }

    if (request.letter_ofsupport_req) {
      const uploadResult = await this.uploadProposalFile(
        userId,
        proposalCreatePayload.id,
        'uploading letter of support',
        request.letter_ofsupport_req,
        'letter-of-support-req',
        allowedType,
        maxSize,
        uploadedFilePath,
      );
      uploadedFilePath = uploadResult.uploadedFilePath;
      proposalCreatePayload.letter_ofsupport_req = uploadResult.fileObj;

      const payload: Prisma.file_managerUncheckedCreateInput = {
        id: uuidv4(),
        user_id: userId,
        name: uploadResult.fileObj.url.split('/').pop() as string,
        url: uploadResult.fileObj.url,
        mimetype: uploadResult.fileObj.type,
        size: uploadResult.fileObj.size,
        column_name: 'letter-of-support-req',
        table_name: 'proposal',
        proposal_id: proposalCreatePayload.id,
      };
      fileManagerCreateManyPayload.push(payload);
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
      proposal_item_budgets,
      fileManagerCreateManyPayload,
      uploadedFilePath,
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

    const fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[] =
      [];

    let uploadedFilePath: string[] = [];
    const deletedFileManagerUrls: string[] = []; // id of file manager that we want to mark as soft delete.

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
      updateProposalPayload.proposal_bank_id =
        request.proposal_bank_information_id;
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

    if (isTenderFilePayload(request.project_attachments)) {
      const uploadResult = await this.uploadProposalFile(
        userId,
        request.proposal_id,
        'uploading project attachments',
        request.project_attachments,
        'project-attachments',
        allowedType,
        maxSize,
        uploadedFilePath,
      );
      uploadedFilePath = uploadResult.uploadedFilePath;
      updateProposalPayload.project_attachments = uploadResult.fileObj;

      const payload: Prisma.file_managerUncheckedCreateInput = {
        id: uuidv4(),
        user_id: userId,
        name: uploadResult.fileObj.url.split('/').pop() as string,
        url: uploadResult.fileObj.url,
        mimetype: uploadResult.fileObj.type,
        size: uploadResult.fileObj.size,
        column_name: 'project-attachments',
        table_name: 'proposal',
        proposal_id: request.proposal_id,
      };
      fileManagerCreateManyPayload.push(payload);

      if (isUploadFileJsonb(proposal.project_attachments)) {
        const oldFile = proposal.project_attachments as {
          url: string;
          type: string;
          size: number;
        };
        if (!!oldFile.url) {
          this.logger.log(
            'info',
            'Old proposal project attachment exist, it will marked as deleted files',
          );
          deletedFileManagerUrls.push(oldFile.url);
        }
      }
    }

    if (isTenderFilePayload(request.letter_ofsupport_req)) {
      const uploadResult = await this.uploadProposalFile(
        userId,
        request.proposal_id,
        'uploading letter of support',
        request.letter_ofsupport_req,
        'letter-of-support-req',
        allowedType,
        maxSize,
        uploadedFilePath,
      );
      uploadedFilePath = uploadResult.uploadedFilePath;
      updateProposalPayload.letter_ofsupport_req = uploadResult.fileObj;

      const payload: Prisma.file_managerUncheckedCreateInput = {
        id: uuidv4(),
        user_id: userId,
        name: uploadResult.fileObj.url.split('/').pop() as string,
        url: uploadResult.fileObj.url,
        mimetype: uploadResult.fileObj.type,
        size: uploadResult.fileObj.size,
        column_name: 'letter-of-support-req',
        table_name: 'proposal',
        proposal_id: request.proposal_id,
      };
      fileManagerCreateManyPayload.push(payload);

      if (isUploadFileJsonb(proposal.letter_ofsupport_req)) {
        const oldFile = proposal.letter_ofsupport_req as {
          url: string;
          type: string;
          size: number;
        };
        if (!!oldFile.url) {
          this.logger.log(
            'info',
            'Old proposal letter of support req exist, it will marked as deleted files',
          );
          deletedFileManagerUrls.push(oldFile.url);
        }
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
      fileManagerCreateManyPayload,
      deletedFileManagerUrls,
      uploadedFilePath,
    );

    return updatedProposal;
  }

  async deleteDraft(userId: string, proposal_id: string) {
    const deletedFileManagerUrls: string[] = []; // id of file manager that we want to mark as soft delete.

    const proposal = await this.tenderProposalRepository.fetchProposalById(
      proposal_id,
    );
    if (!proposal) throw new BadRequestException('Proposal not found');

    if (proposal.submitter_user_id !== userId) {
      throw new BadRequestException(
        'User not authorized to delete this proposal',
      );
    }

    if (proposal.step === 'ZERO') {
      throw new BadRequestException(
        "You can't delete this proposal, it wasn't a draft!",
      );
    }

    if (isUploadFileJsonb(proposal.project_attachments)) {
      const oldFile = proposal.project_attachments as {
        url: string;
        type: string;
        size: number;
      };
      if (!!oldFile.url) {
        this.logger.log(
          'info',
          'Deleted Proposal has project attachment, pushing url to deleted flags',
        );
        // await this.bunnyService.deleteMedia(oldFile.url, true);
        deletedFileManagerUrls.push(oldFile.url);
      }
    }

    if (isUploadFileJsonb(proposal.letter_ofsupport_req)) {
      const oldFile = proposal.letter_ofsupport_req as {
        url: string;
        type: string;
        size: number;
      };
      if (!!oldFile.url) {
        this.logger.log(
          'info',
          'Deleted Proposal has letter of support, pushing url to deleted flags',
        );
        // await this.bunnyService.deleteMedia(oldFile.url, true);
        deletedFileManagerUrls.push(oldFile.url);
      }
    }

    const deletedProposal = await this.tenderProposalRepository.deleteProposal(
      proposal.id,
      deletedFileManagerUrls,
    );

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

    let createdRecommendedSupportPayload: Prisma.recommended_support_consultantCreateManyInput[] =
      [];
    let updatedRecommendedSupportPayload: Prisma.recommended_support_consultantUncheckedUpdateInput[] =
      [];
    let deletedRecommendedSupportIds: string[] = [];

    /* if user is moderator */
    if (currentUser.choosenRole === 'tender_moderator') {
      const mod = await this.moderatorChangeState(
        proposalUpdatePayload,
        proposalLogCreateInput,
        request,
      );
      proposalUpdatePayload = {
        ...mod.proposalUpdatePayload,
      };
      proposalLogCreateInput = {
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
        createdRecommendedSupportPayload,
        updatedRecommendedSupportPayload,
        deletedRecommendedSupportIds,
      );

      proposalUpdatePayload = { ...supervisorResult.proposalUpdatePayload };
      proposalLogCreateInput = { ...supervisorResult.proposalLogCreateInput };

      createdItemBudgetPayload = [...supervisorResult.createdItemBudgetPayload];
      updatedItemBudgetPayload = [...supervisorResult.updatedItemBudgetPayload];
      deletedItemBudgetIds = [...supervisorResult.deletedItemBudgetIds];

      createdRecommendedSupportPayload = [
        ...supervisorResult.createdRecommendedSupportPayload,
      ];
      updatedRecommendedSupportPayload = [
        ...supervisorResult.updatedRecommendedSupportPayload,
      ];
      deletedRecommendedSupportIds = [
        ...supervisorResult.deletedRecommendedSupportIds,
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
        ...pm.proposalUpdatePayload,
      };
      proposalLogCreateInput = {
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
        ...consultant.proposalUpdatePayload,
      };
      proposalLogCreateInput = {
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
        ...ceo.proposalUpdatePayload,
      };
      proposalLogCreateInput = {
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
        createdRecommendedSupportPayload,
        updatedRecommendedSupportPayload,
        deletedRecommendedSupportIds,
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
    createdRecommendedSupportPayload: Prisma.recommended_support_consultantCreateManyInput[],
    updatedRecommendedSupportPayload: Prisma.recommended_support_consultantUncheckedUpdateInput[],
    deletedRecommendedSupportIds: string[],
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
        created_recommended_support,
        updated_recommended_support,
        deleted_recommended_support,
      } = request.supervisor_payload;

      proposalUpdatePayload = SupervisorRegularTrackAccMapper(
        proposalUpdatePayload,
        request.supervisor_payload,
      );

      /* if there's a new created item budget */
      createdItemBudgetPayload = SupervisorAccCreatedItemBudgetMapper(
        request.proposal_id,
        created_proposal_budget,
        createdItemBudgetPayload,
      );

      if (updated_proposal_budget && updated_proposal_budget.length > 0) {
        for (let i = 0; i < updated_proposal_budget.length; i++) {
          updatedItemBudgetPayload.push({
            id: updated_proposal_budget[i].id,
            amount: updated_proposal_budget[i].amount,
            clause: updated_proposal_budget[i].clause,
            explanation: updated_proposal_budget[i].explanation,
          });
        }
      }

      if (deleted_proposal_budget && deleted_proposal_budget.length > 0) {
        for (const itemBudget of deleted_proposal_budget) {
          deletedItemBudgetIds.push(itemBudget.id);
        }
      }

      proposalUpdatePayload.inner_status =
        InnerStatusEnum.ACCEPTED_BY_SUPERVISOR;
      proposalUpdatePayload.outter_status = OutterStatusEnum.ONGOING;
      proposalUpdatePayload.state = TenderAppRoleEnum.PROJECT_SUPERVISOR;

      /* custom logic if there's special logic for regular track */
      if (proposal.project_track !== 'CONCESSIONAL_GRANTS') {
      }

      /* custom logic if the track is CONCESSIONAL_GRANTS */
      if (proposal.project_track === 'CONCESSIONAL_GRANTS') {
        proposalUpdatePayload = SupervisorGrantTrackAccMapper(
          proposalUpdatePayload,
          request.supervisor_payload,
        );

        createdRecommendedSupportPayload =
          SupervisorAccCreatedRecommendedSupportMapper(
            request.proposal_id,
            created_recommended_support,
            createdRecommendedSupportPayload,
          );

        if (
          updated_recommended_support &&
          updated_recommended_support.length > 0
        ) {
          updatedRecommendedSupportPayload = updated_recommended_support;
        }

        if (
          deleted_recommended_support &&
          deleted_recommended_support.length > 0
        ) {
          for (const recommendSuppport of deleted_recommended_support) {
            deletedRecommendedSupportIds.push(recommendSuppport.id);
          }
        }
      }

      /* accept supervisor logs */
      proposalLogCreateInput.action = ProposalAction.ACCEPT;
      proposalLogCreateInput.state = TenderAppRoleEnum.PROJECT_SUPERVISOR;
      proposalLogCreateInput.user_role = TenderAppRoleEnum.PROJECT_SUPERVISOR;
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
      createdRecommendedSupportPayload,
      updatedRecommendedSupportPayload,
      deletedRecommendedSupportIds,
    };
  }

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

    const clientPhone = isExistAndValidPhone(
      log.data.proposal.user.mobile_number,
    );
    if (clientPhone) {
      this.twilioService.sendSMS({
        to: clientPhone,
        body: subject + ',' + clientContent,
      });
    }

    const reviewerPhone = isExistAndValidPhone(
      log.data.proposal.user.mobile_number,
    );
    if (reviewerPhone) {
      this.twilioService.sendSMS({
        to: reviewerPhone,
        body: subject + ',' + employeeContent,
      });
    }
  }

  async fetchTrack(limit: number, page: number) {
    return await this.tenderProposalRepository.fetchTrack(limit, page);
  }
}
