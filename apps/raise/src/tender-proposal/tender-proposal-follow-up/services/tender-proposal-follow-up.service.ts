import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, proposal_follow_up } from '@prisma/client';
import { FileMimeTypeEnum } from '../../../commons/enums/file-mimetype.enum';
import { envLoadErrorHelper } from '../../../commons/helpers/env-loaderror-helper';
import { isExistAndValidPhone } from '../../../commons/utils/is-exist-and-valid-phone';
import { validateAllowedExtension } from '../../../commons/utils/validate-allowed-extension';
import { validateFileSize } from '../../../commons/utils/validate-file-size';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import { SendEmailDto } from '../../../libs/email/dtos/requests/send-email.dto';
import { EmailService } from '../../../libs/email/email.service';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { TwilioService } from '../../../libs/twilio/services/twilio.service';
import { UploadFilesJsonbDto } from '../../../tender-commons/dto/upload-files-jsonb.dto';
import { isUploadFileJsonb } from '../../../tender-commons/utils/is-upload-file-jsonb';
import { CreateNewFileHistoryMapper } from '../../../tender-file-manager/mappers/create-new-file-history';
import { TenderFileManagerService } from '../../../tender-file-manager/services/tender-file-manager.service';
import { CreateNotificationDto } from '../../../tender-notification/dtos/requests/create-notification.dto';
import { TenderNotificationService } from '../../../tender-notification/services/tender-notification.service';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { TenderProposalRepository } from '../../tender-proposal/repositories/tender-proposal.repository';
import { CreateProposalFollowUpDto } from '../dtos/requests/create-follow-up.dto';
import { RawCreateFollowUpDto } from '../dtos/responses/raw-create-follow-up.dto';
import { CreateFollowUpMapper } from '../mappers/create-follow-up.mapper';
import { TenderProposalFollowUpRepository } from '../repositories/tender-proposal-follow-up.repository';
import { v4 as uuidv4 } from 'uuid';
import { generateFileName } from '../../../tender-commons/utils/generate-filename';
import { DeleteProposalFollowUpDto } from '../dtos/requests/delete-follow-up.dto';
import { GenerateFollowUpMessageNotif } from '../utils/generate-follow-up-message-notif';
import { prismaErrorThrower } from '../../../tender-commons/utils/prisma-error-thrower';

