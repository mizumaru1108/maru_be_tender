import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { FileMimeTypeEnum } from 'src/commons/enums/file-mimetype.enum';
import { envLoadErrorHelper } from 'src/commons/helpers/env-loaderror-helper';
import { isExistAndValidPhone } from 'src/commons/utils/is-exist-and-valid-phone';
import { validateFileExtension } from 'src/commons/utils/validate-allowed-extension';
import { validateFileSize } from 'src/commons/utils/validate-file-size';
import { BunnyService } from 'src/libs/bunny/services/bunny.service';
import { EmailService } from 'src/libs/email/email.service';
import { MsegatService } from 'src/libs/msegat/services/msegat.service';
import { NotificationEntity } from 'src/notification-management/notification/entities/notification.entity';
import { TenderNotificationRepository } from 'src/notification-management/notification/repository/tender-notification.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProposalFollowUpDto } from 'src/proposal-management/follow-up/dtos/requests/create-follow-up.dto';
import { ProposalFollowUpEntity } from 'src/proposal-management/follow-up/entities/proposal.follow.up.entity';
import {
  ProposalFollowUpCreateProps,
  ProposalFollowUpRepository,
} from 'src/proposal-management/follow-up/repositories/proposal.follow.up.repository';
import { ISendNotificaitonEvent } from 'src/proposal-management/proposal/entities/proposal.entity';
import { ProposalRepository } from 'src/proposal-management/proposal/repositories/proposal.repository';
import { TenderFilePayload } from 'src/tender-commons/dto/tender-file-payload.dto';
import { UploadFilesJsonbDto } from 'src/tender-commons/dto/upload-files-jsonb.dto';
import { DataNotFoundException } from 'src/tender-commons/exceptions/data-not-found.exception';
import { PayloadErrorException } from 'src/tender-commons/exceptions/payload-error.exception';
import { RequestErrorException } from 'src/tender-commons/exceptions/request-error.exception';
import { generateFileName } from 'src/tender-commons/utils/generate-filename';
import {
  CreateFileManagerProps,
  TenderFileManagerRepository,
} from 'src/tender-file-manager/repositories/tender-file-manager.repository';
import { TenderCurrentUser } from 'src/tender-user/user/interfaces/current-user.interface';
import { v4 as uuidv4 } from 'uuid';
export class ProposalFollowUpCreateCommand {
  user: TenderCurrentUser;
  request: CreateProposalFollowUpDto;
}

export class ProposalFollowUpCreateCommandResult {
  created_follow_up: ProposalFollowUpEntity;
  created_web_notif: NotificationEntity;
}

