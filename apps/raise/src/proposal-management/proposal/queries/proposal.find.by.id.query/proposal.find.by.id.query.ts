import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProposalRepository } from 'src/proposal-management/proposal/repositories/proposal.repository';
import { DataNotFoundException } from 'src/tender-commons/exceptions/data-not-found.exception';
import { BeneficiaryEntity } from '../../../../beneficiary/entity/beneficiary.entity';
import { TrackEntity } from '../../../../tender-track/track/entities/track.entity';
import { UserEntity } from '../../../../tender-user/user/entities/user.entity';
import { ProposalFollowUpEntity } from '../../../follow-up/entities/proposal.follow.up.entity';
import { ProposalItemBudgetEntity } from '../../../item-budget/entities/proposal.item.budget.entity';
import { ProposalPaymentEntity } from '../../../payment/entities/proposal-payment.entity';
import { ProposalProjectTimelineEntity } from '../../../poject-timelines/entities/proposal.project.timeline.entity';
import { ProposalLogEntity } from '../../../proposal-log/entities/proposal-log.entity';
export class ProposalFindByIdQuery {
  id: string;
  relation: string[];
}

export class ProposalFindByIdQueryResult {
  accreditation_type_id?: string | null;
  added_value?: string | null;
  amount_required_fsupport?: string | null;
  been_made_before?: boolean | null = false;
  been_supported_before?: boolean | null = false;
  beneficiary_detail?: BeneficiaryEntity;
  beneficiary_id?: string | null;
  cashier_id?: string | null;
  chairman_of_board_of_directors?: string | null;
  clasification_field?: string | null;
  clause?: string | null;
  closing_report?: boolean | null = false;
  created_at?: Date | null = new Date();
  does_an_agreement?: boolean | null = false;
  execution_time?: string | null;
  finance_id?: string | null;
  follow_ups?: ProposalFollowUpEntity[];
  fsupport_by_supervisor?: string | null;
  governorate?: string | null;
  id: string;
  inclu_or_exclu?: boolean | null = false;
  inner_status?: string | null = 'CREATED_BY_CLIENT';
  letter_ofsupport_req: any; //Json?
  most_clents_projects?: string | null;
  need_consultant?: boolean | null;
  need_picture?: boolean | null = false;
  num_ofproject_binicficiaries?: number | null;
  number_of_payments?: number | null;
  number_of_payments_by_supervisor?: string | null;
  oid?: number | null;
  old_inner_status?: string | null;
  on_consulting?: boolean | null = false;
  on_revision?: boolean | null = false;
  outter_status?: string | null = 'ONGOING';
  partial_support_amount?: number | null;
  payments?: ProposalPaymentEntity[];
  pm_email?: string | null;
  pm_mobile?: string | null;
  pm_name?: string | null;
  previously_add_bank?: string[] | null;
  project_attachments: any; //Json?
  project_beneficiaries?: string | null;
  project_beneficiaries_specific_type?: string | null;
  project_goals?: string | null;
  project_idea?: string | null;
  project_implement_date?: Date | null;
  project_location?: string | null;
  project_manager_id?: string | null;
  project_name: string;
  project_number?: number | null;
  project_numbers1?: number | null;
  project_outputs?: string | null;
  project_risks?: string | null;
  project_strengths?: string | null;
  project_timeline?: ProposalProjectTimelineEntity[];
  project_track?: string | null; // deprecated, use track_id and refer to track entity
  proposal_bank_id?: string | null;
  proposal_beneficiaries?: BeneficiaryEntity[];
  proposal_item_budgets?: ProposalItemBudgetEntity[];
  proposal_log?: ProposalLogEntity[];
  reasons_to_accept?: string | null;
  region?: string | null;
  remote_or_insite?: string | null;
  state?: string | null = 'MODERATOR';
  step?: string | null;
  submitter_user_id: string;
  supervisor_id?: string | null;
  support_goal_id?: string | null;
  support_outputs?: string | null;
  support_type?: boolean | null = false;
  target_group_age?: string | null;
  target_group_num?: number | null;
  target_group_type?: string | null;
  track?: TrackEntity | null;
  track_id?: string | null;
  updated_at?: Date | null = new Date();
  vat?: boolean | null = false;
  vat_percentage?: number | null;
  whole_budget?: number | null;
  user?: UserEntity;
  supervisor?: UserEntity;
  default_item_budgets: any;
}

@QueryHandler(ProposalFindByIdQuery)
export class ProposalFindByIdQueryHandler
  implements IQueryHandler<ProposalFindByIdQuery, ProposalFindByIdQueryResult>
{
  constructor(private readonly proposalRepo: ProposalRepository) {}

  async execute(
    query: ProposalFindByIdQuery,
  ): Promise<ProposalFindByIdQueryResult> {
    const res = await this.proposalRepo.fetchById({
      id: query.id,
      includes_relation: query.relation || [
        'user',
        'beneficiary_details',
        'follow_ups',
        'track',
        'proposal_item_budgets',
        'supervisor',
        'proposal_logs',
        'payments',
        'bank_information',
        'project_timeline',
      ],
    });

    if (!res) {
      throw new DataNotFoundException(
        `Proposal with id of ${query.id} not found!`,
      );
    }

    return {
      ...res,
      amount_required_fsupport: res.amount_required_fsupport?.toString(),
      execution_time: res.execution_time?.toString(),
      fsupport_by_supervisor: res.fsupport_by_supervisor?.toString(),
      number_of_payments_by_supervisor:
        res.number_of_payments_by_supervisor?.toString(),
      default_item_budgets:
        res.proposal_logs &&
        res.proposal_logs[0].new_values &&
        res.proposal_logs[0].new_values.createdItemBudgetPayload
          ? res.proposal_logs[0].new_values.createdItemBudgetPayload
          : null,
    };
  }
}
