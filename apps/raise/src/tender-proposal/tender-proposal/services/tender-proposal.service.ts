import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma, proposal } from '@prisma/client';
import { nanoid } from 'nanoid';
import {
  TenderAppRole,
  TenderAppRoleEnum,
  TenderFusionAuthRoles,
  appRoleMappers,
} from '../../../tender-commons/types';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';

import { ChangeProposalStateDto } from '../dtos/requests/change-proposal-state.dto';

import { TenderProposalRepository } from '../repositories/tender-proposal.repository';

import { SendEmailDto } from '../../../libs/email/dtos/requests/send-email.dto';
import { EmailService } from '../../../libs/email/email.service';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { CreateNotificationDto } from '../../../tender-notification/dtos/requests/create-notification.dto';
import { TenderNotificationService } from '../../../tender-notification/services/tender-notification.service';

import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { FileMimeTypeEnum } from '../../../commons/enums/file-mimetype.enum';
import { envLoadErrorHelper } from '../../../commons/helpers/env-loaderror-helper';
import { isExistAndValidPhone } from '../../../commons/utils/is-exist-and-valid-phone';
import { logUtil } from '../../../commons/utils/log-util';
import { validateAllowedExtension } from '../../../commons/utils/validate-allowed-extension';
import { validateFileSize } from '../../../commons/utils/validate-file-size';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import { MsegatService } from '../../../libs/msegat/services/msegat.service';
import { TenderFilePayload } from '../../../tender-commons/dto/tender-file-payload.dto';
import {
  InnerStatusEnum,
  OutterStatusEnum,
  ProposalAction,
} from '../../../tender-commons/types/proposal';
import { generateFileName } from '../../../tender-commons/utils/generate-filename';
import { isTenderFilePayload } from '../../../tender-commons/utils/is-tender-file-payload';
import { isUploadFileJsonb } from '../../../tender-commons/utils/is-upload-file-jsonb';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { IProposalLogsResponse } from '../../tender-proposal-log/interfaces/proposal-logs-response';
import { TenderProposalLogRepository } from '../../tender-proposal-log/repositories/tender-proposal-log.repository';
import {
  CreateProposalInterceptorDto,
  PaymentAdjustmentFilterRequest,
  PreviousProposalFilterRequest,
  RequestInProcessFilterRequest,
} from '../dtos/requests';
import { AskAmandementRequestDto } from '../dtos/requests/ask-amandement-request.dto';
import { CeoChangeStatePayload } from '../dtos/requests/ceo-change-state.dto';
import { FetchAmandementFilterRequest } from '../dtos/requests/fetch-amandement-filter-request.dto';
import { FetchProposalFilterRequest } from '../dtos/requests/fetch-proposal-filter-request.dto';
import { ProjectManagerChangeStatePayload } from '../dtos/requests/project-manager-change-state-payload.dto';
import { ProposalCreateDto } from '../dtos/requests/proposal-create.dto';
import { ProposalSaveDraftDto } from '../dtos/requests/proposal-save-draft';
import { SendAmandementDto } from '../dtos/requests/send-amandement.dto';
import { SendRevisionDto } from '../dtos/requests/send-revision.dto';
import { FetchProposalByIdResponse } from '../dtos/responses/fetch-proposal-by-id.response.dto';
import { CreateProposalInterceptorMapper } from '../mappers';
import { CreateItemBudgetsMapper } from '../mappers/create-item-budgets.mappers';
import { CreateProposalAskedEditRequestMapper } from '../mappers/create-proposal-asked-edit-request.mapper';
import { CreateProposalMapper } from '../mappers/create-proposal.mapper';
import { ProposalUpdateRequestMapper } from '../mappers/proposal-update-request.mapper';
import { SendRevisionMapper } from '../mappers/send-revision.mapper';
import { SupervisorAccCreatedItemBudgetMapper } from '../mappers/supervisor-acc-created-item-budget-mapper';
import { SupervisorAccCreatedRecommendedSupportMapper } from '../mappers/supervisor-acc-created-recommend-support-mapper';
import { SupervisorGrantTrackAccMapper } from '../mappers/supervisor-grant-track-acc.mapper';
import { SupervisorRegularTrackAccMapper } from '../mappers/supervisor-regular-track-acc.mapper';
import { UpdateProposalTrackInfoMapper } from '../mappers/update-proposal-track-info.mapper';
import { UpdateProposalMapper } from '../mappers/update-proposal.mapper';

