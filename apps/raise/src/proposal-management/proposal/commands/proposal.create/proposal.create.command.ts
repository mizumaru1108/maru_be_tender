import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';
import { ITenderAppConfig } from '../../../../commons/configs/tender-app-config';
import { FileMimeTypeEnum } from '../../../../commons/enums/file-mimetype.enum';
import { BunnyService } from '../../../../libs/bunny/services/bunny.service';
import { EmailService } from '../../../../libs/email/email.service';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  CreateFileManagerProps,
  TenderFileManagerRepository,
} from '../../../../tender-file-manager/repositories/tender-file-manager.repository';
import { ProposalItemBudgetRepository } from '../../../item-budget/repositories/proposal.item.budget.repository';
import { ProposalTimelinePostgresRepository } from '../../../poject-timelines/repositories/proposal.project.timeline.repository';
import { ProposalLogRepository } from '../../../proposal-log/repositories/proposal.log.repository';
import { CreateProposalInterceptorDto } from '../../dtos/requests';
import { ISendNotificaitonEvent } from '../../entities/proposal.entity';
import { ProposalRepository } from '../../repositories/proposal.repository';
import { ProposalCreateProps } from '../../types';
import { ProposalRegionRepository } from '../../../proposal-regions/region/repositories/proposal.region.repository';
import { ProposalGovernorateRepository } from '../../../proposal-regions/governorate/repositories/proposal.governorate.repository';

export class ProposalCreateCommand {
  userId: string;
  request: CreateProposalInterceptorDto;
  letter_ofsupport_req: Express.Multer.File[];
  project_attachments: Express.Multer.File[];
}

export class ProposalCreateCommandResult {}

