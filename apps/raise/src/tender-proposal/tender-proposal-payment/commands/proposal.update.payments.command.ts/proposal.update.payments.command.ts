import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import { v4 as uuidv4 } from 'uuid';
import { FileMimeTypeEnum } from '../../../../commons/enums/file-mimetype.enum';
import { envLoadErrorHelper } from '../../../../commons/helpers/env-loaderror-helper';
import { validateFileExtension } from '../../../../commons/utils/validate-allowed-extension';
import { validateFileSize } from '../../../../commons/utils/validate-file-size';
import { BunnyService } from '../../../../libs/bunny/services/bunny.service';
import { PrismaService } from '../../../../prisma/prisma.service';
import { TenderFilePayload } from '../../../../tender-commons/dto/tender-file-payload.dto';
import { UploadFilesJsonbDto } from '../../../../tender-commons/dto/upload-files-jsonb.dto';
import { DataNotFoundException } from '../../../../tender-commons/exceptions/data-not-found.exception';
import { ForbiddenPermissionException } from '../../../../tender-commons/exceptions/forbidden-permission-exception';
import { PayloadErrorException } from '../../../../tender-commons/exceptions/payload-error.exception';
import { ProposalAction } from '../../../../tender-commons/types/proposal';
import { generateFileName } from '../../../../tender-commons/utils/generate-filename';
import {
  CreateFileManagerProps,
  TenderFileManagerRepository,
} from '../../../../tender-file-manager/repositories/tender-file-manager.repository';
import { TenderCurrentUser } from '../../../../tender-user/user/interfaces/current-user.interface';
import {
  CreateProposalLogProps,
  TenderProposalLogRepository,
} from '../../../tender-proposal-log/repositories/tender-proposal-log.repository';
import { TenderProposalRepository } from '../../../tender-proposal/repositories/tender-proposal.repository';
import { UpdateProposalProps } from '../../../tender-proposal/types';
import { UpdatePaymentDto } from '../../dtos/requests';
import { TenderProposalPaymentRepository } from '../../repositories/tender-proposal-payment.repository';
import {
  ChequeCreateProps,
  TenderProposalChequeRepository,
} from '../../repositories/tender-proposal-cheque.repository';
import { nanoid } from 'nanoid';
import { appRoleMappers } from '../../../../tender-commons/types';
import { ProposalEntity } from '../../../tender-proposal/entities/proposal.entity';
import { ProposalPaymentEntity } from '../../entities/proposal-payment.entity';
import { ChequeEntity } from '../../entities/cheque.entity';
import { FileManagerEntity } from '../../../../tender-file-manager/entities/file-manager.entity';
import { ProposalLogEntity } from '../../../tender-proposal-log/entities/proposal-log.entity';
import { MsegatService } from '../../../../libs/msegat/services/msegat.service';
import { EmailService } from '../../../../libs/email/email.service';
import {
  CreateNotificaitonProps,
  TenderNotificationRepository,
} from '../../../../tender-notification/repository/tender-notification.repository';
import { isExistAndValidPhone } from '../../../../commons/utils/is-exist-and-valid-phone';
import { ROOT_LOGGER } from '../../../../libs/root-logger';

export class ProposalUpdatePaymentCommand {
  currentUser: TenderCurrentUser;
  request: UpdatePaymentDto;
}

