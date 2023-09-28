import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { nanoid } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProposalItemBudgetRepository } from '../../../proposal-management/item-budget/repositories/proposal.item.budget.repository';
import { ProposalLogRepository } from '../../../proposal-management/proposal-log/repositories/proposal.log.repository';
import { ProposalTimelinePostgresRepository } from '../../../proposal-management/poject-timelines/repositories/proposal.project.timeline.repository';
import { ProposalRepository } from '../../../proposal-management/proposal/repositories/proposal.repository';
import {
  baseProposalMock,
  itemBudgetMock,
  projectTimelineMock,
  proposalLogSupervisorMock,
} from '../../mock/mock-data';
import { TenderUserRepository } from '../../../tender-user/user/repositories/tender-user.repository';
import { DataNotFoundException } from '../../../tender-commons/exceptions/data-not-found.exception';
import { TrackRepository } from '../../../track-management/track/repositories/track.repository';
import { PayloadErrorException } from '../../../tender-commons/exceptions/payload-error.exception';
import { InnerStatusEnum } from 'src/tender-commons/types/proposal';

export class QaProposalCreateNewSupervisorCommand {
  project_name: string;
  submitter_user_id: string;
  track_id?: string;
  supervisor_id?: string;
}

@CommandHandler(QaProposalCreateNewSupervisorCommand)
export class QaProposalCreateNewSupervisorCommandHandler
  implements ICommandHandler<QaProposalCreateNewSupervisorCommand>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly proposalRepo: ProposalRepository,
    private readonly userRepo: TenderUserRepository,
    private readonly logRepo: ProposalLogRepository,
    private readonly itemBudgetRepo: ProposalItemBudgetRepository,
    private readonly timelineRepo: ProposalTimelinePostgresRepository,
    private readonly trackRepo: TrackRepository,
  ) {}

  async execute(command: QaProposalCreateNewSupervisorCommand): Promise<any> {
    const { supervisor_id, track_id } = command;
    try {
      return await this.prismaService.$transaction(
        async (prismaSession) => {
          const session =
            prismaSession instanceof PrismaService
              ? prismaSession
              : this.prismaService;

          if (track_id) {
            const fetchedTrack = await this.trackRepo.findFirst(
              { id: track_id },
              session,
            );

            if (!fetchedTrack) {
              throw new DataNotFoundException(
                `Track with id of ${track_id} not found!`,
              );
            }
          }

          if (supervisor_id) {
            const fetchedSupervisor = await this.userRepo.findFirst(
              {
                id: supervisor_id,
                includes_relation: ['track'],
              },
              session,
            );

            if (!fetchedSupervisor) {
              throw new DataNotFoundException(
                `Supervisor with id of ${supervisor_id} not found!`,
              );
            }

            if (!fetchedSupervisor.track) {
              throw new DataNotFoundException(
                `Unable to fetch track data from supervisor with id of ${supervisor_id}`,
              );
            }

            if (track_id && track_id !== fetchedSupervisor.track.id) {
              throw new PayloadErrorException(
                `Supervisor track must be as same as the defined track`,
              );
            }
          }

          const createdProposal = await this.proposalRepo.create(
            {
              accreditation_type_id: baseProposalMock.accreditation_type_id,
              added_value: baseProposalMock.added_value,
              amount_required_fsupport:
                baseProposalMock.amount_required_fsupport,
              been_made_before: baseProposalMock.been_made_before,
              been_supported_before: baseProposalMock.been_supported_before,
              beneficiary_id: baseProposalMock.beneficiary_id,
              cashier_id: baseProposalMock.cashier_id,
              chairman_of_board_of_directors:
                baseProposalMock.chairman_of_board_of_directors,
              clasification_field: baseProposalMock.clasification_field,
              clause: baseProposalMock.clause,
              closing_report: baseProposalMock.closing_report,
              does_an_agreement: baseProposalMock.does_an_agreement,
              execution_time: baseProposalMock.execution_time,
              finance_id: baseProposalMock.finance_id,
              fsupport_by_supervisor: baseProposalMock.fsupport_by_supervisor,
              governorate: baseProposalMock.governorate,
              inclu_or_exclu: baseProposalMock.inclu_or_exclu,
              inner_status: InnerStatusEnum.ACCEPTED_BY_MODERATOR,
              letter_ofsupport_req: baseProposalMock.letter_ofsupport_req,
              most_clents_projects: baseProposalMock.most_clents_projects,
              need_consultant: baseProposalMock.need_consultant,
              need_picture: baseProposalMock.need_picture,
              num_ofproject_binicficiaries:
                baseProposalMock.num_ofproject_binicficiaries,
              number_of_payments: baseProposalMock.number_of_payments,
              number_of_payments_by_supervisor:
                baseProposalMock.number_of_payments_by_supervisor,
              oid: baseProposalMock.oid,
              old_inner_status: baseProposalMock.old_inner_status,
              on_consulting: baseProposalMock.on_consulting,
              on_revision: baseProposalMock.on_revision,
              outter_status: baseProposalMock.outter_status,
              partial_support_amount: baseProposalMock.partial_support_amount,
              pm_email: baseProposalMock.pm_email,
              pm_mobile: baseProposalMock.pm_mobile,
              pm_name: baseProposalMock.pm_name,
              project_attachments: baseProposalMock.project_attachments,
              project_beneficiaries: baseProposalMock.project_beneficiaries,
              project_beneficiaries_specific_type:
                baseProposalMock.project_beneficiaries_specific_type,
              project_goals: baseProposalMock.project_goals,
              project_idea: baseProposalMock.project_idea,
              project_implement_date: baseProposalMock.project_implement_date,
              project_location: baseProposalMock.project_location,
              project_manager_id: baseProposalMock.project_manager_id,
              project_name:
                command.project_name || baseProposalMock.project_name,
              project_outputs: baseProposalMock.project_outputs,
              project_risks: baseProposalMock.project_risks,
              project_strengths: baseProposalMock.project_strengths,
              project_track: baseProposalMock.project_track,
              proposal_bank_id: baseProposalMock.proposal_bank_id,
              reasons_to_accept: baseProposalMock.reasons_to_accept,
              region: baseProposalMock.region,
              remote_or_insite: baseProposalMock.remote_or_insite,
              state: 'PROJECT_SUPERVISOR',
              step: baseProposalMock.step,
              submitter_user_id:
                command.submitter_user_id || baseProposalMock.submitter_user_id,
              support_goal_id: baseProposalMock.support_goal_id,
              support_outputs: baseProposalMock.support_outputs,
              support_type: baseProposalMock.support_type,
              target_group_age: baseProposalMock.target_group_age,
              target_group_num: baseProposalMock.target_group_num,
              target_group_type: baseProposalMock.target_group_type,
              vat: baseProposalMock.vat,
              vat_percentage: baseProposalMock.vat_percentage,
              whole_budget: baseProposalMock.whole_budget,
              supervisor_id: supervisor_id, // default null
              track_id: track_id || 'c4622507-98ef-40ef-9d40-b36255157468', // default mosque
            },
            session,
          );

          await this.logRepo.createMany(
            proposalLogSupervisorMock.map((log) => {
              return {
                ...log,
                id: nanoid(),
                proposal_id: createdProposal.id,
              };
            }),
            session,
          );

          await this.itemBudgetRepo.createMany(
            itemBudgetMock.map((budget) => {
              return {
                ...budget,
                id: uuidv4(),
                proposal_id: createdProposal.id,
              };
            }),
            session,
          );

          await this.timelineRepo.createMany(
            projectTimelineMock.map((timeline) => {
              return {
                ...timeline,
                id: uuidv4(),
                proposal_id: createdProposal.id,
              };
            }),
            session,
          );

          const proposal = await this.proposalRepo.fetchById(
            {
              id: createdProposal.id,
              include_relations: [
                'user',
                'supervisor',
                'track',
                'proposal_logs',
                'proposal_item_budgets',
                'project_timeline',
                'beneficiary_details',
              ],
            },
            session,
          );

          return {
            createdProposal: proposal,
          };
        },
        {
          timeout: 20000,
        },
      );
    } catch (error) {
      throw error;
    }
  }
}
