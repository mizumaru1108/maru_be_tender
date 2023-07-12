import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileMimeTypeEnum } from 'src/commons/enums/file-mimetype.enum';
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
import { TenderCurrentUser } from 'src/tender-user/user/interfaces/current-user.interface';
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
  constructor(
    private readonly proposalRepo: ProposalRepository,
    private readonly bunnyService: BunnyService,
    private readonly followUpRepo: ProposalFollowUpRepository,
  ) {}

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

    const uploadedFilePath: string[] = [];
    let tenderFileFollowUpObj: UploadFilesJsonbDto[] = [];

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

      const {
        proposal_id,
        follow_up_type,
        content,
        follow_up_attachment,
        employee_only,
      } = request;

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
      const maxSize = 1024 * 1024 * 5;
      // if (follow_up_attachment && follow_up_attachment.length > 0) {
      //   for (let i = 0; i < follow_up_attachment.length; i++) {
      //     /* project attachment */
      //     const followUpFileName = generateFileName(
      //       follow_up_attachment[i].fullName,
      //       follow_up_attachment[i].fileExtension as FileMimeTypeEnum,
      //     );

      //     // const followUpFilePath = `tmra/${this.appEnv}/organization/tender-management/proposal/${proposal_id}/follow-ups/${user.id}/${followUpFileName}`;

      //     // const followUpFileBuffer = Buffer.from(
      //     //   follow_up_attachment[i].base64Data.replace(/^data:.*;base64,/, ''),
      //     //   'base64',
      //     // );

      //     // validateAllowedExtension(follow_up_attachment[i].fileExtension, [
      //     //   FileMimeTypeEnum.PDF,
      //     //   FileMimeTypeEnum.DOC,
      //     //   FileMimeTypeEnum.DOCX,
      //     //   FileMimeTypeEnum.PPT,
      //     //   FileMimeTypeEnum.PPTX,
      //     //   FileMimeTypeEnum.JPEG,
      //     //   FileMimeTypeEnum.JPG,
      //     //   FileMimeTypeEnum.PNG,
      //     //   FileMimeTypeEnum.XLS,
      //     //   FileMimeTypeEnum.XLSX,
      //     // ]);
      //     // validateFileUploadSize(follow_up_attachment[i].size, maxSize);

      //     //   const imageUrl = await this.bunnyService.uploadFileBase64(
      //     //     follow_up_attachment[i].fullName,
      //     //     followUpFileBuffer,
      //     //     followUpFilePath,
      //     //     `Uploading Proposal Follow Up from user ${user.id}`,
      //     //   );

      //     //   uploadedFilePath.push(imageUrl);
      //     //   const newFileFollowUpObj = [
      //     //     {
      //     //       url: imageUrl,
      //     //       type: follow_up_attachment[i].fileExtension,
      //     //       size: follow_up_attachment[i].size,
      //     //     },
      //     //   ];

      //     //   tenderFileFollowUpObj = [
      //     //     ...tenderFileFollowUpObj,
      //     //     ...newFileFollowUpObj,
      //     //   ];
      //     // }
      //   }

      //   // createFollowUpPayload.attachments = tenderFileFollowUpObj as any;

      //   // const fileManagerCreateManyPayload: Prisma.file_managerCreateManyInput[] =
      //   //   [];

      //   // if (createFollowUpPayload.attachments instanceof Array) {
      //   //   const tmp = createFollowUpPayload.attachments as any[];
      //   //   if (tmp.length > 0) {
      //   //     for (let i = 0; i < tmp.length; i++) {
      //   //       if (isUploadFileJsonb(tmp[i])) {
      //   //         const tmpFileJsonb: UploadFilesJsonbDto = tmp[i];
      //   //         const isExist = await this.tenderFileManagerService.findByUrl(
      //   //           tmpFileJsonb.url,
      //   //         );

      //   //         if (!isExist) {
      //   //           const payload: Prisma.file_managerUncheckedCreateInput = {
      //   //             id: uuidv4(),
      //   //             user_id: user.id,
      //   //             url: tmpFileJsonb.url,
      //   //             mimetype: tmpFileJsonb.type,
      //   //             size: tmpFileJsonb.size,
      //   //             column_name: 'attachments',
      //   //             table_name: 'proposal_follow_up',
      //   //             name: tmpFileJsonb.url.split('/').pop() as string,
      //   //           };
      //   //           fileManagerCreateManyPayload.push(payload);
      //   //         }
      //   //       }
      //   //     }
      //   //   } else {
      //   //     delete createFollowUpPayload.attachments;
      //   //   }
      //   // }

      //   // const createdFolllowUp = await this.followUpRepo.create(
      //   //   createFollowUpPayload,
      //   //   fileManagerCreateManyPayload,
      //   //   user,
      //   //   employee_only,
      //   //   this.configService.get('tenderAppConfig.baseUrl') as string,
      //   //   payload.selectLang,
      //   // );

      //   // await this.notifService.sendSmsAndEmailBatch(
      //   //   createdFolllowUp.followupNotif,
      //   // );

      //   // return createdFolllowUp.followUps;
      // }
    } catch (error) {
      throw error;
    }
  }
}