@CommandHandler(ProposalUpdatePaymentCommand)
export class ProposalUpdatePaymentCommandHandler
  implements ICommandHandler<ProposalUpdatePaymentCommand>
{
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': ProposalUpdatePaymentCommandHandler.name,
  });

  private readonly appEnv: string;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bunnyService: BunnyService,
    private readonly configService: ConfigService,
    private readonly msegatService: MsegatService,
    private readonly emailService: EmailService,
    private readonly chequeRepo: TenderProposalChequeRepository,
    private readonly paymentRepo: TenderProposalPaymentRepository,
    private readonly proposalRepo: TenderProposalRepository,
    private readonly logRepo: TenderProposalLogRepository,
    private readonly fileManagerRepo: TenderFileManagerRepository,
    private readonly notifRepo: TenderNotificationRepository,
  ) {
    const environment = this.configService.get('APP_ENV');
    if (!environment) envLoadErrorHelper('APP_ENV');
    this.appEnv = environment;
  }

  async uploadClientFile(
    file: TenderFilePayload,
    uploadPath: string,
    AllowedFileTypes: FileMimeTypeEnum[],
    maxSize: number = 1024 * 1024 * 10, // 10 mb by default
  ) {
    try {
      console.log(file.fullName);
      const fileName = generateFileName(
        file.fullName,
        file.fileExtension as FileMimeTypeEnum,
      );

      const fileBuffer = Buffer.from(
        file.base64Data.replace(/^data:.*;base64,/, ''),
        'base64',
      );

      validateFileExtension(
        file.fileExtension,
        AllowedFileTypes,
        file.fullName,
      );
      validateFileSize(file.size, maxSize, file.fullName);

      const imageUrl = await this.bunnyService.uploadBase64(
        fileName,
        fileBuffer,
        uploadPath + `/${fileName}`,
      );

      const fileObj: UploadFilesJsonbDto = {
        url: imageUrl,
        type: file.fileExtension,
        size: file.size,
      };

      return {
        name: fileName,
        ...fileObj,
      };
    } catch (error) {
      throw error;
    }
  }

  async actionValidator(allowedAction: string[], currentAction: string) {
    try {
      if (allowedAction.indexOf(currentAction) === -1) {
        throw new ForbiddenPermissionException(
          `You were not allowed to use '${currentAction}' action`,
        );
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  async execute(command: ProposalUpdatePaymentCommand): Promise<any> {
    let fileManagerPayload: CreateFileManagerProps[] = [];
    let deletedFileManagerUrl: string[] = [];
    try {
      const { id: userId, choosenRole } = command.currentUser;
      const { payment_id, action, cheque } = command.request;

      const payment = await this.paymentRepo.findById(payment_id);
      if (!payment) throw new DataNotFoundException('Payment not found');

      const proposal = await this.proposalRepo.fetchById({
        id: payment.proposal_id,
        includes_relation: ['user'],
      });
      if (!proposal) {
        throw new DataNotFoundException(
          'No proposal data found on this payment',
        );
      }
      if (!proposal.user) {
        throw new DataNotFoundException(
          'Failed to fetch user that submitted this proposal!',
        );
      }

      const lastLog = await this.logRepo.findMany({
        proposal_id: proposal.id,
        page: 1,
        limit: 1,
        sort_by: 'created_at',
        sort_direction: 'desc',
      });

      let status:
        | ProposalAction.SET_BY_SUPERVISOR
        | ProposalAction.ISSUED_BY_SUPERVISOR
        | ProposalAction.ACCEPTED_BY_PROJECT_MANAGER
        | ProposalAction.ACCEPTED_BY_FINANCE
        | ProposalAction.UPLOADED_BY_CASHIER
        | ProposalAction.DONE
        | null = null;

      const updateProposalPayloads: UpdateProposalProps =
        Builder<UpdateProposalProps>(UpdateProposalProps, {
          id: proposal.id,
        }).build();

      const createProposalLogPayloads: CreateProposalLogProps =
        Builder<CreateProposalLogProps>(CreateProposalLogProps, {
          id: nanoid(),
          action: status,
          reviewer_id: command.currentUser.id,
          state: appRoleMappers[choosenRole],
          user_role: appRoleMappers[choosenRole],
          message: `batch_${payment.order}`,
          proposal_id: proposal.id,
          response_time: lastLog
            ? Math.round(
                (new Date().getTime() - lastLog[0].created_at.getTime()) /
                  60000,
              )
            : null,
          notes:
            appRoleMappers[choosenRole] === 'PROJECT_MANAGER' && // if it pm
            status === ProposalAction.SET_BY_SUPERVISOR && // if it rejected
            command.request.notes // if notes exist
              ? command.request.notes
              : '',
        }).build();

      const createChequePayload = Builder<ChequeCreateProps>(
        ChequeCreateProps,
        {
          id: nanoid(),
        },
      ).build();

      const notifPayload: CreateNotificaitonProps[] = [];

      if (choosenRole === 'tender_project_manager') {
        if (proposal.project_manager_id !== userId) {
          throw new ForbiddenPermissionException(
            `'You are not the person in charge for this proposal!'`,
          );
        }
        this.actionValidator(['accept', 'reject'], action);
        if (action === 'accept')
          status = ProposalAction.ACCEPTED_BY_PROJECT_MANAGER;
        if (action === 'reject') {
          status = ProposalAction.SET_BY_SUPERVISOR;
          if (!command.request.notes) {
            throw new PayloadErrorException(
              'Notes are required when rejecting payment',
            );
          }
          if (!command.request.last_payment_receipt_url) {
            throw new PayloadErrorException(
              'please send the last rejected file url',
            );
          }
          deletedFileManagerUrl.push(command.request.last_payment_receipt_url);
        }
      }

      if (choosenRole === 'tender_finance') {
        this.actionValidator(
          ['accept', 'confirm_payment', 'reject_payment'],
          action,
        );
        updateProposalPayloads.finance_id = userId;
        if (action === 'accept') status = ProposalAction.ACCEPTED_BY_FINANCE;
        if (action === 'confirm_payment') status = ProposalAction.DONE;
        if (action === 'reject_payment') {
          status = ProposalAction.ACCEPTED_BY_FINANCE;
        }
        // !TODO: if (action is edit) do something, still abmigous, need to discuss.
      }

      if (choosenRole === 'tender_project_supervisor') {
        if (proposal.supervisor_id !== userId) {
          throw new ForbiddenPermissionException(
            `'You are not the person in charge for this proposal!'`,
          );
        }
        this.actionValidator(['issue'], action);
        if (action === 'issue') status = ProposalAction.ISSUED_BY_SUPERVISOR;
      }

      if (choosenRole === 'tender_cashier') {
        // if (proposal.cashier_id !== userId) ownershipErrorThrow();
        this.actionValidator(['upload_receipt'], action);

        if (!cheque) {
          throw new PayloadErrorException('Cheque data is required!');
        }

        updateProposalPayloads.cashier_id = userId;

        if (action === 'upload_receipt') {
          notifPayload.push({
            id: uuidv4(),
            user_id: proposal.user.id,
            content: `"مرحباً ${proposal.user.employee_name}، نود إخبارك أن المشروع '${proposal.project_name}' تم إرسال الدفعة.
            يرجى التحقق من حسابك الشخصي للحصول على مزيد من المعلومات ، أو انقر هنا."`,
            subject: 'إصدار دفع جديد',
            type: 'PROPOSAL',
            specific_type: 'PAYMENT_RELEASE',
          });
        }

        if (action === 'upload_receipt') {
          status = ProposalAction.UPLOADED_BY_CASHIER;
        }

        const maxSize: number = 1024 * 1024 * 100; // 100MB

        const uploadRes = await this.uploadClientFile(
          command.request.cheque.transfer_receipt,
          `tmra/${this.appEnv}/organization/tender-management/proposal/${proposal.id}/cheque`,
          [
            FileMimeTypeEnum.JPG,
            FileMimeTypeEnum.JPEG,
            FileMimeTypeEnum.PNG,
            FileMimeTypeEnum.PDF,
          ],
          maxSize,
        );

        fileManagerPayload.push({
          id: uuidv4(),
          user_id: command.currentUser.id,
          name: uploadRes.name,
          mimetype: uploadRes.type,
          size: uploadRes.size,
          url: uploadRes.url,
          column_name: 'license_file',
          table_name: 'client_data',
        });

        createChequePayload.deposit_date = command.request.cheque.deposit_date;
        createChequePayload.number = command.request.cheque.number;
        createChequePayload.payment_id = command.request.payment_id;
        createChequePayload.transfer_receipt = {
          url: uploadRes.url,
          size: uploadRes.size,
          type: uploadRes.type,
        };
      }

      let updatedProposal: ProposalEntity | null = null;
      let updatedPayment: ProposalPaymentEntity | null = null;
      let createdCheque: ChequeEntity | null = null;
      let createdFileManager: FileManagerEntity[] | null = null;
      let createdLogs: ProposalLogEntity | null = null;

      await this.prismaService.$transaction(
        async (prismaSession) => {
          const session =
            prismaSession instanceof PrismaService
              ? prismaSession
              : this.prismaService;

          // update the payment
          updatedPayment = await this.paymentRepo.update(
            {
              id: command.request.payment_id,
              status,
            },
            session,
          );

          // create the cheques and file manager
          if (
            createChequePayload.id &&
            createChequePayload.transfer_receipt.url &&
            fileManagerPayload.length > 0
          ) {
            createdCheque = await this.chequeRepo.create(
              {
                id: createChequePayload.id,
                payment_id: createChequePayload.payment_id,
                deposit_date: createChequePayload.deposit_date,
                number: createChequePayload.number,
                transfer_receipt: createChequePayload.transfer_receipt,
              },
              session,
            );

            for (const file of fileManagerPayload) {
              const createdFile = await this.fileManagerRepo.create(
                file,
                session,
              );
              if (createdFileManager === null) {
                createdFileManager = [createdFile];
              } else {
                createdFileManager.push(createdFile);
              }
            }
          }

          // update proposal
          updatedProposal = await this.proposalRepo.update(
            updateProposalPayloads,
            session,
          );

          // create proposal logs
          createdLogs = await this.logRepo.create(
            createProposalLogPayloads,
            session,
          );

          // if there's a deleted file
          if (deletedFileManagerUrl.length > 0) {
            for (const url of deletedFileManagerUrl) {
              await this.fileManagerRepo.delete({ url }, session);
            }
          }

          // create web notif
          if (notifPayload.length > 0) {
            for (const notif of notifPayload) {
              await this.notifRepo.create(notif, session);
            }
          }
        },
        {
          timeout: 20000, // transaction timeout
        },
      );

      // notification for payment release
      if (
        appRoleMappers[choosenRole] === 'CASHIER' &&
        action === 'upload_receipt' &&
        createdCheque !== null &&
        createdLogs !== null
      ) {
        const chequeNotif = createdCheque as ChequeEntity;
        let chequeLink: string = '';

        if (
          chequeNotif.transfer_receipt !== undefined &&
          cheque.transfer_receipt
        ) {
          const tmp: any = cheque.transfer_receipt;
          if (tmp['url'] !== undefined) chequeLink = tmp['url'];
        }

        // email notif payment release
        this.emailService.sendMail({
          subject: 'إصدار دفع جديد', // "new payment release"
          mailType: 'template',
          templateContext: {
            projectName: proposal.project_name,
            clientName: proposal.user?.employee_name,
            paymentPageLink: chequeLink,
          },
          templatePath: 'tender/ar/proposal/new_upload_receipt',
          to: proposal.user.email,
        });

        // validate client phone
        const clientPhone = isExistAndValidPhone(proposal.user.mobile_number);

        // sms notif for payment release
        if (clientPhone) {
          await this.msegatService.sendSMSAsync({
            numbers: clientPhone.includes('+')
              ? clientPhone.substring(1)
              : clientPhone,
            msg:
              'إصدار دفع جديد' +
              ',' +
              `مرحباً ${proposal.user.employee_name}، نود إخبارك أن المشروع '${proposal.project_name}' تم إرسال الدفعة.
            يرجى التحقق من حسابك الشخصي للحصول على مزيد من المعلومات ، أو انقر هنا.`,
          });
        }
      }

      return {
        updatedProposal,
        updatedPayment,
        createdCheque,
        createdFileManager,
        createdLogs,
      };
    } catch (error) {
      if (fileManagerPayload.length > 0) {
        for (const file of fileManagerPayload) {
          await this.bunnyService.deleteMedia(file.url, true);
        }
      }
      throw error;
    }
  }
}