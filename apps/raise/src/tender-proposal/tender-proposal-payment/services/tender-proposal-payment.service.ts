import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, proposal, track_section } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { FileMimeTypeEnum } from '../../../commons/enums/file-mimetype.enum';
import { envLoadErrorHelper } from '../../../commons/helpers/env-loaderror-helper';
import { validateAllowedExtension } from '../../../commons/utils/validate-allowed-extension';
import { validateFileSize } from '../../../commons/utils/validate-file-size';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { TenderFilePayload } from '../../../tender-commons/dto/tender-file-payload.dto';
import { UploadFilesJsonbDto } from '../../../tender-commons/dto/upload-files-jsonb.dto';
import {
  appRoleMappers,
  TenderAppRole,
  TenderAppRoleEnum,
} from '../../../tender-commons/types';
import {
  InnerStatusEnum,
  OutterStatusEnum,
  ProposalAction,
} from '../../../tender-commons/types/proposal';
import { actionValidator } from '../../../tender-commons/utils/action-validator';
import { generateFileName } from '../../../tender-commons/utils/generate-filename';
import { isTenderFilePayload } from '../../../tender-commons/utils/is-tender-file-payload';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { ownershipErrorThrow } from '../../../tender-commons/utils/proposal-ownership-error-thrower';
import { TenderFileManagerService } from '../../../tender-file-manager/services/tender-file-manager.service';
import { TenderNotificationService } from '../../../tender-notification/services/tender-notification.service';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { TenderProposalLogRepository } from '../../tender-proposal-log/repositories/tender-proposal-log.repository';
import { TenderProposalRepository } from '../../tender-proposal/repositories/tender-proposal.repository';
import {
  CreateProposalPaymentDto,
  UpdatePaymentDto,
  SendClosingReportDto,
  AskClosingReportDto,
  CreateTrackBudgetDto,
  DeleteTrackBudgetDto,
  FindTrackBudgetFilter,
  UpdateTrackBudgetDto,
} from '../dtos/requests';
import { CreateChequeMapper, CreateClosingReportMapper } from '../mappers';
import { CreateManyPaymentMapper } from '../mappers/create-many-payment.mapper';
import { CreateTrackBudgetMapper } from '../mappers/create-track-section-budget-mapper';
import { TenderProposalPaymentRepository } from '../repositories/tender-proposal-payment.repository';