@CommandHandler(ProposalFollowUpCreateCommand)
export class ProposalFollowUpCreateCommandHandler
  implements
    ICommandHandler<
      ProposalFollowUpCreateCommand,
      ProposalFollowUpCreateCommandResult
    >
{
  private readonly appEnv: string;
  constructor(
    private readonly proposalRepo: ProposalRepository,
    private readonly bunnyService: BunnyService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly msegatService: MsegatService,
    private readonly fileManagerRepo: TenderFileManagerRepository,
    private readonly followUpRepo: ProposalFollowUpRepository,
    private readonly notifRepo: TenderNotificationRepository,
    private readonly prismaService: PrismaService, // private readonly eventPublisher: EventPublisher,
  ) {
    const environment = this.configService.get('APP_ENV');
    if (!environment) envLoadErrorHelper('APP_ENV');
    this.appEnv = environment;
  }

  async uploadFile(
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

      const imageUrl = await this.bunnyService.uploadBufferToBunny(
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

  async execute(
    command: ProposalFollowUpCreateCommand,
  ): Promise<ProposalFollowUpCreateCommandResult> {
    const { user, request } = command;

    let fileManagerPayload: CreateFileManagerProps[] = [];

    if (
      user.choosenRole === 'tender_client' &&
      request.employee_only === true
    ) {
      throw new PayloadErrorException(
        'Client can only do follow up on client only section',
      );
    }

    try {
      const proposal = await this.proposalRepo.fetchById({
        id: request.proposal_id,
        includes_relation: ['user'],
      });
      if (proposal === null) {
        throw new DataNotFoundException('Proposal Not Found!');
      }
      if (proposal.user === undefined) {
        throw new DataNotFoundException(
          'Submitter user on proposal not Found!',
        );
      }

      const { follow_up_type, content, follow_up_attachment, employee_only } =
        request;

      if (follow_up_type === 'plain' && !content) {
        throw new PayloadErrorException(
          'Content is Required when type is plain!',
        );
      }

      if (follow_up_type === 'attachments' && !follow_up_attachment) {
        throw new PayloadErrorException(
          'Attachments is required when the type is attachment!',
        );
      }

      if (!!content && !!follow_up_attachment) {
        throw new PayloadErrorException(
          'You can only send either attachment or message!',
        );
      }

      // const createFollowUpPayload = CreateFollowUpMapper(user);
      const createFollowUpPayload = Builder<ProposalFollowUpCreateProps>(
        ProposalFollowUpCreateProps,
        {
          id: nanoid(),
          employee_only,
          content,
          submitter_role: user.choosenRole,
          proposal_id: proposal.id,
          user_id: user.id,
        },
      ).build();

      if (follow_up_attachment && follow_up_attachment.length > 0) {
        for (const attachment of follow_up_attachment) {
          const uploadRes = await this.uploadFile(
            attachment,
            `tmra/${this.appEnv}/organization/tender-management/proposal/${proposal.id}/follow-ups/${user.id}`,
            [
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
            ],
            1024 * 1024 * 50,
          );

          fileManagerPayload.push({
            id: uuidv4(),
            user_id: user.id,
            name: uploadRes.name,
            mimetype: uploadRes.type,
            size: uploadRes.size,
            url: uploadRes.url,
            column_name: 'license_file',
            table_name: 'client_data',
          });

          const tmpFile: UploadFilesJsonbDto = {
            ...uploadRes,
          };
          if (createFollowUpPayload.attachments.length > 0) {
            createFollowUpPayload.attachments.push({
              ...tmpFile,
            });
          } else {
            createFollowUpPayload.attachments = [{ ...tmpFile }];
          }
        }
      }

      // pre defined subject and content for notification
      const subject = `إشعار متابعة الاقتراح`;
      const clientContent = `مرحباً أوليفيا، نود إخبارك أن "${proposal.project_name}" يتلقى متابعة من ${proposal.user.employee_name}. يرجى التحقق من حسابك الشخصي للحصول على مزيد من المعلومات، أو انقر هنا.`;

      const result = await this.prismaService.$transaction(
        async (prismaSession) => {
          const session =
            prismaSession instanceof PrismaService
              ? prismaSession
              : this.prismaService;

          const createdFollowUp = await this.followUpRepo.create(
            createFollowUpPayload,
            session,
          );

          const followUp = await this.followUpRepo.findOne(
            {
              id: createdFollowUp.id,
              include_relations: ['sender'],
            },
            session,
          );
          if (!followUp) {
            throw new RequestErrorException(
              `cant proceed due failed of searching follow up with id of ${createdFollowUp.id}`,
            );
          }
          if (!followUp.user) {
            throw new DataNotFoundException(
              `Failed to fetch user with id of ${followUp.user_id}`,
            );
          }

          if (fileManagerPayload.length > 0) {
            for (const file of fileManagerPayload) {
              await this.fileManagerRepo.create(file, session);
            }
          }

          const createdWebNotif = await this.notifRepo.create(
            {
              user_id: proposal.user!.id,
              content: clientContent,
              subject,
              type: 'PROPOSAL',
              specific_type: 'NEW_FOLLOW_UP',
              proposal_id: proposal.id,
            },
            session,
          );

          return {
            db: {
              created_follow_up: createdFollowUp,
              created_notif: createdWebNotif,
              sender_data: followUp.user,
            },
          };
        },
      );

      // const publisher = this.eventPublisher.mergeObjectContext(
      //   result.db.created_follow_up,
      // );

      const notifPayloads: ISendNotificaitonEvent[] = [];
      if (user.choosenRole !== 'tender_client' && !employee_only) {
        notifPayloads.push({
          notif_type: 'EMAIL',
          user_id: proposal.user.id,
          user_email: proposal.user.email,
          subject,
          content: clientContent,
          email_type: 'template',
          emailTemplateContext: {
            projectName: proposal.project_name,
            receiverName: proposal.user.employee_name,
            followUpSender: result.db.sender_data.employee_name,
            projectPageLink: `client/dashboard/current-project/${proposal.id}/show-details`,
          },
          emailTemplatePath: `tender/ar/proposal/project_followup`,
        });
        notifPayloads.push({
          notif_type: 'SMS',
          user_id: proposal.user.id,
          subject,
          content: clientContent,
          user_phone:
            proposal.user.mobile_number !== null
              ? proposal.user.mobile_number
              : undefined,
        });
      }

      if (notifPayloads && notifPayloads.length > 0) {
        for (const notifPayload of notifPayloads) {
          if (notifPayload.notif_type === 'SMS' && notifPayload.user_phone) {
            const clientPhone = isExistAndValidPhone(notifPayload.user_phone);

            // sms notif for follow up
            if (clientPhone) {
              await this.msegatService.sendSMSAsync({
                numbers: clientPhone.includes('+')
                  ? clientPhone.substring(1)
                  : clientPhone,
                msg: notifPayload.subject + notifPayload.content,
              });
            }
          }

          // email notif for follow up
          if (
            notifPayload.notif_type === 'EMAIL' &&
            notifPayload.user_email &&
            notifPayload.email_type
          ) {
            this.emailService.sendMail({
              mailType: notifPayload.email_type,
              to: notifPayload.user_email,
              subject: notifPayload.subject,
              content: notifPayload.content,
              templateContext: notifPayload.emailTemplateContext,
              templatePath: notifPayload.emailTemplatePath,
            });
          }

          // TODO: Figure out how
          // stil don't know why the event not working so try old approach
          // if (notifPayload.notif_type === 'SMS') {
          //   const validPhone = isExistAndValidPhone(notifPayload.user_phone);
          //   if (validPhone) {
          //     publisher.sendNotificaitonEvent({
          //       ...notifPayload,
          //       user_phone: validPhone,
          //     });
          //   }
          // } else {
          //   publisher.sendNotificaitonEvent({
          //     ...notifPayload,
          //   });
          // }
        }
      }

      return {
        created_follow_up: result.db.created_follow_up,
        created_web_notif: result.db.created_notif,
      };
    } catch (error) {
      throw error;
    }
  }
}
