import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import { v4 as uuidv4 } from 'uuid';
import { ITenderAppConfig } from '../../../../commons/configs/tender-app-config';
import { FileMimeTypeEnum } from '../../../../commons/enums/file-mimetype.enum';
import { BunnyService } from '../../../../libs/bunny/services/bunny.service';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DataNotFoundException } from '../../../../tender-commons/exceptions/data-not-found.exception';
import { ForbiddenPermissionException } from '../../../../tender-commons/exceptions/forbidden-permission-exception';
import { RequestErrorException } from '../../../../tender-commons/exceptions/request-error.exception';
import { isUploadFileJsonb } from '../../../../tender-commons/utils/is-upload-file-jsonb';
import {
  CreateFileManagerProps,
  TenderFileManagerRepository,
} from '../../../../tender-file-manager/repositories/tender-file-manager.repository';
import { ProposalItemBudgetRepository } from '../../../item-budget/repositories/proposal.item.budget.repository';
import { ProposalTimelinePostgresRepository } from '../../../poject-timelines/repositories/proposal.project.timeline.repository';
import { ProposalLogRepository } from '../../../proposal-log/repositories/proposal.log.repository';
import { ProposalSaveDraftInterceptorDto } from '../../dtos/requests';
import { ProposalEntity } from '../../entities/proposal.entity';
import { ProposalRepository } from '../../repositories/proposal.repository';
import { ProposalUpdateProps } from '../../types';
import { ProposalRegionRepository } from '../../../proposal-regions/region/repositories/proposal.region.repository';
import { ProposalGovernorateRepository } from '../../../proposal-regions/governorate/repositories/proposal.governorate.repository';
import { logUtil } from '../../../../commons/utils/log-util';

export class ProposalSaveDraftCommand {
  userId: string;
  request: ProposalSaveDraftInterceptorDto;
  letter_ofsupport_req?: any; //Express.Multer.File[];
  project_attachments?: any; //Express.Multer.File[];
}

export class ProposalSaveDraftCommandResult {
  updated_proposal: ProposalEntity | null;
}

