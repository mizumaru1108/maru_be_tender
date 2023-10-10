import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailService } from '../../../libs/email/email.service';
import { EmailRecordEntity } from '../../entities/email.record.entity';
import { EmailRecordRepository } from '../../repositories/email.record.repository';
import { EmailAttachment } from '../../../libs/email/dtos/requests/send-email.dto';
import { BunnyService } from '../../../libs/bunny/services/bunny.service';
import { FileMimeTypeEnum } from '../../../commons/enums/file-mimetype.enum';
import { UploadFilesJsonbDto } from '../../../tender-commons/dto/upload-files-jsonb.dto';
import { ITenderAppConfig } from '../../../commons/configs/tender-app-config';
import { ConfigService } from '@nestjs/config';
import {
  CreateFileManagerProps,
  TenderFileManagerRepository,
} from '../../../tender-file-manager/repositories/tender-file-manager.repository';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../../prisma/prisma.service';

export class EmailRecordCreateCommand {
  title: string;
  content: string;
  user_on_app: '0' | '1';
  sender_id: string;
  receiver_name: string;
  receiver_email: string;
  receiver_id?: string;
  attachments?: Express.Multer.File[];
}

export class MailingCreateCommandResult {
  data: EmailRecordEntity;
}

@CommandHandler(EmailRecordCreateCommand)
export class EmailRecordCreateCommandHandler
  implements
    ICommandHandler<EmailRecordCreateCommand, MailingCreateCommandResult>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly bunnyService: BunnyService,
    private readonly configService: ConfigService,
    private readonly fileManagerRepo: TenderFileManagerRepository,
    private readonly emailRecordRepo: EmailRecordRepository,
  ) {}

  async execute(
    command: EmailRecordCreateCommand,
  ): Promise<MailingCreateCommandResult> {
    const { attachments, ...rest } = command;
    const tenderAppConfig =
      this.configService.get<ITenderAppConfig>('tenderAppConfig');
    const fileManagerPayload: CreateFileManagerProps[] = [];

    try {
      const formattedAttachments: EmailAttachment[] = [];
      const savedAttachments: UploadFilesJsonbDto[] = [];
      if (attachments) {
        for (const a of attachments) {
          const attachments = await this.bunnyService.uploadFileMulter(
            a,
            `tmra/${
              tenderAppConfig?.env || 'dev'
            }/organization/tender-management/emailing/${command.sender_id}/${
              command.receiver_email
            }`,
            [
              FileMimeTypeEnum.PDF,
              FileMimeTypeEnum.GIF,
              FileMimeTypeEnum.JPEG,
              FileMimeTypeEnum.JPEG,
              FileMimeTypeEnum.PNG,
              FileMimeTypeEnum.DOC,
              FileMimeTypeEnum.DOCX,
              FileMimeTypeEnum.XLS,
              FileMimeTypeEnum.XLSX,
              FileMimeTypeEnum.MKV,
              FileMimeTypeEnum.MP4,
              FileMimeTypeEnum.MOV,
            ],
            1024 * 1024 * 6,
          );

          savedAttachments.push({
            url: attachments.url,
            type: attachments.type,
            size: attachments.size,
          });

          fileManagerPayload.push({
            id: uuidv4(),
            user_id: command.sender_id,
            name: attachments.name,
            url: attachments.url,
            mimetype: attachments.type,
            size: attachments.size,
            column_name: 'email-records',
            table_name: 'email-records',
          });

          formattedAttachments.push({
            filename: a.originalname,
            content: a.buffer,
            contentDisposition: 'attachment',
            contentType: a.mimetype,
            encoding: 'base64',
          });
        }
      }

      // sending email
      await this.emailService.sendMailAsync({
        mailType: 'template',
        to: rest.receiver_email,
        subject: rest.title,
        templatePath: 'tender/base_tender_template',
        templateContext: {
          email_content: rest.content,
        },
        attachments:
          formattedAttachments.length > 0 ? formattedAttachments : undefined,
      });

      const dbRes = await this.prismaService.$transaction(async (session) => {
        const tx =
          session instanceof PrismaService ? session : this.prismaService;

        // creating email record
        const email_record = await this.emailRecordRepo.create(
          {
            ...rest,
            attachments:
              savedAttachments.length > 0
                ? JSON.stringify(savedAttachments)
                : undefined,
            user_on_app: rest.user_on_app === '1' ? true : false,
          },
          tx,
        );

        // saving filemanager
        if (fileManagerPayload.length > 0) {
          for (const file of fileManagerPayload) {
            await this.fileManagerRepo.create(file, tx);
          }
        }

        return { email_record };
      });

      return { data: dbRes.email_record };
    } catch (error) {
      if (fileManagerPayload.length > 0) {
        console.trace(
          'error occured, and uploaded file exist, deleteing files',
          fileManagerPayload,
        );
        for (const file of fileManagerPayload) {
          await this.bunnyService.deleteMedia(file.url, true);
        }
      }
      throw error;
    }
  }
}
