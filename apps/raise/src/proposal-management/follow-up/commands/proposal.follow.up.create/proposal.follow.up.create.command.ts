import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { FileMimeTypeEnum } from 'src/commons/enums/file-mimetype.enum';
import { envLoadErrorHelper } from 'src/commons/helpers/env-loaderror-helper';
import { validateFileExtension } from 'src/commons/utils/validate-allowed-extension';
import { validateFileSize } from 'src/commons/utils/validate-file-size';
import { BunnyService } from 'src/libs/bunny/services/bunny.service';
import { CreateProposalFollowUpDto } from 'src/proposal-management/follow-up/dtos/requests/create-follow-up.dto';
import { ProposalFollowUpEntity } from 'src/proposal-management/follow-up/entities/proposal.follow.up.entity';
import { ProposalFollowUpRepository } from 'src/proposal-management/follow-up/repositories/proposal.follow.up.repository';
import { ProposalRepository } from 'src/proposal-management/proposal/repositories/proposal.repository';
import { TenderFilePayload } from 'src/tender-commons/dto/tender-file-payload.dto';
import { UploadFilesJsonbDto } from 'src/tender-commons/dto/upload-files-jsonb.dto';
import { DataNotFoundException } from 'src/tender-commons/exceptions/data-not-found.exception';
import { PayloadErrorException } from 'src/tender-commons/exceptions/payload-error.exception';
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
  follow_up: ProposalFollowUpEntity;
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
    private readonly fileManagerRepo: TenderFileManagerRepository,
    private readonly followUpRepo: ProposalFollowUpRepository,
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

  async execute(command: ProposalFollowUpCreateCommand): Promise<any> {
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
      const proposal = await this.proposalRepo.fetchProposalById(
        request.proposal_id,
      );
      if (!proposal) throw new DataNotFoundException('Proposal Not Found!');

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
      const createFollowUpPayload = Builder<ProposalFollowUpEntity>(
        ProposalFollowUpEntity,
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
      // const createdFolllowUp = await this.followUpRepo.create(
      //   createFollowUpPayload,
      //   fileManagerCreateManyPayload,
      //   user,
      //   employee_only,
      //   this.configService.get('tenderAppConfig.baseUrl') as string,
      //   payload.selectLang,
      // );

      // await this.notifService.sendSmsAndEmailBatch(
      //   createdFolllowUp.followupNotif,
      // );

      // return createdFolllowUp.followUps;
    } catch (error) {
      throw error;
    }
  }
}