@CommandHandler(ProposalSaveDraftCommand)
export class ProposalSaveDraftCommandHandler
  implements
    ICommandHandler<ProposalSaveDraftCommand, ProposalSaveDraftCommandResult>
{
  constructor(
    private readonly configService: ConfigService,
    private readonly bunnyService: BunnyService,
    private readonly prismaService: PrismaService,
    private readonly proposalRepo: ProposalRepository,
    private readonly logRepo: ProposalLogRepository,
    private readonly itemBudgetRepo: ProposalItemBudgetRepository,
    private readonly timelineRepo: ProposalTimelinePostgresRepository,
    private readonly proposalRegionRepo: ProposalRegionRepository,
    private readonly proposalGovernorateRepo: ProposalGovernorateRepository,
    private readonly fileManagerRepo: TenderFileManagerRepository,
  ) {}

  async execute(
    command: ProposalSaveDraftCommand,
  ): Promise<ProposalSaveDraftCommandResult> {
    const { userId, request, project_attachments, letter_ofsupport_req } =
      command;
    let fileManagerPayload: CreateFileManagerProps[] = [];
    const deletedFileManagerUrls: string[] = []; // id of file manager that we want to mark as soft delete.
    try {
      const tenderAppConfig =
        this.configService.get<ITenderAppConfig>('tenderAppConfig');

      const proposalId = request.proposal_id;

      // find proposal by id
      const proposal = await this.proposalRepo.fetchById({
        id: proposalId,
        include_relations: ['user', 'supervisor'],
      });

      // console.log(logUtil(proposal));

      if (!proposal) throw new DataNotFoundException(`Proposal not found`);
      if (proposal.submitter_user_id !== userId) {
        throw new ForbiddenPermissionException(
          `You are not allowed to edit this proposal`,
        );
      }
      if (!proposal.user) {
        throw new RequestErrorException(
          `Unable to proposal submitter user data!`,
        );
      }

      const proposalUpdateProps = Builder<ProposalUpdateProps>(
        ProposalUpdateProps,
        {
          id: proposal.id,
          // form 1
          project_idea: request.project_idea,
          project_location: request.project_location,
          project_implement_date: request.project_implement_date
            ? new Date(request.project_implement_date)
            : undefined,
          execution_time: request.execution_time,
          beneficiary_id: request.beneficiary_id,
          // form 2
          num_ofproject_binicficiaries: request.num_ofproject_binicficiaries,
          project_goals: request.project_goals,
          project_outputs: request.project_outputs,
          project_strengths: request.project_strengths,
          project_risks: request.project_risks,
          // form 3
          pm_name: request.pm_name,
          pm_mobile: request.pm_mobile,
          pm_email: request.pm_email,
          region: request.region,
          region_id:
            request && request.region_id ? request.region_id[0] : undefined,
          governorate: request.governorate,
          governorate_id:
            request && request.governorate_id
              ? request.governorate_id[0]
              : undefined,
          amount_required_fsupport: request.amount_required_fsupport,
        },
      ).build();

      if (
        !!request.project_idea &&
        !!request.project_location &&
        !!request.project_implement_date &&
        !!request.execution_time &&
        !!request.beneficiary_id
      ) {
        proposalUpdateProps.step = 'FIRST';
      }

      if (
        !!request.project_idea &&
        !!request.project_location &&
        !!request.project_implement_date &&
        !!request.execution_time &&
        !!request.beneficiary_id &&
        !!request.num_ofproject_binicficiaries &&
        !!request.project_goals &&
        !!request.project_outputs &&
        !!request.project_strengths &&
        !!request.project_risks
      ) {
        proposalUpdateProps.step = 'SECOND';
      }

      if (
        !!request.project_idea &&
        !!request.project_location &&
        !!request.project_implement_date &&
        !!request.execution_time &&
        !!request.beneficiary_id &&
        !!request.num_ofproject_binicficiaries &&
        !!request.project_goals &&
        !!request.project_outputs &&
        !!request.project_strengths &&
        !!request.project_risks &&
        !!request.pm_name &&
        !!request.pm_name &&
        !!request.pm_mobile &&
        !!request.pm_email &&
        !!request.region &&
        !!request.region_id &&
        !!request.governorate &&
        !!request.governorate_id
      ) {
        proposalUpdateProps.step = 'THIRD';
      }

      if (
        !!request.project_idea &&
        !!request.project_location &&
        !!request.project_implement_date &&
        !!request.execution_time &&
        !!request.beneficiary_id &&
        !!request.num_ofproject_binicficiaries &&
        !!request.project_goals &&
        !!request.project_outputs &&
        !!request.project_strengths &&
        !!request.project_risks &&
        !!request.pm_name &&
        !!request.pm_mobile &&
        !!request.pm_email &&
        !!request.region &&
        !!request.region_id &&
        !!request.governorate &&
        !!request.governorate_id &&
        !!request.amount_required_fsupport &&
        !!request.detail_project_budgets
      ) {
        proposalUpdateProps.step = 'FOURTH';
      }

      if (
        !!request.project_idea &&
        !!request.project_location &&
        !!request.project_implement_date &&
        !!request.execution_time &&
        !!request.beneficiary_id &&
        !!request.num_ofproject_binicficiaries &&
        !!request.project_goals &&
        !!request.project_outputs &&
        !!request.project_strengths &&
        !!request.project_risks &&
        !!request.pm_name &&
        !!request.pm_mobile &&
        !!request.pm_email &&
        !!request.region &&
        !!request.region_id &&
        !!request.governorate &&
        !!request.governorate_id &&
        !!request.amount_required_fsupport &&
        !!request.detail_project_budgets &&
        !!request.project_timeline
      ) {
        proposalUpdateProps.step = 'FIFTH';
      }

      if (
        !!request.project_idea &&
        !!request.project_location &&
        !!request.project_implement_date &&
        !!request.execution_time &&
        !!request.beneficiary_id &&
        !!request.num_ofproject_binicficiaries &&
        !!request.project_goals &&
        !!request.project_outputs &&
        !!request.project_strengths &&
        !!request.project_risks &&
        !!request.pm_name &&
        !!request.pm_mobile &&
        !!request.pm_email &&
        !!request.region &&
        !!request.region_id &&
        !!request.governorate &&
        !!request.governorate_id &&
        !!request.amount_required_fsupport &&
        !!request.detail_project_budgets &&
        !!request.proposal_bank_information_id
      ) {
        proposalUpdateProps.step = 'ZERO';
      }

      if (request.proposal_bank_information_id) {
        proposalUpdateProps.proposal_bank_id =
          request.proposal_bank_information_id;
      }

      if (project_attachments !== undefined && project_attachments.length > 0) {
        const uploadResult = await this.bunnyService.uploadFileMulter(
          project_attachments[0],
          `tmra/${tenderAppConfig?.env}/organization/tender-management/proposal/${proposalId}/${userId}/project-attachments`,
          [FileMimeTypeEnum.PDF],
          1024 * 1024 * 200,
        );

        proposalUpdateProps.project_attachments = {
          url: uploadResult.url,
          type: uploadResult.type,
          size: uploadResult.size,
        };

        fileManagerPayload.push({
          id: uuidv4(),
          user_id: userId,
          name: uploadResult.name,
          url: uploadResult.url,
          mimetype: uploadResult.type,
          size: uploadResult.size,
          column_name: 'project-attachments',
          table_name: 'proposal',
          proposal_id: proposalId,
        });

        if (isUploadFileJsonb(proposal.project_attachments)) {
          const oldFile = proposal.project_attachments as {
            url: string;
            type: string;
            size: number;
          };
          if (!!oldFile.url) {
            deletedFileManagerUrls.push(oldFile.url);
          }
        }
      }

      if (
        letter_ofsupport_req !== undefined &&
        letter_ofsupport_req.length > 0
      ) {
        const uploadResult = await this.bunnyService.uploadFileMulter(
          letter_ofsupport_req[0],
          `tmra/${tenderAppConfig?.env}/organization/tender-management/proposal/${proposalId}/${userId}/letter-of-support-req`,
          [FileMimeTypeEnum.PDF],
          1024 * 1024 * 200,
        );

        proposalUpdateProps.letter_ofsupport_req = {
          url: uploadResult.url,
          type: uploadResult.type,
          size: uploadResult.size,
        };

        fileManagerPayload.push({
          id: uuidv4(),
          user_id: userId,
          name: uploadResult.name,
          url: uploadResult.url,
          mimetype: uploadResult.type,
          size: uploadResult.size,
          column_name: 'letter-of-support-req',
          table_name: 'proposal',
          proposal_id: proposalId,
        });

        if (isUploadFileJsonb(proposal.letter_ofsupport_req)) {
          const oldFile = proposal.letter_ofsupport_req as {
            url: string;
            type: string;
            size: number;
          };
          if (!!oldFile.url) {
            deletedFileManagerUrls.push(oldFile.url);
          }
        }
      }

      const dbRes = await this.prismaService.$transaction(
        async (prismaSession) => {
          const session =
            prismaSession instanceof PrismaService
              ? prismaSession
              : this.prismaService;

          await this.proposalRepo.update(proposalUpdateProps, session);

          if (fileManagerPayload.length > 0) {
            for (const file of fileManagerPayload) {
              await this.fileManagerRepo.create(file, session);
            }
          }

          if (request.detail_project_budgets !== undefined) {
            // delete the old item budget
            await this.itemBudgetRepo.deleteMany(
              {
                proposal_id: request.proposal_id,
              },
              session,
            );

            // create new
            for (const deletePayload of request.detail_project_budgets) {
              await this.itemBudgetRepo.create(
                {
                  ...deletePayload,
                  proposal_id: request.proposal_id,
                },
                session,
              );
            }
          }

          // timeline
          if (request.project_timeline !== undefined) {
            // delete the old item budget
            await this.timelineRepo.deleteMany(
              {
                proposal_id: request.proposal_id,
              },
              session,
            );

            // create new
            for (const deletePayload of request.project_timeline) {
              await this.timelineRepo.create(
                {
                  ...deletePayload,
                  proposal_id: request.proposal_id,
                },
                session,
              );
            }
          }

          // update the first log
          const firstLog = await this.logRepo.findMany(
            {
              proposal_id: proposal.id,
              page: 1,
              limit: 1,
              sort_by: 'created_at',
              sort_direction: 'desc',
            },
            session,
          );

          if (request.governorate_id && request.governorate_id.length > 0) {
            await this.proposalGovernorateRepo.arraySave(
              proposal.id,
              request.governorate_id,
              session,
            );
          }

          if (request.region_id && request.region_id.length > 0) {
            await this.proposalRegionRepo.arraySave(
              proposal.id,
              request.region_id,
              session,
            );
          }

          if (firstLog.length > 0 && firstLog[0]) {
            const updatedProposal = await this.proposalRepo.fetchById(
              {
                id: request.proposal_id,
                include_relations: [
                  'user',
                  'beneficiary_details',
                  'proposal_item_budgets',
                  'project_timeline',
                  'bank_information',
                ],
              },
              session,
            );

            await this.logRepo.update(
              {
                id: firstLog[0].id,
                new_values: {
                  ...updatedProposal,
                  createdItemBudgetPayload:
                    updatedProposal?.proposal_item_budgets,
                },
              },
              session,
            );
          }

          const lastUpdatedProposal = await this.proposalRepo.fetchById(
            {
              id: request.proposal_id,
              include_relations: [
                'user',
                'proposal_logs',
                'beneficiary_details',
                'proposal_item_budgets',
                'project_timeline',
                'bank_information',
              ],
            },
            session,
          );

          return lastUpdatedProposal;
        },
        {
          timeout: 50000,
        },
      );

      return {
        updated_proposal: dbRes,
      };
    } catch (error) {
      if (fileManagerPayload && fileManagerPayload.length > 0) {
        for (const file of fileManagerPayload) {
          await this.bunnyService.deleteMedia(file.url, true);
        }
      }
      throw error;
    }
  }
}
