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
  ProposalLogRepository,
} from '../../../proposal-log/repositories/proposal.log.repository';
import { ProposalRepository } from '../../../proposal/repositories/proposal.repository';
import { UpdateProposalProps } from '../../../proposal/types';
import { UpdatePaymentDto } from '../../dtos/requests';
import { ProposalPaymentRepository } from '../../repositories/proposal-payment.repository';
import {
  ChequeCreateProps,
  ProposalChequeRepository,
} from '../../repositories/proposal-cheque.repository';
import { nanoid } from 'nanoid';
import { appRoleMappers } from '../../../../tender-commons/types';
import { ProposalEntity } from '../../../proposal/entities/proposal.entity';
import { ProposalPaymentEntity } from '../../entities/proposal-payment.entity';
import { ChequeEntity } from '../../entities/cheque.entity';
import { FileManagerEntity } from '../../../../tender-file-manager/entities/file-manager.entity';
import { ProposalLogEntity } from '../../../proposal-log/entities/proposal-log.entity';
import { MsegatService } from '../../../../libs/msegat/services/msegat.service';
import { EmailService } from '../../../../libs/email/email.service';
import { isExistAndValidPhone } from '../../../../commons/utils/is-exist-and-valid-phone';
import { ROOT_LOGGER } from '../../../../libs/root-logger';
import {
  TenderNotificationRepository,
  CreateNotificaitonProps,
} from '../../../../notification-management/notification/repository/tender-notification.repository';
import { NotificationEntity } from 'src/notification-management/notification/entities/notification.entity';

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
    private readonly chequeRepo: ProposalChequeRepository,
    private readonly paymentRepo: ProposalPaymentRepository,
    private readonly proposalRepo: ProposalRepository,
    private readonly logRepo: ProposalLogRepository,
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

      let notifPayload = Builder<CreateNotificaitonProps>(
        CreateNotificaitonProps,
        {},
      ).build();

      if (choosenRole === 'tender_project_manager') {
        if (proposal.project_manager_id !== userId) {
          throw new ForbiddenPermissionException(
            `'You are not the person in charge for this proposal!'`,
          );
        }
        this.actionValidator(['accept', 'reject'], action);
        if (action === 'accept')
          createProposalLogPayloads.action =
            ProposalAction.ACCEPTED_BY_PROJECT_MANAGER;
        if (action === 'reject') {
          createProposalLogPayloads.action = ProposalAction.SET_BY_SUPERVISOR;
          if (!command.request.notes) {
            throw new PayloadErrorException(
              'Notes are required when rejecting payment',
            );
          }
        }
      }

      if (choosenRole === 'tender_finance') {
        this.actionValidator(
          ['accept', 'confirm_payment', 'reject_payment'],
          action,
        );
        updateProposalPayloads.finance_id = userId;
        if (action === 'accept')
          createProposalLogPayloads.action = ProposalAction.ACCEPTED_BY_FINANCE;
        if (action === 'confirm_payment')
          createProposalLogPayloads.action = ProposalAction.DONE;
        if (action === 'reject_payment') {
          createProposalLogPayloads.action = ProposalAction.ACCEPTED_BY_FINANCE;
          if (!command.request.last_payment_receipt_url) {
            throw new PayloadErrorException(
              'please send the last rejected file url',
            );
          }
          deletedFileManagerUrl.push(command.request.last_payment_receipt_url);
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
        if (action === 'issue')
          createProposalLogPayloads.action =
            ProposalAction.ISSUED_BY_SUPERVISOR;
      }

      if (choosenRole === 'tender_cashier') {
        // if (proposal.cashier_id !== userId) ownershipErrorThrow();
        this.actionValidator(['upload_receipt'], action);

        if (!cheque) {
          throw new PayloadErrorException('Cheque data is required!');
        }

        updateProposalPayloads.cashier_id = userId;

        if (action === 'upload_receipt') {
          notifPayload = {
            id: uuidv4(),
            user_id: proposal.user.id,
            content: `"مرحباً ${proposal.user.employee_name}، نود إخبارك أن المشروع '${proposal.project_name}' تم إرسال الدفعة.
            يرجى التحقق من حسابك الشخصي للحصول على مزيد من المعلومات ، أو انقر هنا."`,
            subject: 'إصدار دفع جديد',
            type: 'PROPOSAL',
            specific_type: 'PAYMENT_RELEASE',
          };
        }

        if (action === 'upload_receipt') {
          createProposalLogPayloads.action = ProposalAction.UPLOADED_BY_CASHIER;
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

      const result = await this.prismaService.$transaction(
        async (prismaSession) => {
          const session =
            prismaSession instanceof PrismaService
              ? prismaSession
              : this.prismaService;

          let createdCheque: ChequeEntity | null = null;
          let createdFileManager: FileManagerEntity[] | null = null;
          let createdWebNotif: NotificationEntity | null = null;

          // update the payment
          // this.logger.log('info', 'updating payment');
          const updatedPayment = await this.paymentRepo.update(
            {
              id: command.request.payment_id,
              status,
            },
            session,
          );

          // create the cheques and file manager
          if (
            createChequePayload.id &&
            createChequePayload.transfer_receipt !== undefined &&
            createChequePayload.transfer_receipt.url !== undefined &&
            fileManagerPayload.length > 0
          ) {
            // this.logger.log('info', `creating cheque`);
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
          // this.logger.log('info', `updating proposal`);
          const updatedProposal = await this.proposalRepo.update(
            updateProposalPayloads,
            session,
          );

          // create proposal logs
          // this.logger.log('info', `updating payment`);
          const createdLogs = await this.logRepo.create(
            createProposalLogPayloads,
            session,
          );

          // if there's a deleted file
          if (deletedFileManagerUrl.length > 0) {
            // this.logger.log('info', 'deleting file manager');
            for (const url of deletedFileManagerUrl) {
              await this.fileManagerRepo.delete({ url }, session);
            }
          }

          // create web notif
          if (Object.keys(notifPayload).length > 1) {
            createdWebNotif = await this.notifRepo.create(
              notifPayload,
              session,
            );
          }

          return {
            db_result: {
              updated_payment: updatedPayment,
              updated_proposal: updatedProposal,
              created_logs: createdLogs,
              created_web_notif: createdWebNotif,
              created_cheque: createdCheque,
              created_file_manager: createdFileManager,
            },
          };
        },
        {
          timeout: 20000, // transaction timeout
        },
      );

      // notification for payment release
      if (
        appRoleMappers[choosenRole] === 'CASHIER' &&
        action === 'upload_receipt' &&
        result.db_result.created_cheque !== null &&
        result.db_result.created_cheque.transfer_receipt &&
        result.db_result.created_cheque.transfer_receipt !== undefined &&
        result.db_result.created_cheque.transfer_receipt.url &&
        result.db_result.created_logs !== null
      ) {
        // email notif payment release
        this.emailService.sendMail({
          subject: 'إصدار دفع جديد', // "new payment release"
          mailType: 'template',
          templateContext: {
            projectName: proposal.project_name,
            clientName: proposal.user?.employee_name,
            paymentPageLink:
              result.db_result.created_cheque.transfer_receipt.url,
          },
          templatePath: 'tender/ar/proposal/new_upload_receipt',
          to: proposal.user.email,
        });

        // validate client phone
        this.logger.log(
          'info',
          `validating client phone ${proposal.user.mobile_number}`,
        );
        const clientPhone = isExistAndValidPhone(proposal.user.mobile_number);

        // sms notif for payment release
        if (clientPhone) {
          this.logger.log(
            'info',
            `valid phone number, trying to sending sms to ${clientPhone}`,
          );
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

      return result;
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