@Injectable()
export class TenderProposalPaymentService {
  private readonly appEnv: string;
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderProposalPaymentService.name,
  });

  constructor(
    private readonly configService: ConfigService,
    private readonly bunnyService: BunnyService,
    private readonly notificationService: TenderNotificationService,
    private readonly tenderProposalRepository: TenderProposalRepository,
    private readonly tenderProposalLogRepository: TenderProposalLogRepository,
    private readonly paymentRepo: TenderProposalPaymentRepository,
    private readonly fileManagerService: TenderFileManagerService,
  ) {
    const environment = this.configService.get('APP_ENV');
    if (!environment) envLoadErrorHelper('APP_ENV');
    this.appEnv = environment;
  }

  async insertPayment(
    currentUserId: string,
    request: CreateProposalPaymentDto,
  ): Promise<proposal> {
    const { payments, proposal_id } = request;

    const proposal = await this.tenderProposalRepository.fetchProposalById(
      proposal_id,
    );

    if (!proposal) throw new NotFoundException('Proposal not found');

    if (currentUserId !== proposal.supervisor_id) {
      throw new ForbiddenException(
        'You are not the responsible supervisor of this proposal!',
      );
    }

    if (!proposal.fsupport_by_supervisor) {
      throw new BadRequestException('Amount for support is not defined!');
    }

    if (!proposal.number_of_payments_by_supervisor) {
      throw new BadRequestException('Proposal number of payments is not set!');
    }

    // validate the length of the payment
    if (payments.length !== Number(proposal.number_of_payments_by_supervisor)) {
      throw new BadRequestException(
        'Number of payment is not equal to the defined payment on proposal!',
      );
    }

    const lastLog =
      await this.tenderProposalLogRepository.findLastLogCreateAtByProposalId(
        proposal.id,
      );

    const mapResult = CreateManyPaymentMapper(request);

    if (Number(proposal.fsupport_by_supervisor) !== mapResult.totalAmount) {
      throw new BadRequestException(
        'Amount required for support is not the same as the payload amount!',
      );
    }

    const createPaymentPayload: Prisma.paymentCreateManyInput[] =
      mapResult.payloads;

    const proposalUpdatePayload: Prisma.proposalUncheckedUpdateInput = {
      inner_status: InnerStatusEnum.ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR,
      outter_status: OutterStatusEnum.ONGOING,
      state: TenderAppRoleEnum.PROJECT_MANAGER,
    };

    // create the payment
    const insertResult = await this.paymentRepo.insertPayment(
      proposal_id,
      currentUserId,
      proposalUpdatePayload,
      createPaymentPayload,
      lastLog,
    );

    this.notificationService.sendSmsAndEmail(insertResult.insertNotif);

    return insertResult.updatedProposal;
  }

  async addTrackBudget(request: CreateTrackBudgetDto) {
    const createPayload: Prisma.track_sectionCreateManyInput[] =
      CreateTrackBudgetMapper(request);

    return await this.paymentRepo.createManyTrackSection(createPayload);
  }

  async findTrackBudgets(request: FindTrackBudgetFilter) {
    const response = await this.paymentRepo.findTrackBudget(request);

    return {
      data:
        response.length > 0
          ? response.map((res: any) => {
              return {
                id: res.id,
                name: res.name,
                budget: Number(res.budget),
                sections: res.sections,
              };
            })
          : [],
      total: response.length > 0 ? Number(response[0].total) : 0,
    };
  }

  async deleteTrackBudget(request: DeleteTrackBudgetDto) {
    return await this.paymentRepo.deleteTrackBudget(request.id);
  }

  async updateTrackBudget(request: UpdateTrackBudgetDto) {
    return await this.paymentRepo.updateTrackBudget(
      request.id,
      request.name,
      request.budget,
    );
  }

  async updatePayment(
    currentUser: TenderCurrentUser,
    request: UpdatePaymentDto,
  ): Promise<any> {
    let uploadedFilePath: string[] = [];
    try {
      const { id: userId, choosenRole } = currentUser;
      const { payment_id, action, cheque } = request;

      const payment = await this.paymentRepo.findPaymentById(payment_id);
      if (!payment) throw new NotFoundException('Payment not found');

      const proposal = await this.tenderProposalRepository.fetchProposalById(
        payment.proposal_id,
      );
      if (!proposal) {
        throw new NotFoundException('No proposal data found on this payment');
      }

      const lastLog =
        await this.tenderProposalLogRepository.findLastLogCreateAtByProposalId(
          proposal.id,
        );

      // let status:
      //   | 'SET_BY_SUPERVISOR'
      //   | 'ISSUED_BY_SUPERVISOR'
      //   | 'ACCEPTED_BY_PROJECT_MANAGER'
      //   | 'ACCEPTED_BY_FINANCE'
      //   | 'DONE'
      //   | null = null;
      let status:
        | ProposalAction.SET_BY_SUPERVISOR
        | ProposalAction.ISSUED_BY_SUPERVISOR
        | ProposalAction.ACCEPTED_BY_PROJECT_MANAGER
        | ProposalAction.ACCEPTED_BY_FINANCE
        | ProposalAction.DONE
        | null = null;

      let chequeObj: UploadFilesJsonbDto | undefined = undefined;
      let chequeCreatePayload: Prisma.chequeUncheckedCreateInput | undefined =
        undefined;
      const fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[] =
        [];
      const proposalUpdateInput: Prisma.proposalUncheckedUpdateInput = {};

      if (choosenRole === 'tender_project_manager') {
        if (proposal.project_manager_id !== userId) ownershipErrorThrow();
        actionValidator(['accept', 'reject'], action);
        if (action === 'accept')
          status = ProposalAction.ACCEPTED_BY_PROJECT_MANAGER;
        if (action === 'reject') status = ProposalAction.SET_BY_SUPERVISOR;
      }

      if (choosenRole === 'tender_finance') {
        actionValidator(['accept'], action);
        proposalUpdateInput.finance_id = userId;
        if (action === 'accept') status = ProposalAction.ACCEPTED_BY_FINANCE;
        // !TODO: if (action is edit) do something, still abmigous, need to discuss.
      }

      if (choosenRole === 'tender_project_supervisor') {
        if (proposal.supervisor_id !== userId) ownershipErrorThrow();
        actionValidator(['issue'], action);
        if (action === 'issue') status = ProposalAction.ISSUED_BY_SUPERVISOR;
      }

      if (choosenRole === 'tender_cashier') {
        // if (proposal.cashier_id !== userId) ownershipErrorThrow();
        actionValidator(['upload_receipt'], action);
        if (!cheque) throw new BadRequestException('Cheque data is required!');
        proposalUpdateInput.cashier_id = userId;
        if (action === 'upload_receipt') status = ProposalAction.DONE;
        const uploadResult = await this.uploadPaymentFileFile(
          proposal.id,
          `Uploading cheque for payment ${payment_id}`,
          request.cheque.transfer_receipt,
          'cheque',
          [
            FileMimeTypeEnum.JPG,
            FileMimeTypeEnum.JPEG,
            FileMimeTypeEnum.PNG,
            FileMimeTypeEnum.PDF,
          ],
          undefined,
          uploadedFilePath,
        );
        uploadedFilePath = uploadResult.uploadedFilePath;
        chequeObj = uploadResult.fileObj;

        const payload: Prisma.file_managerUncheckedCreateInput = {
          id: uuidv4(),
          user_id: userId,
          name: uploadResult.fileObj.url.split('/').pop() as string,
          url: uploadResult.fileObj.url,
          mimetype: uploadResult.fileObj.type,
          size: uploadResult.fileObj.size,
          proposal_id: proposal.id,
          column_name: 'transfer_receipt',
          table_name: 'cheque',
        };
        fileManagerCreateManyPayload.push(payload);

        chequeCreatePayload = CreateChequeMapper(request, chequeObj);
      }

      const response = await this.paymentRepo.updatePayment(
        payment_id,
        status,
        action,
        currentUser.id,
        appRoleMappers[choosenRole] as TenderAppRole,
        chequeCreatePayload,
        fileManagerCreateManyPayload,
        lastLog,
        proposalUpdateInput,
      );

      this.notificationService.sendSmsAndEmail(response.updateNotif);

      return {
        updatedPayment: response.payment,
        createdCheque: response.cheque,
      };
    } catch (err) {
      throw err;
    }
  }

  async uploadPaymentFileFile(
    proposalId: string,
    uploadMessage: string,
    file: TenderFilePayload,
    folderName: string,
    AllowedFileTypes: FileMimeTypeEnum[],
    maxSize: number = 1024 * 1024 * 6,
    uploadedFilePath: string[],
  ) {
    try {
      const fileName = generateFileName(
        file.fullName,
        file.fileExtension as FileMimeTypeEnum,
      );

      const filePath = `tmra/${this.appEnv}/organization/tender-management/proposal/${proposalId}/${folderName}/${fileName}`;

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
        `${uploadMessage}`,
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
          'log',
          `${uploadMessage} error, deleting all previous uploaded files: ${error}`,
        );
        uploadedFilePath.forEach(async (path) => {
          await this.bunnyService.deleteMedia(path, true);
        });
      }
      const theError = prismaErrorThrower(
        error,
        TenderProposalPaymentService.name,
        `${uploadMessage}, error:`,
        `${uploadMessage}`,
      );
      throw theError;
    }
  }

  async sendClosingReport(
    currentUser: TenderCurrentUser,
    request: SendClosingReportDto,
  ) {
    const { id, send } = request;
    const proposal = await this.tenderProposalRepository.fetchProposalById(id);
    if (!proposal) {
      throw new NotFoundException('No proposal data found on this payment');
    }

    const response = await this.paymentRepo.sendClosingReport(
      currentUser,
      id,
      send,
    );

    if (send) {
      this.notificationService.sendSmsAndEmailBatch(response.closeReportNotif);
    }

    return response.updatedProposal;
  }

  async completePayment(currentUser: TenderCurrentUser, proposal_id: string) {
    const proposal = await this.tenderProposalRepository.fetchProposalById(
      proposal_id,
    );
    if (!proposal) {
      throw new NotFoundException('No proposal data found on this payment');
    }

    const totalPayment = await this.paymentRepo.findPaymentsByProposalId(
      proposal_id,
      false,
    );

    const completedPayment = await this.paymentRepo.findPaymentsByProposalId(
      proposal_id,
      false,
    );

    if (totalPayment.length !== completedPayment.length) {
      throw new BadRequestException(
        "There's still unpaid payment on this project!",
      );
    }

    return await this.paymentRepo.completePayment(currentUser, proposal_id);
  }

  async submitClosingReport(
    currentUser: TenderCurrentUser,
    request: AskClosingReportDto,
  ) {
    const mappedRequest = CreateClosingReportMapper(request);
    const tmpObj: Record<string, any> = {};
    let uploadedFilePath: string[] = [];
    try {
      const fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[] =
        [];

      const maxSize: number = 1024 * 1024 * 6; // 6 MB
      const allowedType: FileMimeTypeEnum[] = [
        FileMimeTypeEnum.JPG,
        FileMimeTypeEnum.JPEG,
        FileMimeTypeEnum.PNG,
        FileMimeTypeEnum.PDF,
      ];

      for (let i = 0; i < request.attachments.length; i++) {
        const attachment = request.attachments[i];
        if (isTenderFilePayload(attachment)) {
          const uploadResult = await this.fileManagerService.uploadProposalFile(
            currentUser.id,
            request.proposal_id,
            'uploading closing report attachments',
            attachment,
            'closing-form/attachment',
            allowedType,
            maxSize,
            uploadedFilePath,
          );
          uploadedFilePath = uploadResult.uploadedFilePath;
          // tmpObj.attachments = uploadResult.fileObj;
          if (tmpObj.attachments !== undefined) {
            tmpObj.attachments.push(uploadResult.fileObj);
          } else {
            tmpObj.attachments = [uploadResult.fileObj];
          }

          const payload: Prisma.file_managerUncheckedCreateInput = {
            id: uuidv4(),
            user_id: currentUser.id,
            name: uploadResult.fileObj.url.split('/').pop() as string,
            url: uploadResult.fileObj.url,
            mimetype: uploadResult.fileObj.type,
            size: uploadResult.fileObj.size,
            column_name: 'attachments',
            table_name: 'closing_report_request',
            proposal_id: request.proposal_id,
          };
          fileManagerCreateManyPayload.push(payload);
        }
      }

      for (let i = 0; i < request.images.length; i++) {
        const images = request.images[i];
        if (isTenderFilePayload(images)) {
          const uploadResult = await this.fileManagerService.uploadProposalFile(
            currentUser.id,
            request.proposal_id,
            'uploading closing report images',
            images,
            'closing-form/images',
            allowedType,
            maxSize,
            uploadedFilePath,
          );
          uploadedFilePath = uploadResult.uploadedFilePath;
          if (tmpObj.images !== undefined) {
            tmpObj.images.push(uploadResult.fileObj);
          } else {
            tmpObj.images = [uploadResult.fileObj];
          }

          const payload: Prisma.file_managerUncheckedCreateInput = {
            id: uuidv4(),
            user_id: currentUser.id,
            name: uploadResult.fileObj.url.split('/').pop() as string,
            url: uploadResult.fileObj.url,
            mimetype: uploadResult.fileObj.type,
            size: uploadResult.fileObj.size,
            column_name: 'images',
            table_name: 'closing_report_request',
            proposal_id: request.proposal_id,
          };
          fileManagerCreateManyPayload.push(payload);
        }
      }

      const closingReportRequestPayload: Prisma.proposal_closing_reportUncheckedCreateInput =
        {
          ...mappedRequest,
          attachments: tmpObj.attachments,
          images: tmpObj.images,
        };

      const result = await this.paymentRepo.submitClosingReport(
        request.proposal_id,
        closingReportRequestPayload,
        fileManagerCreateManyPayload,
        uploadedFilePath,
      );

      return result;
    } catch (err) {
      throw err;
    }
  }
}
