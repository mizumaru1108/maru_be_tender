import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllowedFileType } from '../../../commons/enums/allowed-filetype.enum';
import { envLoadErrorHelper } from '../../../commons/helpers/env-loaderror-helper';
import { validateAllowedExtension } from '../../../commons/utils/validate-allowed-extension';
import { validateFileSize } from '../../../commons/utils/validate-file-size';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import { SendEmailDto } from '../../../libs/email/dtos/requests/send-email.dto';
import { EmailService } from '../../../libs/email/email.service';
import { ROOT_LOGGER } from '../../../libs/root-logger';
import { TwilioService } from '../../../libs/twilio/services/twilio.service';
import { UploadFilesJsonbDto } from '../../../tender-commons/dto/upload-files-jsonb.dto';
import { CreateNotificationDto } from '../../../tender-notification/dtos/requests/create-notification.dto';
import { TenderNotificationService } from '../../../tender-notification/services/tender-notification.service';
import { TenderCurrentUser } from '../../../tender-user/user/interfaces/current-user.interface';
import { TenderProposalRepository } from '../../tender-proposal/repositories/tender-proposal.repository';
import { CreateProposalFollowUpDto } from '../dtos/requests/create-follow-up.dto';
import { RawCreateFollowUpDto } from '../dtos/responses/raw-create-follow-up.dto';
import { CreateFollowUpMapper } from '../mappers/create-follow-up.mapper';
import { TenderProposalFollowUpRepository } from '../repositories/tender-proposal-follow-up.repository';

@Injectable()
export class TenderProposalFollowUpService {
  private readonly appEnv: string;
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': TenderProposalFollowUpService.name,
  });
  constructor(
    private readonly followUpRepository: TenderProposalFollowUpRepository,
    private readonly bunnyService: BunnyService,
    private readonly configService: ConfigService,
    private readonly twilioService: TwilioService,
    private readonly emailService: EmailService,
    private readonly notificationService: TenderNotificationService,
    private readonly tenderProposalRepository: TenderProposalRepository,
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

      const { proposal_id, follow_up_type, content, follow_up_attachment } =
        payload;

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
          let followUpFileName =
            follow_up_attachment[i].fullName
              .replace(/[^a-zA-Z0-9]/g, '')
              .slice(0, 10) +
            new Date().getTime() +
            '.' +
            follow_up_attachment[i].fileExtension.split('/')[1];

          let followUpFilePath = `tmra/${this.appEnv}/organization/tender-management/follow-ups/${proposal_id}/${currentUser.id}/${followUpFileName}`;

          let followUpFileBuffer = Buffer.from(
            follow_up_attachment[i].base64Data.replace(/^data:.*;base64,/, ''),
            'base64',
          );

          validateAllowedExtension(follow_up_attachment[i].fileExtension, [
            AllowedFileType.PDF,
            AllowedFileType.DOC,
            AllowedFileType.DOCX,
            AllowedFileType.PPT,
            AllowedFileType.PPTX,
            AllowedFileType.JPEG,
            AllowedFileType.JPG,
            AllowedFileType.PNG,
            AllowedFileType.XLS,
            AllowedFileType.XLSX,
          ]);
          validateFileSize(follow_up_attachment[i].size, maxSize);

          const imageUrl = await this.bunnyService.uploadFileBase64(
            follow_up_attachment[i].fullName,
            followUpFileBuffer,
            followUpFilePath,
            `Uploading Proposal Follow Up from user ${currentUser.id}`,
          );

          uploadedFilePath.push(imageUrl);
          let newFileFollowUpObj = [
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

      const createdFolllowUp = await this.followUpRepository.create(
        createFollowUpPayload,
      );

      await this.sendChangeStateNotification(createdFolllowUp);

      return createdFolllowUp;
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

  async sendChangeStateNotification(
    createdFolllowUp: RawCreateFollowUpDto['data'],
  ) {
    const { proposal, user } = createdFolllowUp;
    let subject = `Proposal Follow Up Notification`;
    let content = `There's a New Follow Up on Project ${proposal.project_name} from ${user.employee_name}`;

    const baseTemplateContext = {
      projectName: proposal.project_name,
      followUpSender: user.employee_name,
    };

    const baseSendEmail: Omit<SendEmailDto, 'to'> = {
      mailType: 'template',
      from: 'no-reply@hcharity.org',
      subject,
      templatePath: 'tender/ar/proposal/project_information',
    };

    const baseWebNotif: Omit<CreateNotificationDto, 'user_id'> = {
      type: 'PROPOSAL',
      subject,
      content,
      proposal_id: proposal.id,
    };

    const baseSendSms = {
      body: subject + ',' + content,
    };

    /* the client on this proposal ------------------------------------------------------------------------------------------------ */
    const clientEmailNotif: SendEmailDto = {
      ...baseSendEmail,
      to: proposal.user.email,
      templateContext: {
        ...baseTemplateContext,
        receiverName: proposal.user.employee_name,
      },
    };
    this.emailService.sendMail(clientEmailNotif);

    const clientWebNotifPayload: CreateNotificationDto = {
      ...baseWebNotif,
      user_id: proposal.submitter_user_id,
    };
    await this.notificationService.create(clientWebNotifPayload);

    if (proposal.user.mobile_number && proposal.user.mobile_number !== '') {
      this.twilioService.sendSMS({
        ...baseSendSms,
        to: proposal.user.mobile_number,
      });
    }
    /* ----------------------------------------------------------------------------------------------------------------------------------- */

    /* if theres project_manager on this proposal (proposal.project_manager_id is exist) ------------------------------------------------- */
    if (proposal.project_manager) {
      const projectManagerEmailNotif: SendEmailDto = {
        ...baseSendEmail,
        to: proposal.project_manager.email,
        templateContext: {
          ...baseTemplateContext,
          receiverName: proposal.project_manager.employee_name,
        },
      };
      this.emailService.sendMail(projectManagerEmailNotif);

      const projectManagerWebNotif: CreateNotificationDto = {
        ...baseWebNotif,
        user_id: proposal.project_manager.id,
      };
      await this.notificationService.create(projectManagerWebNotif);

      if (
        proposal.project_manager.mobile_number &&
        proposal.project_manager.mobile_number !== ''
      ) {
        this.twilioService.sendSMS({
          ...baseSendSms,
          to: proposal.project_manager.mobile_number,
        });
      }
    }
    /* ----------------------------------------------------------------------------------------------------------------------------------- */

    /* if theres supervisor on this proposal (proposal.project_supervisor_id is exist) */
    if (proposal.supervisor) {
      const supervisorEmailNotif: SendEmailDto = {
        ...baseSendEmail,
        to: proposal.supervisor.email,
        templateContext: {
          ...baseTemplateContext,
          receiverName: proposal.supervisor.employee_name,
        },
      };
      this.emailService.sendMail(supervisorEmailNotif);

      const supervisorWebNotif: CreateNotificationDto = {
        ...baseWebNotif,
        user_id: proposal.supervisor.id,
      };
      await this.notificationService.create(supervisorWebNotif);

      if (
        proposal.supervisor.mobile_number &&
        proposal.supervisor.mobile_number !== ''
      ) {
        this.twilioService.sendSMS({
          ...baseSendSms,
          to: proposal.supervisor.mobile_number,
        });
      }
    }
  }
}