@Injectable()
export class TenderProposalFollowUpService {
  private readonly appEnv: string;
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderProposalFollowUpService.name,
  });
  constructor(
    private readonly bunnyService: BunnyService,
    private readonly configService: ConfigService,
    private readonly twilioService: TwilioService,
    private readonly emailService: EmailService,
    private readonly notifService: TenderNotificationService,
    private readonly tenderFileManagerService: TenderFileManagerService,
    private readonly tenderProposalRepository: TenderProposalRepository,
    private readonly followUpRepo: TenderProposalFollowUpRepository,
  ) {
    const environment = this.configService.get('APP_ENV');
    if (!environment) envLoadErrorHelper('APP_ENV');
    this.appEnv = environment;
  }

  async create(
    currentUser: TenderCurrentUser,
    payload: CreateProposalFollowUpDto,
  ) {
    const uploadedFilePath: string[] = [];
    let tenderFileFollowUpObj: UploadFilesJsonbDto[] = [];

    try {
      const proposal = await this.tenderProposalRepository.fetchProposalById(
        payload.proposal_id,
      );
      if (!proposal) throw new BadRequestException('Proposal Not Found!');

      const {
        proposal_id,
        follow_up_type,
        content,
        follow_up_attachment,
        employee_only,
      } = payload;

      if (follow_up_type === 'plain' && !content) {
        throw new BadRequestException(
          'Content is Required when type is plain!',
        );
      }

      if (follow_up_type === 'attachments' && !follow_up_attachment) {
        throw new BadRequestException(
          'Attachments is required when the type is attachment!',
        );
      }

      if (!!content && !!follow_up_attachment) {
        throw new BadRequestException(
          'You can only send either attachment or message!',
        );
      }

      const createFollowUpPayload = CreateFollowUpMapper(currentUser, payload);
      const maxSize = 1024 * 1024 * 5;
      if (follow_up_attachment && follow_up_attachment.length > 0) {
        for (let i = 0; i < follow_up_attachment.length; i++) {
          /* project attachment */
          const followUpFileName = generateFileName(
            follow_up_attachment[i].fullName,
            follow_up_attachment[i].fileExtension as FileMimeTypeEnum,
          );

          const followUpFilePath = `tmra/${this.appEnv}/organization/tender-management/proposal/${proposal_id}/follow-ups/${currentUser.id}/${followUpFileName}`;

          const followUpFileBuffer = Buffer.from(
            follow_up_attachment[i].base64Data.replace(/^data:.*;base64,/, ''),
            'base64',
          );

          validateAllowedExtension(follow_up_attachment[i].fileExtension, [
            FileMimeTypeEnum.PDF,
            FileMimeTypeEnum.DOC,
            FileMimeTypeEnum.DOCX,
            FileMimeTypeEnum.PPT,
            FileMimeTypeEnum.PPTX,
            FileMimeTypeEnum.JPEG,
            FileMimeTypeEnum.JPG,
            FileMimeTypeEnum.PNG,
            FileMimeTypeEnum.XLS,
            FileMimeTypeEnum.XLSX,
          ]);
          validateFileSize(follow_up_attachment[i].size, maxSize);

          const imageUrl = await this.bunnyService.uploadFileBase64(
            follow_up_attachment[i].fullName,
            followUpFileBuffer,
            followUpFilePath,
            `Uploading Proposal Follow Up from user ${currentUser.id}`,
          );

          uploadedFilePath.push(imageUrl);
          const newFileFollowUpObj = [
            {
              url: imageUrl,
              type: follow_up_attachment[i].fileExtension,
              size: follow_up_attachment[i].size,
            },
          ];

          tenderFileFollowUpObj = [
            ...tenderFileFollowUpObj,
            ...newFileFollowUpObj,
          ];
        }
      }

      createFollowUpPayload.attachments = tenderFileFollowUpObj as any;

      const fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[] =
        [];

      if (createFollowUpPayload.attachments instanceof Array) {
        const tmp = createFollowUpPayload.attachments as any[];
        if (tmp.length > 0) {
          for (let i = 0; i < tmp.length; i++) {
            if (isUploadFileJsonb(tmp[i])) {
              const tmpFileJsonb: UploadFilesJsonbDto = tmp[i];
              const isExist = await this.tenderFileManagerService.findByUrl(
                tmpFileJsonb.url,
              );

              if (!isExist) {
                const payload: Prisma.file_managerUncheckedCreateInput = {
                  id: uuidv4(),
                  user_id: currentUser.id,
                  url: tmpFileJsonb.url,
                  mimetype: tmpFileJsonb.type,
                  size: tmpFileJsonb.size,
                  column_name: 'attachments',
                  table_name: 'proposal_follow_up',
                  name: tmpFileJsonb.url.split('/').pop() as string,
                };
                fileManagerCreateManyPayload.push(payload);
              }
            }
          }
        } else {
          delete createFollowUpPayload.attachments;
        }
      }

      const createdFolllowUp = await this.followUpRepo.create(
        createFollowUpPayload,
        fileManagerCreateManyPayload,
        employee_only,
        payload.selectLang,
      );

      this.notifService.sendSmsAndEmailBatch(createdFolllowUp.followupNotif);

      // await this.sendFollowUpNotif(
      //   createdFolllowUp,
      //   employee_only,
      //   payload.selectLang,
      // );

      return createdFolllowUp.followUps;
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

  async delete(payload: DeleteProposalFollowUpDto): Promise<number> {
    try {
      const { id } = payload;
      const attachmentIds: string[] = [];
      const followupIds: string[] = [];

      if (id.length > 0) {
        for (let i = 0; i < id.length; i++) {
          const followUp = await this.followUpRepo.fetchProposalById(id[i]);
          if (!followUp) {
            throw new NotFoundException(
              `Follow Up with id of ${id[i]} not found!`,
            );
          }

          followupIds.push(followUp.id);
          if (followUp.attachments) {
            if (followUp.attachments instanceof Array) {
              const tmp = followUp.attachments as any[];
              for (let i = 0; i < tmp.length; i++) {
                if (isUploadFileJsonb(tmp[i])) {
                  const tmpFileJsonb: UploadFilesJsonbDto = tmp[i];
                  const isExist = await this.tenderFileManagerService.findByUrl(
                    tmpFileJsonb.url,
                  );
                  if (isExist) {
                    attachmentIds.push(isExist.id);
                  }
                }
              }
            }
          }
        }
      }

      const deletedCount = await this.followUpRepo.deleteFollowUps(
        followupIds,
        attachmentIds,
      );
      return deletedCount;
    } catch (err) {
      throw err;
    }
  }

  // async sendFollowUpNotif(
  //   createdFolllowUp: RawCreateFollowUpDto['data'],
  //   employee_only: boolean,
  //   selected_lang?: 'ar' | 'en',
  // ) {
  //   const { subject, content, proposal, user } =
  //     GenerateFollowUpMessageNotif(createdFolllowUp);

  //   const baseTemplateContext = {
  //     projectName: proposal.project_name,
  //     followUpSender: user.employee_name,
  //   };

  //   const baseSendEmail: Omit<SendEmailDto, 'to'> = {
  //     mailType: 'template',
  //     from: 'no-reply@hcharity.org',
  //     subject,
  //     templatePath: `tender/${selected_lang || 'ar'}/proposal/project_followup`,
  //   };

  //   const baseWebNotif: Omit<CreateNotificationDto, 'user_id'> = {
  //     type: 'PROPOSAL',
  //     subject,
  //     content,
  //     proposal_id: proposal.id,
  //   };

  //   const baseSendSms = {
  //     body: subject + ',' + content,
  //   };

  //   /* the client on this proposal ------------------------------------------------------------------------------------------------ */
  //   if (employee_only === false) {
  //     const clientEmailNotif: SendEmailDto = {
  //       ...baseSendEmail,
  //       to: proposal.user.email,
  //       templateContext: {
  //         ...baseTemplateContext,
  //         receiverName: proposal.user.employee_name,
  //       },
  //     };
  //     this.emailService.sendMail(clientEmailNotif);

  //     const clientWebNotifPayload: CreateNotificationDto = {
  //       ...baseWebNotif,
  //       user_id: proposal.submitter_user_id,
  //     };
  //     await this.notifService.create(clientWebNotifPayload);

  //     const clientPhone = isExistAndValidPhone(proposal.user.mobile_number);
  //     if (clientPhone) {
  //       this.twilioService.sendSMS({
  //         ...baseSendSms,
  //         to: clientPhone,
  //       });
  //     }
  //   }
  //   /* ----------------------------------------------------------------------------------------------------------------------------------- */

  //   /* if theres project_manager on this proposal (proposal.project_manager_id is exist) ------------------------------------------------- */
  //   if (proposal.project_manager) {
  //     const projectManagerEmailNotif: SendEmailDto = {
  //       ...baseSendEmail,
  //       to: proposal.project_manager.email,
  //       templateContext: {
  //         ...baseTemplateContext,
  //         receiverName: proposal.project_manager.employee_name,
  //       },
  //     };
  //     this.emailService.sendMail(projectManagerEmailNotif);

  //     const projectManagerWebNotif: CreateNotificationDto = {
  //       ...baseWebNotif,
  //       user_id: proposal.project_manager.id,
  //     };
  //     await this.notifService.create(projectManagerWebNotif);

  //     const pmPhone = isExistAndValidPhone(
  //       proposal.project_manager.mobile_number,
  //     );
  //     if (pmPhone) {
  //       this.twilioService.sendSMS({
  //         ...baseSendSms,
  //         to: pmPhone,
  //       });
  //     }
  //   }
  //   /* ----------------------------------------------------------------------------------------------------------------------------------- */

  //   /* if theres supervisor on this proposal (proposal.project_supervisor_id is exist) */
  //   if (proposal.supervisor) {
  //     const supervisorEmailNotif: SendEmailDto = {
  //       ...baseSendEmail,
  //       to: proposal.supervisor.email,
  //       templateContext: {
  //         ...baseTemplateContext,
  //         receiverName: proposal.supervisor.employee_name,
  //       },
  //     };
  //     this.emailService.sendMail(supervisorEmailNotif);

  //     const supervisorWebNotif: CreateNotificationDto = {
  //       ...baseWebNotif,
  //       user_id: proposal.supervisor.id,
  //     };
  //     await this.notifService.create(supervisorWebNotif);

  //     const supervisorPhone = isExistAndValidPhone(
  //       proposal.supervisor.mobile_number,
  //     );
  //     if (supervisorPhone) {
  //       this.twilioService.sendSMS({
  //         ...baseSendSms,
  //         to: supervisorPhone,
  //       });
  //     }
  //   }
  // }
}
