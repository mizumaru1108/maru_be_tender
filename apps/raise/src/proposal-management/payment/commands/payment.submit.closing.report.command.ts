import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { ITenderAppConfig } from 'src/commons/configs/tender-app-config';
import { FileMimeTypeEnum } from 'src/commons/enums/file-mimetype.enum';
import { BunnyService } from 'src/libs/bunny/services/bunny.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ProposalCloseReportCreateProps,
  ProposalCloseReportRepository,
} from 'src/proposal-management/closing-report/repositories/proposal.close.report.repository';
import { AskClosingReportDto } from 'src/proposal-management/payment/dtos/requests';
import { ProposalLogRepository } from 'src/proposal-management/proposal-log/repositories/proposal.log.repository';
import { ProposalRepository } from 'src/proposal-management/proposal/repositories/proposal.repository';
import { TenderAppRoleEnum } from 'src/tender-commons/types';
import {
  InnerStatusEnum,
  OutterStatusEnum,
  ProposalAction,
} from 'src/tender-commons/types/proposal';
import {
  CreateFileManagerProps,
  TenderFileManagerRepository,
} from 'src/tender-file-manager/repositories/tender-file-manager.repository';
import { TenderCurrentUser } from 'src/tender-user/user/interfaces/current-user.interface';
import { v4 as uuidv4 } from 'uuid';

export class PaymentSubmitClosingReportCommand {
  currentUser: TenderCurrentUser;
  dto: AskClosingReportDto;
}

export class PaymentSubmitClosingReportCommandResult {}

@CommandHandler(PaymentSubmitClosingReportCommand)
export class PaymentSubmitClosingReportCommandHandler
  implements
    ICommandHandler<
      PaymentSubmitClosingReportCommand,
      PaymentSubmitClosingReportCommandResult
    >
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bunnyService: BunnyService,
    private readonly configService: ConfigService,
    private readonly closeReportRepo: ProposalCloseReportRepository,
    private readonly proposalRepo: ProposalRepository,
    private readonly logRepo: ProposalLogRepository,
    private readonly fileManagerRepo: TenderFileManagerRepository,
  ) {}

  async execute(command: PaymentSubmitClosingReportCommand): Promise<any> {
    const { dto, currentUser } = command;
    let fileManagerPayload: CreateFileManagerProps[] = [];
    try {
      const appConfig =
        this.configService.get<ITenderAppConfig>('tenderAppConfig');

      const closeReportPayload = Builder<ProposalCloseReportCreateProps>(
        ProposalCloseReportCreateProps,
        {
          id: uuidv4(),
          proposal_id: dto.proposal_id,
          execution_place: dto.execution_place,
          gender: dto.gender,
          number_of_beneficiaries: dto.number_of_beneficiaries,
          number_of_staff: dto.number_of_staff,
          number_of_volunteer: dto.number_of_volunteer,
          project_duration: dto.project_duration,
          project_repeated: dto.project_repeated,
          target_beneficiaries: dto.target_beneficiaries,
        },
      ).build();

      if (dto.attachments && dto.attachments.length > 0) {
        for (const attachment of dto.attachments) {
          const uploadRes = await this.bunnyService.uploadFileBase64(
            attachment,
            `tmra/${appConfig?.env}/organization/tender-management/proposal/${dto.proposal_id}/${currentUser.id}/closing-form/attachment`,
            [
              FileMimeTypeEnum.JPEG,
              FileMimeTypeEnum.JPG,
              FileMimeTypeEnum.PNG,
              FileMimeTypeEnum.PDF,
            ],
            1024 * 1024 * 20,
          );

          fileManagerPayload.push({
            id: uuidv4(),
            user_id: currentUser.id,
            name: uploadRes.name,
            mimetype: uploadRes.type,
            size: uploadRes.size,
            url: uploadRes.url,
            column_name: 'attachments',
            table_name: 'closing_report_request',
            proposal_id: dto.proposal_id,
          });

          const tmpPayload = {
            url: uploadRes.url,
            size: uploadRes.size,
            type: uploadRes.type,
          };

          closeReportPayload.attachments.length > 0
            ? closeReportPayload.attachments.push(tmpPayload)
            : (closeReportPayload.attachments = [tmpPayload]);
        }
      }

      if (dto.images && dto.images.length > 0) {
        for (const image of dto.images) {
          const uploadRes = await this.bunnyService.uploadFileBase64(
            image,
            `tmra/${appConfig?.env}/organization/tender-management/proposal/${dto.proposal_id}/${currentUser.id}/closing-form/images`,
            [
              FileMimeTypeEnum.JPEG,
              FileMimeTypeEnum.JPG,
              FileMimeTypeEnum.PNG,
              FileMimeTypeEnum.PDF,
            ],
            1024 * 1024 * 20,
          );

          fileManagerPayload.push({
            id: uuidv4(),
            user_id: currentUser.id,
            name: uploadRes.name,
            mimetype: uploadRes.type,
            size: uploadRes.size,
            url: uploadRes.url,
            column_name: 'images',
            table_name: 'closing_report_request',
            proposal_id: dto.proposal_id,
          });

          const tmpPayload = {
            url: uploadRes.url,
            size: uploadRes.size,
            type: uploadRes.type,
          };

          closeReportPayload.images.length > 0
            ? closeReportPayload.images.push(tmpPayload)
            : (closeReportPayload.images = [tmpPayload]);
        }
      }

      const result = await this.prismaService.$transaction(
        async (prismaSession) => {
          const session =
            prismaSession instanceof PrismaService
              ? prismaSession
              : this.prismaService;

          await this.closeReportRepo.create(closeReportPayload, session);

          await this.proposalRepo.update(
            {
              id: dto.proposal_id,
              inner_status: InnerStatusEnum.PROJECT_COMPLETED,
              outter_status: OutterStatusEnum.COMPLETED,
            },
            session,
          );

          await this.logRepo.create(
            {
              id: nanoid(),
              proposal_id: dto.proposal_id,
              action: ProposalAction.PROJECT_COMPLETED,
              state: TenderAppRoleEnum.CLIENT,
              user_role: TenderAppRoleEnum.CLIENT,
            },
            session,
          );

          if (fileManagerPayload.length > 0) {
            for (const file of fileManagerPayload) {
              await this.fileManagerRepo.create(file, session);
            }
          }
        },
      );
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