@Injectable()
export class TenderProposalService {
  private readonly appEnv: string;
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderProposalService.name,
  });

  constructor(
    private readonly emailService: EmailService,
    private readonly msegatService: MsegatService,
    private readonly configService: ConfigService,
    private readonly bunnyService: BunnyService,
    private readonly notificationService: TenderNotificationService,
    private readonly proposalRepo: TenderProposalRepository,
    private readonly notifService: TenderNotificationService,
    private readonly tenderProposalLogRepository: TenderProposalLogRepository,
  ) {
    const environment = this.configService.get('APP_ENV');
    if (!environment) envLoadErrorHelper('APP_ENV');
    this.appEnv = environment;
  }

  // async seq() {
  //   return await this.proposalRepo.findMany();
  // }

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
      const fileName = generateFileName(
        file.fullName,
        file.fileExtension as FileMimeTypeEnum,
      );

      const filePath = `tmra/${this.appEnv}/organization/tender-management/proposal/${proposalId}/${userId}/${folderName}/${fileName}`;

      const fileBuffer = Buffer.from(
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
      const fileObj = {
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

  async uploadProposalFileIntercept(
    userId: string,
    proposalId: string,
    uploadMessage: string,
    file: Express.Multer.File,
    folderName: string,
    AllowedFileTypes: FileMimeTypeEnum[],
    maxSize: number = 1024 * 1024 * 4,
    uploadedFilePath: string[],
  ) {
    try {
      const fileName = generateFileName(
        file.originalname,
        file.mimetype as FileMimeTypeEnum,
      );

      const filePath = `tmra/${this.appEnv}/organization/tender-management/proposal/${proposalId}/${userId}/${folderName}/${fileName}`;

      validateAllowedExtension(file.mimetype, AllowedFileTypes);
      validateFileSize(file.size, maxSize);

      const imageUrl = await this.bunnyService.uploadFileMulter(
        file,
        filePath,
        `${uploadMessage} ${userId}`,
      );

      uploadedFilePath.push(imageUrl);
      const fileObj = {
        url: imageUrl,
        type: file.mimetype,
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

  async fetchProposalById(id: string) {
    const proposal = await this.proposalRepo.fetchProposalById(id);
    if (!proposal) throw new NotFoundException('Proposal not found!');
    return proposal;
  }

  async fetchRequestInProcess(
    currentUser: TenderCurrentUser,
    filter: RequestInProcessFilterRequest,
  ) {
    return await this.proposalRepo.fetchRequestInProcess(currentUser, filter);
  }

  async getPreviousProposal(
    currentUser: TenderCurrentUser,
    filter: PreviousProposalFilterRequest,
  ) {
    return await this.proposalRepo.getPreviousProposal(currentUser, filter);
  }

  async fetchPaymentAdjustment(
    currentUser: TenderCurrentUser,
    filter: PaymentAdjustmentFilterRequest,
  ) {
    return await this.proposalRepo.fetchPaymentAdjustment(currentUser, filter);
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
    ];

    if (request.proposal_bank_information_id) {
      const isMyOwnBank = await this.proposalRepo.validateOwnBankAccount(
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
    const createdProposal = await this.proposalRepo.create(
      proposalCreatePayload,
      proposal_item_budgets,
      fileManagerCreateManyPayload,
      uploadedFilePath,
    );

    return createdProposal;
  }

  async interceptorCreate(
    userId: string,
    request: CreateProposalInterceptorDto,
    letter_ofsupport_req: Express.Multer.File[],
    project_attachments: Express.Multer.File[],
  ) {
    const proposalCreatePayload: Prisma.proposalUncheckedCreateInput =
      CreateProposalInterceptorMapper(userId, request);

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
    const maxSize: number = 1024 * 1024 * 201;
    const allowedType: FileMimeTypeEnum[] = [
      FileMimeTypeEnum.JPG,
      FileMimeTypeEnum.JPEG,
      FileMimeTypeEnum.PNG,
      FileMimeTypeEnum.GIF,
      FileMimeTypeEnum.PDF,
    ];
    if (request.proposal_bank_information_id) {
      const isMyOwnBank = await this.proposalRepo.validateOwnBankAccount(
        userId,
        request.proposal_bank_information_id,
      );
      if (!isMyOwnBank) {
        throw new BadRequestException('Bank account is not yours!');
      }
      proposalCreatePayload.proposal_bank_id =
        request.proposal_bank_information_id;
    }
    // // upload the project_attachments to bunny cloud service
    if (project_attachments[0]) {
      const uploadResult = await this.uploadProposalFileIntercept(
        userId,
        proposalCreatePayload.id,
        'uploading project attachments',
        project_attachments[0],
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

    if (letter_ofsupport_req[0]) {
      const uploadResult = await this.uploadProposalFileIntercept(
        userId,
        proposalCreatePayload.id,
        'uploading letter of support',
        letter_ofsupport_req[0],
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
    const createdProposal = await this.proposalRepo.create(
      proposalCreatePayload,
      proposal_item_budgets,
      fileManagerCreateManyPayload,
      uploadedFilePath,
    );
    return createdProposal;
  }

  async clientUpdateProposal(
    userId: string,
    saveDraftPayload?: ProposalSaveDraftDto,
    sendRevisionPayload?: SendRevisionDto,
  ) {
    const proposalId =
      saveDraftPayload?.proposal_id || sendRevisionPayload?.proposal_id || '';

    // find proposal by id
    const proposal = await this.proposalRepo.fetchProposalById(proposalId);
    if (!proposal) throw new BadRequestException(`Proposal not found`);

    if (proposal.submitter_user_id !== userId) {
      throw new BadRequestException(
        `You are not allowed to edit this proposal`,
      );
    }

    const project_attachments: any =
      saveDraftPayload?.project_attachments ||
      sendRevisionPayload?.project_attachments;

    const letter_ofsupport_req: any =
      saveDraftPayload?.letter_ofsupport_req ||
      sendRevisionPayload?.letter_ofsupport_req;

    let updateProposalPayload: Prisma.proposalUncheckedUpdateInput = {};

    let uploadedFilePath: string[] = [];
    const fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[] =
      [];
    const deletedFileManagerUrls: string[] = []; // id of file manager that we want to mark as soft delete.

    let proposal_item_budgets:
      | Prisma.proposal_item_budgetCreateManyInput[]
      | undefined = undefined;

    if (!!saveDraftPayload) {
      updateProposalPayload = UpdateProposalMapper(saveDraftPayload);
      if (saveDraftPayload.proposal_bank_information_id) {
        const isMyOwnBank = await this.proposalRepo.validateOwnBankAccount(
          userId,
          saveDraftPayload.proposal_bank_information_id,
        );
        if (!isMyOwnBank) {
          throw new BadRequestException('Bank account is not yours');
        }
        updateProposalPayload.proposal_bank_id =
          saveDraftPayload.proposal_bank_information_id;
      }

      if (saveDraftPayload.detail_project_budgets) {
        proposal_item_budgets = CreateItemBudgetsMapper(
          proposal.id,
          saveDraftPayload.detail_project_budgets,
        );
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

    if (!!project_attachments && isTenderFilePayload(project_attachments)) {
      const uploadResult = await this.uploadProposalFile(
        userId,
        proposalId,
        'uploading project attachments',
        project_attachments,
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
        proposal_id: proposalId,
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

    if (!!letter_ofsupport_req && isTenderFilePayload(letter_ofsupport_req)) {
      const uploadResult = await this.uploadProposalFile(
        userId,
        proposalId,
        'uploading letter of support',
        letter_ofsupport_req,
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
        proposal_id: proposalId,
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

    if (!!sendRevisionPayload) {
      try {
        if (Object.keys(updateProposalPayload).length > 0) {
          const restOfPayload = SendRevisionMapper(sendRevisionPayload);
          updateProposalPayload = {
            ...updateProposalPayload,
            ...restOfPayload,
          };
        } else {
          updateProposalPayload = SendRevisionMapper(sendRevisionPayload);
        }
        if (Object.keys(updateProposalPayload).length === 0) {
          throw new BadRequestException(
            'You must change at least one value that defined by supervisor',
          );
        }
        const amandementDetail =
          await this.proposalRepo.findAmandementDetailByProposalId(proposalId);
        if (!amandementDetail) {
          throw new BadRequestException('Failed to fetch amandement detail!');
        }
        const rawAllowedKeys = JSON.parse(amandementDetail.detail);
        const allowedKeys = Object.keys(rawAllowedKeys);
        const keySet = new Set(allowedKeys);
        // console.log({ allowedKeys });
        // console.log('update proposal key', Object.keys(updateProposalPayload));
        for (const key of Object.keys(updateProposalPayload)) {
          if (!keySet.has(key)) {
            throw new BadRequestException(
              'You are just allowed to change what defined by the supervisor!',
            );
          }
        }
        if (sendRevisionPayload.detail_project_budgets) {
          proposal_item_budgets = CreateItemBudgetsMapper(
            proposal.id,
            sendRevisionPayload.detail_project_budgets,
          );
        }
        updateProposalPayload.outter_status = OutterStatusEnum.ONGOING;
      } catch (err) {
        if (uploadedFilePath.length > 0) {
          this.logger.log('info', `error details \n ${logUtil(err)}`);
          this.logger.log(
            'info',
            `error orccured during send revision, deleting all previous uploaded files`,
          );
          uploadedFilePath.forEach(async (path) => {
            await this.bunnyService.deleteMedia(path, true);
          });
        }
        throw err;
      }
    }

    // create proposal and the logs
    const updatedProposal = await this.proposalRepo.updateMyProposal(
      proposal.id,
      updateProposalPayload,
      proposal_item_budgets,
      fileManagerCreateManyPayload,
      deletedFileManagerUrls,
      uploadedFilePath,
      !!sendRevisionPayload ? true : false,
      (this.configService.get('tenderAppConfig.baseUrl') as string) || '',
    );

    if (!!sendRevisionPayload && updatedProposal.notif)
      this.notifService.sendSmsAndEmailBatch(updatedProposal.notif);

    return updatedProposal.proposal;
  }

  async clientUpdateProposalInterceptor(
    userId: string,
    saveDraftPayload?: ProposalSaveDraftDto,
    sendRevisionPayload?: SendRevisionDto,
    letter_ofsupport_req?: any, // Express.Multer.File[] | UploadFilesJsonbDto;
    project_attachments?: any, // Express.Multer.File[] | UploadFilesJsonbDto;
  ) {
    // console.log({ letter_ofsupport_req });
    // console.log({ project_attachments });
    // console.log({ sendRevisionPayload });
    // console.log({ saveDraftPayload });
    const proposalId =
      saveDraftPayload?.proposal_id || sendRevisionPayload?.proposal_id || '';

    // find proposal by id
    const proposal = await this.proposalRepo.fetchProposalById(proposalId);
    if (!proposal) throw new BadRequestException(`Proposal not found`);

    if (proposal.submitter_user_id !== userId) {
      throw new BadRequestException(
        `You are not allowed to edit this proposal`,
      );
    }

    const tmpProjectAttachments: any =
      saveDraftPayload?.project_attachments ||
      sendRevisionPayload?.project_attachments ||
      project_attachments;

    const tmpLetterOfSupportReq: any =
      saveDraftPayload?.letter_ofsupport_req ||
      sendRevisionPayload?.letter_ofsupport_req ||
      letter_ofsupport_req;

    let updateProposalPayload: Prisma.proposalUncheckedUpdateInput = {};

    let uploadedFilePath: string[] = [];
    const fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[] =
      [];
    const deletedFileManagerUrls: string[] = []; // id of file manager that we want to mark as soft delete.

    let proposal_item_budgets:
      | Prisma.proposal_item_budgetCreateManyInput[]
      | undefined = undefined;

    if (!!saveDraftPayload) {
      updateProposalPayload = UpdateProposalMapper(saveDraftPayload);
      if (saveDraftPayload.proposal_bank_information_id) {
        const isMyOwnBank = await this.proposalRepo.validateOwnBankAccount(
          userId,
          saveDraftPayload.proposal_bank_information_id,
        );
        if (!isMyOwnBank) {
          throw new BadRequestException('Bank account is not yours');
        }
        updateProposalPayload.proposal_bank_id =
          saveDraftPayload.proposal_bank_information_id;
      }

      if (saveDraftPayload.detail_project_budgets) {
        proposal_item_budgets = CreateItemBudgetsMapper(
          proposal.id,
          saveDraftPayload.detail_project_budgets,
        );
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

    // console.log({ tmpProjectAttachments });
    // console.log({ tmpLetterOfSupportReq });
    if (
      !!tmpProjectAttachments &&
      tmpProjectAttachments.length > 0 &&
      !isUploadFileJsonb(tmpProjectAttachments[0])
    ) {
      const uploadResult = await this.uploadProposalFileIntercept(
        userId,
        proposalId,
        'uploading project attachments',
        tmpProjectAttachments[0],
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
        proposal_id: proposalId,
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

    if (
      !!tmpLetterOfSupportReq &&
      tmpLetterOfSupportReq.length > 0 &&
      !isUploadFileJsonb(tmpLetterOfSupportReq[0])
    ) {
      const uploadResult = await this.uploadProposalFileIntercept(
        userId,
        proposalId,
        'uploading letter of support',
        tmpLetterOfSupportReq[0],
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
        proposal_id: proposalId,
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

    if (!!sendRevisionPayload) {
      try {
        if (Object.keys(updateProposalPayload).length > 0) {
          const restOfPayload = SendRevisionMapper(sendRevisionPayload);
          updateProposalPayload = {
            ...updateProposalPayload,
            ...restOfPayload,
          };
        } else {
          updateProposalPayload = SendRevisionMapper(sendRevisionPayload);
        }
        if (Object.keys(updateProposalPayload).length === 0) {
          throw new BadRequestException(
            'You must change at least one value that defined by supervisor',
          );
        }
        const amandementDetail =
          await this.proposalRepo.findAmandementDetailByProposalId(proposalId);
        if (!amandementDetail) {
          throw new BadRequestException('Failed to fetch amandement detail!');
        }
        const rawAllowedKeys = JSON.parse(amandementDetail.detail);
        const allowedKeys = Object.keys(rawAllowedKeys);
        const keySet = new Set(allowedKeys);
        // console.log({ allowedKeys });
        // console.log('update proposal key', Object.keys(updateProposalPayload));
        for (const key of Object.keys(updateProposalPayload)) {
          if (!keySet.has(key)) {
            throw new BadRequestException(
              'You are just allowed to change what defined by the supervisor!',
            );
          }
        }
        if (sendRevisionPayload.detail_project_budgets) {
          proposal_item_budgets = CreateItemBudgetsMapper(
            proposal.id,
            sendRevisionPayload.detail_project_budgets,
          );
        }
        updateProposalPayload.outter_status = OutterStatusEnum.ONGOING;
      } catch (err) {
        if (uploadedFilePath.length > 0) {
          this.logger.log('info', `error details \n ${logUtil(err)}`);
          this.logger.log(
            'info',
            `error orccured during send revision, deleting all previous uploaded files`,
          );
          uploadedFilePath.forEach(async (path) => {
            await this.bunnyService.deleteMedia(path, true);
          });
        }
        throw err;
      }
    }

    // create proposal and the logs
    const updatedProposal = await this.proposalRepo.updateMyProposal(
      proposal.id,
      updateProposalPayload,
      proposal_item_budgets,
      fileManagerCreateManyPayload,
      deletedFileManagerUrls,
      uploadedFilePath,
      !!sendRevisionPayload ? true : false,
      (this.configService.get('tenderAppConfig.baseUrl') as string) || '',
    );

    if (!!sendRevisionPayload && updatedProposal.notif)
      this.notifService.sendSmsAndEmailBatch(updatedProposal.notif);

    return updatedProposal.proposal;
  }

  async deleteDraft(userId: string, proposal_id: string) {
    const deletedFileManagerUrls: string[] = []; // id of file manager that we want to mark as soft delete.

    const proposal = await this.proposalRepo.fetchProposalById(proposal_id);
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

    const deletedProposal = await this.proposalRepo.deleteProposal(
      proposal.id,
      deletedFileManagerUrls,
    );

    return deletedProposal;
  }

  async askAmandementRequest(
    currentUser: TenderCurrentUser,
    request: AskAmandementRequestDto,
  ) {
    const { proposal_id } = request;
    const proposal = await this.proposalRepo.fetchProposalById(proposal_id);
    if (!proposal) throw new BadRequestException('Proposal Not Found!');

    if (proposal.outter_status === OutterStatusEnum.ON_REVISION) {
      throw new BadRequestException(
        'Proposal aready asked for client to be revised!',
      );
    }

    if (proposal.outter_status === OutterStatusEnum.ASKED_FOR_AMANDEMENT) {
      throw new BadRequestException(
        'Proposal already asked to supervisor for an amandement to the user!',
      );
    }

    const createAskEditRequestPayload = CreateProposalAskedEditRequestMapper(
      currentUser,
      request,
    );

    const proposalUpdatePayload: Prisma.proposalUncheckedUpdateInput = {
      outter_status: OutterStatusEnum.ASKED_FOR_AMANDEMENT,
    };

    return await this.proposalRepo.askForAmandementRequest(
      currentUser,
      proposal_id,
      createAskEditRequestPayload,
      proposalUpdatePayload,
    );
  }

  async sendAmandement(
    userId: string,
    request: SendAmandementDto,
  ): Promise<proposal> {
    /* object atleas has id, and one more payload (notes), if not then throw err */
    if (Object.keys(request).length < 2) {
      throw new BadRequestException('Give at least one revision!');
    }

    const { proposal_id } = request;

    const proposal = await this.proposalRepo.fetchProposalById(proposal_id);
    if (!proposal) {
      throw new BadRequestException('Proposal Not Found!');
    }

    if (proposal.outter_status === OutterStatusEnum.ON_REVISION) {
      throw new BadRequestException(
        'You cant send amandement that already on revision',
      );
    }

    const createProposalEditRequestPayload = ProposalUpdateRequestMapper(
      proposal,
      userId,
      request,
    );

    const proposalUpdatePayload: Prisma.proposalUncheckedUpdateInput = {
      supervisor_id: userId,
      outter_status: OutterStatusEnum.ON_REVISION,
    };

    const sendAmandementResult = await this.proposalRepo.sendAmandement(
      proposal_id,
      userId,
      proposalUpdatePayload,
      createProposalEditRequestPayload,
      request.notes,
      request.selectLang,
    );

    this.notificationService.sendSmsAndEmailBatch(
      sendAmandementResult.sendAmandementNotif,
    );

    return sendAmandementResult.updatedProposal;
  }

  async getAmandementByProposalId(proposalId: string) {
    const amandement = await this.proposalRepo.findAmandementByProposalId(
      proposalId,
    );
    if (!amandement) {
      throw new BadRequestException('Amandement Not Found!');
    }
    return {
      proposal: amandement.proposal,
      detail: JSON.parse(amandement.detail),
    };
  }

  async fetchAmandementList(
    currentUser: TenderCurrentUser,
    filter: FetchAmandementFilterRequest,
  ) {
    return await this.proposalRepo.findAmandementList(currentUser, filter);
  }

  async fetchProposalList(
    currentUser: TenderCurrentUser,
    filter: FetchProposalFilterRequest,
  ) {
    return await this.proposalRepo.fetchProposalList(currentUser, filter);
  }

  async fetchOldProposalList(
    currentUser: TenderCurrentUser,
    filter: FetchProposalFilterRequest,
  ) {
    return await this.proposalRepo.fetchOldProposalList(currentUser, filter);
  }

  async fetchAmandementRequestList(
    currentUser: TenderCurrentUser,
    filter: FetchAmandementFilterRequest,
  ) {
    return await this.proposalRepo.fetchAmandementRequestList(
      currentUser,
      filter,
    );
  }

  async changeProposalState(
    currentUser: TenderCurrentUser,
    request: ChangeProposalStateDto,
  ) {
    const proposal = await this.proposalRepo.fetchProposalById(
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
        currentUser,
      );

      proposalUpdatePayload = { ...supervisorResult.proposalUpdatePayload };
      proposalLogCreateInput = { ...supervisorResult.proposalLogCreateInput };
      createdItemBudgetPayload = [...supervisorResult.createdItemBudgetPayload];
      updatedItemBudgetPayload = [...supervisorResult.updatedItemBudgetPayload];
      deletedItemBudgetIds = [...supervisorResult.deletedItemBudgetIds];
    }

    if (currentUser.choosenRole === 'tender_project_manager') {
      const pm = await this.projectManagerChangeState(
        proposal,
        proposalUpdatePayload,
        proposalLogCreateInput,
        request,
        createdItemBudgetPayload,
        updatedItemBudgetPayload,
        deletedItemBudgetIds,
        currentUser,
      );
      // createdRecommendedSupportPayload,
      // updatedRecommendedSupportPayload,
      // deletedRecommendedSupportIds,

      proposalUpdatePayload = { ...pm.proposalUpdatePayload };
      proposalLogCreateInput = { ...pm.proposalLogCreateInput };
      createdItemBudgetPayload = [...pm.createdItemBudgetPayload];
      updatedItemBudgetPayload = [...pm.updatedItemBudgetPayload];
      deletedItemBudgetIds = [...pm.deletedItemBudgetIds];
      // createdRecommendedSupportPayload = [
      //   ...pm.createdRecommendedSupportPayload,
      // ];
      // updatedRecommendedSupportPayload = [
      //   ...pm.updatedRecommendedSupportPayload,
      // ];
      // deletedRecommendedSupportIds = [...pm.deletedRecommendedSupportIds];
    }

    if (currentUser.choosenRole === 'tender_consultant') {
      const consultant = await this.consultantChangeState(
        proposalUpdatePayload,
        proposalLogCreateInput,
        request,
      );
      proposalUpdatePayload = { ...consultant.proposalUpdatePayload };
      proposalLogCreateInput = { ...consultant.proposalLogCreateInput };
    }

    if (currentUser.choosenRole === 'tender_ceo') {
      const ceo = await this.ceoChangeState(
        proposal,
        proposalUpdatePayload,
        proposalLogCreateInput,
        request,
        createdItemBudgetPayload,
        updatedItemBudgetPayload,
        deletedItemBudgetIds,
      );
      // createdRecommendedSupportPayload,
      // updatedRecommendedSupportPayload,
      // deletedRecommendedSupportIds,
      proposalUpdatePayload = { ...ceo.proposalUpdatePayload };
      proposalLogCreateInput = { ...ceo.proposalLogCreateInput };
      createdItemBudgetPayload = [...ceo.createdItemBudgetPayload];
      updatedItemBudgetPayload = [...ceo.updatedItemBudgetPayload];
      deletedItemBudgetIds = [...ceo.deletedItemBudgetIds];
      // createdRecommendedSupportPayload = [
      //   ...ceo.createdRecommendedSupportPayload,
      // ];
      // updatedRecommendedSupportPayload = [
      //   ...ceo.updatedRecommendedSupportPayload,
      // ];
      // deletedRecommendedSupportIds = [...ceo.deletedRecommendedSupportIds];
    }

    /* update proposal and create the logs */
    const updateProposalResult = await this.proposalRepo.updateProposalState(
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
      { data: proposal_logs },
      currentUser.choosenRole,
      request.selectLang,
    );

    return updateProposalResult.proposal;
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
    // if (!request.moderator_payload) {
    //   throw new BadRequestException('Moderator accept payload is required!');
    // }

    // /* validate the sended track */
    // const track = await this.proposalRepo.findTrackById(
    //   request.moderator_payload.project_track,
    // );
    // if (!track) {
    //   throw new BadRequestException(
    //     `Invalid Track (${request.moderator_payload.project_track})`,
    //   );
    // }

    if (request.action === ProposalAction.ACCEPT) {
      if (!request.moderator_payload) {
        throw new BadRequestException('Moderator accept payload is required!');
      }

      /* validate the sended track */
      const track = await this.proposalRepo.findTrackById(
        request.moderator_payload.track_id,
      );
      if (!track) {
        throw new BadRequestException(
          `Invalid Track (${request.moderator_payload.track_id})`,
        );
      }
      /* proposal */
      proposalUpdatePayload.inner_status =
        InnerStatusEnum.ACCEPTED_BY_MODERATOR;
      proposalUpdatePayload.outter_status = OutterStatusEnum.ONGOING;
      proposalUpdatePayload.state = TenderAppRoleEnum.PROJECT_SUPERVISOR;
      proposalUpdatePayload.track_id = track.id;

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
    proposal: FetchProposalByIdResponse['response'],
    proposalUpdatePayload: Prisma.proposalUncheckedUpdateInput,
    proposalLogCreateInput: Prisma.proposal_logUncheckedCreateInput,
    request: ChangeProposalStateDto,
    createdItemBudgetPayload: Prisma.proposal_item_budgetCreateManyInput[],
    updatedItemBudgetPayload: Prisma.proposal_item_budgetUncheckedUpdateInput[],
    deletedItemBudgetIds: string[],
    currentUser: TenderCurrentUser,
  ) {
    // createdRecommendedSupportPayload: Prisma.recommended_support_consultantCreateManyInput[],
    // updatedRecommendedSupportPayload: Prisma.recommended_support_consultantUncheckedUpdateInput[],
    // deletedRecommendedSupportIds: string[],
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
        // created_recommended_support,
        // updated_recommended_support,
        // deleted_recommended_support,
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
      proposalUpdatePayload.state = TenderAppRoleEnum.PROJECT_MANAGER;
      proposalUpdatePayload.supervisor_id = currentUser.id;

      /* custom logic if there's special logic for regular track */
      // if (proposal?.track?.name !== 'CONCESSIONAL_GRANTS') {
      // }

      /* custom logic if the track is CONCESSIONAL_GRANTS */
      if (proposal?.track?.with_consultation === true) {
        proposalUpdatePayload = SupervisorGrantTrackAccMapper(
          proposalUpdatePayload,
          request.supervisor_payload,
        );

        // createdRecommendedSupportPayload =
        //   SupervisorAccCreatedRecommendedSupportMapper(
        //     request.proposal_id,
        //     created_recommended_support,
        //     createdRecommendedSupportPayload,
        //   );

        // if (
        //   updated_recommended_support &&
        //   updated_recommended_support.length > 0
        // ) {
        //   updatedRecommendedSupportPayload = updated_recommended_support;
        // }

        // if (
        //   deleted_recommended_support &&
        //   deleted_recommended_support.length > 0
        // ) {
        //   for (const recommendSuppport of deleted_recommended_support) {
        //     deletedRecommendedSupportIds.push(recommendSuppport.id);
        //   }
        // }
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
      proposalUpdatePayload.supervisor_id = currentUser.id;

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

    // return {
    //   proposalUpdatePayload,
    //   proposalLogCreateInput,
    //   createdItemBudgetPayload,
    //   updatedItemBudgetPayload,
    //   deletedItemBudgetIds,
    //   createdRecommendedSupportPayload,
    //   updatedRecommendedSupportPayload,
    //   deletedRecommendedSupportIds,
    // };
    return {
      proposalUpdatePayload,
      proposalLogCreateInput,
      createdItemBudgetPayload,
      updatedItemBudgetPayload,
      deletedItemBudgetIds,
    };
  }

  async projectManagerChangeState(
    proposal: FetchProposalByIdResponse['response'],
    proposalUpdatePayload: Prisma.proposalUncheckedUpdateInput,
    proposalLogCreateInput: Prisma.proposal_logUncheckedCreateInput,
    request: ChangeProposalStateDto,
    createdItemBudgetPayload: Prisma.proposal_item_budgetCreateManyInput[],
    updatedItemBudgetPayload: Prisma.proposal_item_budgetUncheckedUpdateInput[],
    deletedItemBudgetIds: string[],
    currentUser: TenderCurrentUser,
  ) {
    // createdRecommendedSupportPayload: Prisma.recommended_support_consultantCreateManyInput[],
    // updatedRecommendedSupportPayload: Prisma.recommended_support_consultantUncheckedUpdateInput[],
    // deletedRecommendedSupportIds: string[],
    /* Project manager only allowed to acc and reject and step back, and ask for consultation*/
    if (
      [
        ProposalAction.ACCEPT,
        ProposalAction.REJECT,
        ProposalAction.UPDATE,
        ProposalAction.STEP_BACK,
        ProposalAction.ACCEPT_AND_ASK_FOR_CONSULTATION,
        ProposalAction.STUDY_AGAIN,
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
      proposalUpdatePayload.project_manager_id = currentUser.id;

      /* log */
      proposalLogCreateInput.action = ProposalAction.ACCEPT;
      proposalLogCreateInput.state = TenderAppRoleEnum.PROJECT_MANAGER;
      proposalLogCreateInput.user_role = TenderAppRoleEnum.PROJECT_MANAGER;
    }

    if (request.action === ProposalAction.ACCEPT_AND_ASK_FOR_CONSULTATION) {
      /* proposal */
      proposalUpdatePayload.inner_status =
        InnerStatusEnum.ACCEPTED_AND_NEED_CONSULTANT;
      proposalUpdatePayload.outter_status = OutterStatusEnum.ONGOING;
      proposalUpdatePayload.state = TenderAppRoleEnum.CONSULTANT;
      proposalUpdatePayload.project_manager_id = currentUser.id;

      /* log */
      proposalLogCreateInput.action =
        ProposalAction.ACCEPT_AND_ASK_FOR_CONSULTATION;
      proposalLogCreateInput.state = TenderAppRoleEnum.PROJECT_MANAGER;
      proposalLogCreateInput.user_role = TenderAppRoleEnum.PROJECT_MANAGER;
    }

    if (request.action === ProposalAction.UPDATE) {
      if (!request.project_manager_payload) {
        throw new BadRequestException('Project Manager Payload is Required!');
      }

      const result = await this.handleUpdateProposalTrackInfo(
        proposal,
        request.proposal_id,
        proposalUpdatePayload,
        request.project_manager_payload,
        createdItemBudgetPayload,
        updatedItemBudgetPayload,
        deletedItemBudgetIds,
      );
      // createdRecommendedSupportPayload,
      // updatedRecommendedSupportPayload,
      // deletedRecommendedSupportIds,

      proposalUpdatePayload = { ...result.proposalUpdatePayload };
      createdItemBudgetPayload = [...result.createdItemBudgetPayload];
      updatedItemBudgetPayload = [...result.updatedItemBudgetPayload];
      deletedItemBudgetIds = [...result.deletedItemBudgetIds];

      if (proposal?.track?.with_consultation === true) {
        proposalUpdatePayload.inner_status =
          InnerStatusEnum.ACCEPTED_BY_PROJECT_MANAGER;
        proposalUpdatePayload.outter_status = OutterStatusEnum.ONGOING;
        proposalUpdatePayload.state = TenderAppRoleEnum.CEO;
        proposalUpdatePayload.project_manager_id = currentUser.id;

        proposalLogCreateInput.action = ProposalAction.ACCEPT;
        proposalLogCreateInput.state = TenderAppRoleEnum.PROJECT_MANAGER;
        proposalLogCreateInput.user_role = TenderAppRoleEnum.PROJECT_MANAGER;
      }
    }

    if (request.action === ProposalAction.REJECT) {
      /* proposal */
      proposalUpdatePayload.inner_status =
        InnerStatusEnum.REJECTED_BY_PROJECT_MANAGER;
      proposalUpdatePayload.outter_status = OutterStatusEnum.CANCELED;
      proposalUpdatePayload.state = TenderAppRoleEnum.CEO;
      proposalUpdatePayload.project_manager_id = currentUser.id;

      /* log */
      proposalLogCreateInput.action = ProposalAction.REJECT;
      proposalLogCreateInput.state = TenderAppRoleEnum.CEO;
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
      proposalLogCreateInput.state = TenderAppRoleEnum.PROJECT_SUPERVISOR;
      proposalLogCreateInput.user_role = TenderAppRoleEnum.PROJECT_MANAGER;
    }

    if (request.action === ProposalAction.STUDY_AGAIN) {
      /* proposal */
      proposalUpdatePayload.inner_status =
        InnerStatusEnum.ACCEPTED_BY_MODERATOR;
      proposalUpdatePayload.outter_status = OutterStatusEnum.ONGOING;
      proposalUpdatePayload.state = TenderAppRoleEnum.PROJECT_SUPERVISOR;
      proposalUpdatePayload.project_manager_id = null;
      // proposalUpdatePayload.supervisor_id = null;

      /* log */
      proposalLogCreateInput.action = ProposalAction.STUDY_AGAIN;
      proposalLogCreateInput.state = TenderAppRoleEnum.PROJECT_MANAGER;
      proposalLogCreateInput.user_role = TenderAppRoleEnum.PROJECT_MANAGER;
    }

    // createdRecommendedSupportPayload,
    // updatedRecommendedSupportPayload,
    // deletedRecommendedSupportIds,
    return {
      proposalUpdatePayload,
      proposalLogCreateInput,
      createdItemBudgetPayload,
      updatedItemBudgetPayload,
      deletedItemBudgetIds,
    };
  }

  async ceoChangeState(
    proposal: FetchProposalByIdResponse['response'],
    proposalUpdatePayload: Prisma.proposalUncheckedUpdateInput,
    proposalLogCreateInput: Prisma.proposal_logUncheckedCreateInput,
    request: ChangeProposalStateDto,
    createdItemBudgetPayload: Prisma.proposal_item_budgetCreateManyInput[],
    updatedItemBudgetPayload: Prisma.proposal_item_budgetUncheckedUpdateInput[],
    deletedItemBudgetIds: string[],
  ) {
    // createdRecommendedSupportPayload: Prisma.recommended_support_consultantCreateManyInput[],
    // updatedRecommendedSupportPayload: Prisma.recommended_support_consultantUncheckedUpdateInput[],
    // deletedRecommendedSupportIds: string[],
    /* CEO only allowed to acc and reject and step back */
    if (
      [
        ProposalAction.ACCEPT,
        ProposalAction.REJECT,
        ProposalAction.UPDATE,
        ProposalAction.STEP_BACK,
        ProposalAction.STUDY_AGAIN,
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
      proposalUpdatePayload.state = TenderAppRoleEnum.PROJECT_SUPERVISOR;

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

    if (request.action === ProposalAction.UPDATE) {
      if (!request.ceo_payload) {
        throw new BadRequestException('Project Manager Payload is Required!');
      }

      const result = await this.handleUpdateProposalTrackInfo(
        proposal,
        request.proposal_id,
        proposalUpdatePayload,
        request.ceo_payload,
        createdItemBudgetPayload,
        updatedItemBudgetPayload,
        deletedItemBudgetIds,
      );
      // createdRecommendedSupportPayload,
      // updatedRecommendedSupportPayload,
      // deletedRecommendedSupportIds,

      proposalUpdatePayload = { ...result.proposalUpdatePayload };
      createdItemBudgetPayload = [...result.createdItemBudgetPayload];
      updatedItemBudgetPayload = [...result.updatedItemBudgetPayload];
      deletedItemBudgetIds = [...result.deletedItemBudgetIds];

      if (proposal?.track?.with_consultation === true) {
        /* proposal */
        proposalUpdatePayload.inner_status =
          InnerStatusEnum.ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION;
        proposalUpdatePayload.outter_status = 'ONGOING';
        proposalUpdatePayload.state = TenderAppRoleEnum.PROJECT_SUPERVISOR;

        /* log */
        proposalLogCreateInput.action = ProposalAction.ACCEPT;
        proposalLogCreateInput.state = TenderAppRoleEnum.CEO;
        proposalLogCreateInput.user_role = TenderAppRoleEnum.CEO;
      }
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

    if (request.action === ProposalAction.STUDY_AGAIN) {
      // pilih choose roles between defined value
      if (!request.ceo_payload) {
        throw new BadRequestException('no ceo payload defined!');
      }

      if (!request.ceo_payload.step_back_to) {
        throw new UnprocessableEntityException(
          'You must select between moderator, project manager and supervisor!',
        );
      }

      const choosenState = request.ceo_payload
        .step_back_to as TenderAppRoleEnum;

      let inner: InnerStatusEnum = InnerStatusEnum.CREATED_BY_CLIENT;

      if (choosenState === TenderAppRoleEnum.CLIENT) {
        inner = InnerStatusEnum.CREATED_BY_CLIENT;
      }
      if (choosenState === TenderAppRoleEnum.PROJECT_SUPERVISOR) {
        inner = InnerStatusEnum.ACCEPTED_BY_MODERATOR;
      }
      if (choosenState === TenderAppRoleEnum.PROJECT_MANAGER) {
        inner = InnerStatusEnum.ACCEPTED_BY_SUPERVISOR;
      }

      /* proposal */
      proposalUpdatePayload.inner_status = inner;
      proposalUpdatePayload.outter_status = OutterStatusEnum.ONGOING;
      proposalUpdatePayload.state = choosenState;
      // proposalUpdatePayload.state = TenderAppRoleEnum.MODERATOR;
      // proposalUpdatePayload.project_manager_id = null;
      // proposalUpdatePayload.supervisor_id = null;

      /* log */
      proposalLogCreateInput.action = ProposalAction.STUDY_AGAIN;
      proposalLogCreateInput.state = choosenState;
      proposalLogCreateInput.user_role = TenderAppRoleEnum.CEO;
    }

    // createdRecommendedSupportPayload,
    // updatedRecommendedSupportPayload,
    // deletedRecommendedSupportIds,
    return {
      proposalUpdatePayload,
      proposalLogCreateInput,
      createdItemBudgetPayload,
      updatedItemBudgetPayload,
      deletedItemBudgetIds,
    };
  }

  async consultantChangeState(
    proposalUpdatePayload: Prisma.proposalUncheckedUpdateInput,
    proposalLogCreateInput: Prisma.proposal_logUncheckedCreateInput,
    request: ChangeProposalStateDto,
  ) {
    /* Consultant only allowed to acc and reject and step back */
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

    if (request.action === ProposalAction.STEP_BACK) {
      /* proposal */
      proposalUpdatePayload.inner_status =
        InnerStatusEnum.ACCEPTED_BY_SUPERVISOR;
      proposalUpdatePayload.outter_status = OutterStatusEnum.ONGOING;
      proposalUpdatePayload.state = TenderAppRoleEnum.PROJECT_MANAGER;

      /* log */
      proposalLogCreateInput.action = ProposalAction.STEP_BACK;
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
    reviewerRole: TenderFusionAuthRoles,
    selected_language?: 'ar' | 'en',
  ) {
    const actions =
      log.data.action && ['accept', 'reject'].indexOf(log.data.action) > -1
        ? log.data.action
        : 'review';

    const subject = `Proposal ${actions}ed Notification`;
    let clientContent = `Your proposal (${log.data.proposal.project_name}), has been ${actions}ed by ${reviewerRole} at (${log.data.created_at})`;
    if (log.data.reviewer) {
      clientContent = `Your proposal (${log.data.proposal.project_name}), has been ${actions}ed by ${reviewerRole} (${log.data.reviewer.employee_name}) at (${log.data.created_at})`;
    }
    const employeeContent = `Your review has been submitted for proposal (${log.data.proposal.project_name}) at (${log.data.created_at}), and already been notified to the user ${log.data.proposal.user.employee_name} (${log.data.proposal.user.email})`;

    /* EMAIL NOTIF */
    if (log.data.reviewer) {
      // const employeeEmailNotifPayload: SendEmailDto = {
      //   mailType: 'plain',
      //   to: log.data.reviewer.email,
      //   from: 'no-reply@hcharity.org',
      //   subject,
      //   content: employeeContent,
      // };
      // if (actions === ProposalAction.ACCEPT) {
      //   // if its accepted, send notif
      // }
    }

    const clientEmailNotifPayload: SendEmailDto = {
      mailType: 'template',
      to: log.data.proposal.user.email,
      from: 'no-reply@hcharity.org',
      subject,
      templatePath: `tender/${selected_language || 'ar'}/proposal/${
        log.data.action === 'reject' ? 'project_declined' : 'project_approved'
      }`,
      templateContext: {
        projectName: log.data.proposal.project_name,
        clientUsername: log.data.proposal.user.employee_name,
        projectDetailUrl:
          actions === ProposalAction.REJECT
            ? `${this.configService.get<string>(
                'tenderAppConfig.baseUrl',
              )}/client/dashboard/previous-funding-requests/${
                log.data.proposal.id
              }/show-project`
            : `${this.configService.get<string>(
                'tenderAppConfig.baseUrl',
              )}/client/dashboard/current-project/${
                log.data.proposal.id
              }/show-project`,
      },
    };

    if (actions === ProposalAction.ACCEPT) {
      if (reviewerRole === 'tender_ceo') {
        this.emailService.sendMail(clientEmailNotifPayload);
      }
    }

    if (actions === ProposalAction.REJECT) {
      this.emailService.sendMail(clientEmailNotifPayload);
    }

    /* EMAIL NOTIF */

    /* WEB NOTIF */
    // if (log.data.reviewer_id) {
    // const employeeWebNotifPayload: CreateNotificationDto = {
    //   type: 'PROPOSAL',
    //   specific_type: `PROJECT_${actions.toUpperCase()}ED`,
    //   user_id: log.data.reviewer_id,
    //   proposal_id: log.data.proposal_id,
    //   subject,
    //   content: employeeContent,
    // };
    // }

    const clientWebNotifPayload: CreateNotificationDto = {
      type: 'PROPOSAL',
      specific_type: `PROJECT_${actions.toUpperCase()}ED`,
      user_id: log.data.proposal.submitter_user_id,
      proposal_id: log.data.proposal_id,
      subject,
      content: clientContent,
    };

    if (actions === ProposalAction.ACCEPT) {
      if (reviewerRole === 'tender_ceo') {
        await this.notifService.create(clientWebNotifPayload);
      }
    }

    if (actions === ProposalAction.REJECT) {
      await this.notifService.create(clientWebNotifPayload);
    }
    /* WEB NOTIF */

    /* SMS NOTIF */
    const clientPhone = isExistAndValidPhone(
      log.data.proposal.user.mobile_number,
    );
    if (clientPhone) {
      const sendClientNotif = this.msegatService.sendSMS({
        numbers: clientPhone,
        msg: subject + ',' + clientContent,
      });

      if (actions === ProposalAction.ACCEPT) {
        if (reviewerRole === 'tender_ceo') sendClientNotif;
      }

      if (actions === ProposalAction.REJECT) {
        sendClientNotif;
      }
    }

    // const reviewerPhone = isExistAndValidPhone(
    //   log.data.proposal.user.mobile_number,
    // );
    // if (reviewerPhone) {
    //   this.msegatService.sendSMS({
    //     numbers: reviewerPhone,
    //     msg: subject + ',' + clientContent,
    //   });
    // }
    /* SMS NOTIF */
  }

  async handleUpdateProposalTrackInfo(
    proposal: FetchProposalByIdResponse['response'],
    proposal_id: string,
    proposalUpdatePayload: Prisma.proposalUncheckedUpdateInput,
    request: ProjectManagerChangeStatePayload | CeoChangeStatePayload,
    createdItemBudgetPayload: Prisma.proposal_item_budgetCreateManyInput[],
    updatedItemBudgetPayload: Prisma.proposal_item_budgetUncheckedUpdateInput[],
    deletedItemBudgetIds: string[],
  ) {
    // createdRecommendedSupportPayload: Prisma.recommended_support_consultantCreateManyInput[],
    // updatedRecommendedSupportPayload: Prisma.recommended_support_consultantUncheckedUpdateInput[],
    // deletedRecommendedSupportIds: string[],
    const {
      created_proposal_budget,
      updated_proposal_budget,
      deleted_proposal_budget,
    } = request;

    proposalUpdatePayload = UpdateProposalTrackInfoMapper(
      proposalUpdatePayload,
      request,
    );

    createdItemBudgetPayload = SupervisorAccCreatedItemBudgetMapper(
      proposal_id,
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

    if (proposal?.track?.with_consultation === true) {
      proposalUpdatePayload = SupervisorGrantTrackAccMapper(
        proposalUpdatePayload,
        request,
      );

      // createdRecommendedSupportPayload =
      //   SupervisorAccCreatedRecommendedSupportMapper(
      //     proposal_id,
      //     request.created_recommended_support,
      //     createdRecommendedSupportPayload,
      //   );

      // if (
      //   request.updated_recommended_support &&
      //   request.updated_recommended_support.length > 0
      // ) {
      //   updatedRecommendedSupportPayload = request.updated_recommended_support;
      //   console.log({ updatedRecommendedSupportPayload });
      // }

      // if (
      //   request.deleted_recommended_support &&
      //   request.deleted_recommended_support.length > 0
      // ) {
      //   for (const recommendSuppport of request.deleted_recommended_support) {
      //     deletedRecommendedSupportIds.push(recommendSuppport.id);
      //   }
      // }
    }

    return {
      proposalUpdatePayload,
      createdItemBudgetPayload,
      updatedItemBudgetPayload,
      deletedItemBudgetIds,
    };
    // createdRecommendedSupportPayload,
    // updatedRecommendedSupportPayload,
    // deletedRecommendedSupportIds,
  }

  async fetchTrack(limit: number, page: number) {
    return await this.proposalRepo.fetchTrack(limit, page);
  }
}