@CommandHandler(ProposalCreateCommand)
export class ProposalCreateCommandHandler
  implements
    ICommandHandler<ProposalCreateCommand, ProposalCreateCommandResult>
{
  constructor(
    private readonly proposalRepo: ProposalRepository,
    private readonly logRepo: ProposalLogRepository,
    private readonly timelineRepo: ProposalTimelinePostgresRepository,
    private readonly itemBudgetRepo: ProposalItemBudgetRepository,
    private readonly fileManagerRepo: TenderFileManagerRepository,
    private readonly proposalRegionRepo: ProposalRegionRepository,
    private readonly proposalGovernorateRepo: ProposalGovernorateRepository,
    private readonly configService: ConfigService,
    private readonly bunnyService: BunnyService,
    private readonly emailService: EmailService,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(
    command: ProposalCreateCommand,
  ): Promise<ProposalCreateCommandResult> {
    let fileManagerPayload: CreateFileManagerProps[] = [];
    const { userId, request, project_attachments, letter_ofsupport_req } =
      command;
    try {
      const tenderAppConfig =
        this.configService.get<ITenderAppConfig>('tenderAppConfig');

      const proposalCreatePayload = Builder<ProposalCreateProps>(
        ProposalCreateProps,
        {
          id: nanoid(),
          project_name: request.project_name,
          submitter_user_id: userId,
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
          // region: request.region,
          // region_id: request.region_id[0],
          // governorate: request.governorate,
          // governorate_id: request.governorate_id[0],
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
        proposalCreatePayload.step = 'FIRST';
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
        proposalCreatePayload.step = 'SECOND';
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
        !!request.region_id &&
        !!request.governorate_id
      ) {
        proposalCreatePayload.step = 'THIRD';
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
        !!request.region_id &&
        !!request.governorate_id &&
        !!request.amount_required_fsupport &&
        !!request.detail_project_budgets
      ) {
        proposalCreatePayload.step = 'FOURTH';
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
        !!request.region_id &&
        !!request.governorate_id &&
        !!request.amount_required_fsupport &&
        !!request.detail_project_budgets &&
        !!request.project_timeline
      ) {
        proposalCreatePayload.step = 'FIFTH';
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
        !!request.region_id &&
        !!request.governorate_id &&
        !!request.amount_required_fsupport &&
        !!request.detail_project_budgets &&
        !!request.proposal_bank_information_id
      ) {
        proposalCreatePayload.step = 'ZERO';
      }

      if (request.proposal_bank_information_id) {
        proposalCreatePayload.proposal_bank_id =
          request.proposal_bank_information_id;
      }

      // upload project attachmnents
      const attachments = await this.bunnyService.uploadFileMulter(
        project_attachments[0],
        `tmra/${tenderAppConfig?.env}/organization/tender-management/proposal/${proposalCreatePayload.id}/${userId}/project-attachments`,
        [FileMimeTypeEnum.PDF],
        1024 * 1024 * 200,
      );

      proposalCreatePayload.project_attachments = {
        url: attachments.url,
        type: attachments.type,
        size: attachments.size,
      };

      fileManagerPayload.push({
        id: uuidv4(),
        user_id: userId,
        name: attachments.name,
        url: attachments.url,
        mimetype: attachments.type,
        size: attachments.size,
        column_name: 'project-attachments',
        table_name: 'proposal',
        proposal_id: proposalCreatePayload.id,
      });

      // upload letter of support
      const letterOfSupport = await this.bunnyService.uploadFileMulter(
        letter_ofsupport_req[0],
        `tmra/${tenderAppConfig?.env}/organization/tender-management/proposal/${proposalCreatePayload.id}/${userId}/project-attachments`,
        [FileMimeTypeEnum.PDF],
        1024 * 1024 * 200,
      );

      proposalCreatePayload.letter_ofsupport_req = {
        url: letterOfSupport.url,
        type: letterOfSupport.type,
        size: letterOfSupport.size,
      };

      fileManagerPayload.push({
        id: uuidv4(),
        user_id: userId,
        name: letterOfSupport.name,
        url: letterOfSupport.url,
        mimetype: letterOfSupport.type,
        size: letterOfSupport.size,
        column_name: 'letter-of-support-req',
        table_name: 'proposal',
        proposal_id: proposalCreatePayload.id,
      });

      const dbRes = await this.prismaService.$transaction(
        async (prismaSession) => {
          const session =
            prismaSession instanceof PrismaService
              ? prismaSession
              : this.prismaService;

          // create proposal
          console.log('payload', proposalCreatePayload);
          const createdProposal = await this.proposalRepo.create(
            proposalCreatePayload,
            session,
          );

          if (
            request.detail_project_budgets !== undefined &&
            request.detail_project_budgets.length > 0
          ) {
            for (const budget of request.detail_project_budgets) {
              await this.itemBudgetRepo.create(
                {
                  ...budget,
                  id: budget.id || uuidv4(),
                  proposal_id: createdProposal.id,
                },
                session,
              );
            }
          }

          if (
            request.project_timeline !== undefined &&
            request.project_timeline
          ) {
            for (const time of request.project_timeline) {
              await this.timelineRepo.create(
                {
                  ...time,
                  id: uuidv4(),
                  proposal_id: createdProposal.id,
                },
                session,
              );
            }
          }

          if (fileManagerPayload.length > 0) {
            for (const file of fileManagerPayload) {
              await this.fileManagerRepo.create(file, session);
            }
          }

          await this.proposalGovernorateRepo.arraySave(
            createdProposal.id,
            request.governorate_id,
            session,
          );

          await this.proposalRegionRepo.arraySave(
            createdProposal.id,
            request.region_id,
            session,
          );

          const updatedProposal = await this.proposalRepo.fetchById(
            {
              id: createdProposal.id,
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

          await this.logRepo.create(
            {
              id: nanoid(),
              proposal_id: createdProposal.id,
              state: 'CLIENT',
              user_role: 'CLIENT',
              new_values: {
                ...updatedProposal,
                createdItemBudgetPayload:
                  updatedProposal?.proposal_item_budgets,
              },
            },
            session,
          );

          return {
            created_proposal: createdProposal,
          };
        },
        {
          timeout: 500000,
        },
      );

      const notifPayloads: ISendNotificaitonEvent[] = [];
      notifPayloads.push({
        notif_type: 'EMAIL',
        user_id: dbRes.created_proposal.submitter_user_id!,
        user_email: dbRes.created_proposal?.user?.email,
        subject: '',
        content: '',
        email_type: 'template',
        emailTemplateContext: {
          projectName: dbRes.created_proposal.project_name,
          clientName: dbRes.created_proposal?.user?.employee_name,
        },
        emailTemplatePath: `tender/ar/proposal/project_created`,
      });

      if (notifPayloads && notifPayloads.length > 0) {
        for (const notifPayload of notifPayloads) {
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
        }
      }

      return dbRes.created_proposal;
    } catch (error) {
      if (fileManagerPayload.length > 0) {
        console.log(
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
