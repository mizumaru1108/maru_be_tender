import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../../prisma/prisma.service';
import { TenderProposalRepository } from '../../../tender-proposal/tender-proposal/repositories/tender-proposal.repository';
import {
  baseProposalMock,
  itemBudgetMock,
  projectTimelineMock,
  proposalLogModeratorMock,
} from '../../mock/mock-data';
import { TenderProposalLogRepository } from '../../../tender-proposal/tender-proposal-log/repositories/tender-proposal-log.repository';
import { TenderProposalItemBudgetRepository } from '../../../tender-proposal/item-budget/repositories/proposal-item-budget.repository';
import { TenderProposalTimelineRepository } from '../../../tender-proposal/tender-proposal-timeline/repositories/tender-proposal-timeline.repository';

export class QaProposalCreateNewCommand {
  project_name: string;
  submitter_user_id: string;
}

@CommandHandler(QaProposalCreateNewCommand)
export class QaProposalCreateNewCommandHandler
  implements ICommandHandler<QaProposalCreateNewCommand>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly proposalRepo: TenderProposalRepository,
    private readonly logRepo: TenderProposalLogRepository,
    private readonly itemBudgetRepo: TenderProposalItemBudgetRepository,
    private readonly timelineRepo: TenderProposalTimelineRepository,
  ) {}

  async execute(command: QaProposalCreateNewCommand): Promise<any> {
    try {
      return await this.prismaService.$transaction(async (prismaSession) => {
        const session =
          prismaSession instanceof PrismaService
            ? prismaSession
            : this.prismaService;

        const createdProposal = await this.proposalRepo.create(
          {
            accreditation_type_id: baseProposalMock.accreditation_type_id,
            added_value: baseProposalMock.added_value,
            amount_required_fsupport: baseProposalMock.amount_required_fsupport,
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
            inner_status: baseProposalMock.inner_status,
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
            project_name: command.project_name || baseProposalMock.project_name,
            project_outputs: baseProposalMock.project_outputs,
            project_risks: baseProposalMock.project_risks,
            project_strengths: baseProposalMock.project_strengths,
            project_track: baseProposalMock.project_track,
            proposal_bank_id: baseProposalMock.proposal_bank_id,
            reasons_to_accept: baseProposalMock.reasons_to_accept,
            region: baseProposalMock.region,
            remote_or_insite: baseProposalMock.remote_or_insite,
            state: baseProposalMock.state,
            step: baseProposalMock.step,
            submitter_user_id:
              command.submitter_user_id || baseProposalMock.submitter_user_id,
            supervisor_id: baseProposalMock.supervisor_id,
            support_goal_id: baseProposalMock.support_goal_id,
            support_outputs: baseProposalMock.support_outputs,
            support_type: baseProposalMock.support_type,
            target_group_age: baseProposalMock.target_group_age,
            target_group_num: baseProposalMock.target_group_num,
            target_group_type: baseProposalMock.target_group_type,
            track_id: baseProposalMock.track_id,
            vat: baseProposalMock.vat,
            vat_percentage: baseProposalMock.vat_percentage,
            whole_budget: baseProposalMock.whole_budget,
          },
          session,
        );

        await this.logRepo.createMany(
          proposalLogModeratorMock.map((log) => {
            return {
              ...log,
              proposal_id: createdProposal.id,
            };
          }),
          session,
        );

        await this.itemBudgetRepo.createMany(
          itemBudgetMock.map((budget) => {
            return {
              ...budget,
              proposal_id: createdProposal.id,
            };
          }),
          session,
        );

        await this.timelineRepo.createMany(
          projectTimelineMock.map((timeline) => {
            return {
              ...timeline,
              proposal_id: createdProposal.id,
            };
          }),
          session,
        );

        const proposal = await this.proposalRepo.fetchById(
          {
            id: createdProposal.id,
            includes_relation: [
              'proposal_logs',
              'proposal_item_budgets',
              'project_timeline',
              'beneficiary_detail',
            ],
          },
          session,
        );

        return {
          createdProposal: proposal,
        };
      });
    } catch (error) {
      throw error;
    }
  }
}