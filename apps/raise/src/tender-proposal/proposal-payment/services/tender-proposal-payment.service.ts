import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, proposal } from '@prisma/client';
import { FileMimeTypeEnum } from '../../../commons/enums/file-mimetype.enum';
import { envLoadErrorHelper } from '../../../commons/helpers/env-loaderror-helper';
import { validateAllowedExtension } from '../../../commons/utils/validate-allowed-extension';
import { validateFileSize } from '../../../commons/utils/validate-file-size';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import { EmailService } from '../../../libs/email/email.service';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { TwilioService } from '../../../libs/twilio/services/twilio.service';
import { TenderFilePayload } from '../../../tender-commons/dto/tender-file-payload.dto';
import {
  appRoleMappers,
  TenderAppRole,
  TenderAppRoleEnum,
} from '../../../tender-commons/types';
import {
  InnerStatusEnum,
  OutterStatusEnum,
} from '../../../tender-commons/types/proposal';
import { actionValidator } from '../../../tender-commons/utils/action-validator';
import { generateFileName } from '../../../tender-commons/utils/generate-filename';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';
import { ownershipErrorThrow } from '../../../tender-commons/utils/proposal-ownership-error-thrower';
import { TenderNotificationService } from '../../../tender-notification/services/tender-notification.service';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { TenderProposalRepository } from '../../tender-proposal/repositories/tender-proposal.repository';
import { CreateProposalPaymentDto } from '../dtos/requests/create-payment.dto';
import { UpdatePaymentDto } from '../dtos/requests/update-payment.dto';
import { UpdatePaymentResponseDto } from '../dtos/responses/update-payment-response.dto';
import { CreateManyPaymentMapper } from '../mappers/create-many-payment.mapper';
import { TenderProposalPaymentRepository } from '../repositories/tender-proposal-payment.repository';
import { v4 as uuidv4 } from 'uuid';
import { UploadFilesJsonbDto } from '../../../tender-commons/dto/upload-files-jsonb.dto';
import { CreateChequeMapper } from '../mappers/create-cheque.mapper';
import { TenderProposalLogRepository } from '../../tender-proposal-log/repositories/tender-proposal-log.repository';
import moment from 'moment';
import { SendEmailDto } from '../../../libs/email/dtos/requests/send-email.dto';
import { CreateNotificationDto } from '../../../tender-notification/dtos/requests/create-notification.dto';
import { isExistAndValidPhone } from '../../../commons/utils/is-exist-and-valid-phone';
import { InsertPaymentNotifMapperResponse } from '../dtos/responses/insert-payment-notif-mapper-response.dto';
import { UpdatePaymentNotifMapperResponse } from '../dtos/responses/update-payment-notif-mapper-response.dto';
@Injectable()
export class TenderProposalPaymentService {
  private readonly appEnv: string;
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderProposalPaymentService.name,
  });

  constructor(
    private readonly configService: ConfigService,
    private readonly bunnyService: BunnyService,
    private readonly emailService: EmailService,
    private readonly twilioService: TwilioService,
    private readonly tenderProposalRepository: TenderProposalRepository,
    private readonly tenderProposalLogRepository: TenderProposalLogRepository,
    private readonly tenderProposalPaymentRepository: TenderProposalPaymentRepository,
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
    const insertResult =
      await this.tenderProposalPaymentRepository.insertPayment(
        proposal_id,
        currentUserId,
        proposalUpdatePayload,
        createPaymentPayload,
        lastLog,
      );

    this.sendInsertPaymentNotif(insertResult.insertNotif);

    return insertResult.updatedProposal;
  }

  async updatePayment(
    currentUser: TenderCurrentUser,
    request: UpdatePaymentDto,
  ): Promise<any> {
    let uploadedFilePath: string[] = [];
    try {
      const { id: userId, choosenRole } = currentUser;
      const { payment_id, action, cheque } = request;

      const payment =
        await this.tenderProposalPaymentRepository.findPaymentById(payment_id);
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

      let status:
        | 'SET_BY_SUPERVISOR'
        | 'ISSUED_BY_SUPERVISOR'
        | 'ACCEPTED_BY_PROJECT_MANAGER'
        | 'ACCEPTED_BY_FINANCE'
        | 'DONE'
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
        if (action === 'accept') status = 'ACCEPTED_BY_PROJECT_MANAGER';
        if (action === 'reject') status = 'SET_BY_SUPERVISOR';
      }

      if (choosenRole === 'tender_finance') {
        actionValidator(['accept'], action);
        proposalUpdateInput.finance_id = userId;
        if (action === 'accept') status = 'ACCEPTED_BY_FINANCE';
        // !TODO: if (action is edit) do something, still abmigous, need to discuss.
      }

      if (choosenRole === 'tender_project_supervisor') {
        if (proposal.supervisor_id !== userId) ownershipErrorThrow();
        actionValidator(['issue'], action);
        if (action === 'issue') status = 'ISSUED_BY_SUPERVISOR';
      }

      if (choosenRole === 'tender_cashier') {
        // if (proposal.cashier_id !== userId) ownershipErrorThrow();
        actionValidator(['upload_receipt'], action);
        if (!cheque) throw new BadRequestException('Cheque data is required!');
        proposalUpdateInput.cashier_id = userId;
        if (action === 'upload_receipt') status = 'DONE';
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

      const response = await this.tenderProposalPaymentRepository.updatePayment(
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

      this.sendUpdatePaymentNotif(response.updateNotif);

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
      let fileName = generateFileName(
        file.fullName,
        file.fileExtension as FileMimeTypeEnum,
      );

      let filePath = `tmra/${this.appEnv}/organization/tender-management/proposal/${proposalId}/${folderName}/${fileName}`;

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
        `${uploadMessage}`,
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

  sendInsertPaymentNotif(insertNotif: InsertPaymentNotifMapperResponse) {
    const {
      subject,
      clientContent,
      clientEmail,
      clientMobileNumber,
      supervisorContent,
      supervisorEmail,
      supervisorMobileNumber,
    } = insertNotif;

    const baseSendEmail: Omit<SendEmailDto, 'to'> = {
      mailType: 'plain',
      from: 'no-reply@hcharity.org',
    };

    const clientEmailNotif: SendEmailDto = {
      ...baseSendEmail,
      to: clientEmail,
      subject: subject,
      content: clientContent,
    };
    this.emailService.sendMail(clientEmailNotif);

    const clientPhone = isExistAndValidPhone(clientMobileNumber);
    if (clientPhone) {
      this.twilioService.sendSMS({
        to: clientPhone,
        body: subject + ', ' + clientContent,
      });
    }

    if (supervisorContent) {
      if (supervisorEmail && supervisorEmail !== '') {
        const supervisorEmailNotif: SendEmailDto = {
          ...baseSendEmail,
          to: supervisorEmail,
          subject: subject,
          content: supervisorContent,
        };
        this.emailService.sendMail(supervisorEmailNotif);
      }

      if (supervisorMobileNumber && supervisorMobileNumber !== '') {
        const supervisorPhone = isExistAndValidPhone(supervisorMobileNumber);
        if (supervisorPhone) {
          this.twilioService.sendSMS({
            to: supervisorPhone,
            body: subject + ', ' + supervisorContent,
          });
        }
      }
    }
  }

  sendUpdatePaymentNotif(insertNotif: UpdatePaymentNotifMapperResponse) {
    const {
      subject,
      clientContent,
      clientEmail,
      clientMobileNumber,
      reviewerContent,
      reviewerEmail,
      reviewerMobileNumber,
    } = insertNotif;

    const baseSendEmail: Omit<SendEmailDto, 'to'> = {
      mailType: 'plain',
      from: 'no-reply@hcharity.org',
    };

    const clientEmailNotif: SendEmailDto = {
      ...baseSendEmail,
      to: clientEmail,
      subject: subject,
      content: clientContent,
    };
    this.emailService.sendMail(clientEmailNotif);

    const clientPhone = isExistAndValidPhone(clientMobileNumber);
    if (clientPhone) {
      this.twilioService.sendSMS({
        to: clientPhone,
        body: subject + ', ' + clientContent,
      });
    }

    if (reviewerContent) {
      if (reviewerEmail && reviewerEmail !== '') {
        const reviewerEmailNotif: SendEmailDto = {
          ...baseSendEmail,
          to: reviewerEmail,
          subject: subject,
          content: reviewerContent,
        };
        this.emailService.sendMail(reviewerEmailNotif);
      }

      if (reviewerMobileNumber && reviewerMobileNumber !== '') {
        const reviewerPhone = isExistAndValidPhone(reviewerMobileNumber);
        if (reviewerPhone) {
          this.twilioService.sendSMS({
            to: reviewerPhone,
            body: subject + ', ' + reviewerContent,
          });
        }
      }
    }
  }
}
