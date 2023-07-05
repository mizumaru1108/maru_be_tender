import { nanoid } from 'nanoid';
import { BeneficiaryEntity } from '../../beneficiary/entity/beneficiary.entity';
import { ProposalItemBudgetEntity } from '../../tender-proposal/item-budget/entities/proposal_item_budget.entity';
import { ProposalLogEntity } from '../../tender-proposal/tender-proposal-log/entities/proposal-log.entity';
import { ProjectTimelineEntity } from '../../tender-proposal/tender-proposal-timeline/entities/project-timeline.entity';
import { ProposalEntity } from '../../tender-proposal/tender-proposal/entities/proposal.entity';

export class MockProposal {
  proposal: {
    moderator: ProposalEntity;
  };
  item_budgets: {
    moderator: ProposalItemBudgetEntity[];
  };
  proposal_log: {
    moderator: ProposalLogEntity[];
  };
  project_timeline: {
    moderator: ProjectTimelineEntity[];
  };
}

export const projectTimelineMock: Omit<
  ProjectTimelineEntity,
  'id' | 'proposal_id'
>[] = [
  {
    name: `GENERARTED NAME ${nanoid(4)}`,
    end_date: new Date(),
    start_date: new Date(),
  },
];

export const proposalLogModeratorMock: Omit<
  ProposalLogEntity,
  'id' | 'proposal_id' | 'proposal' | 'created_at' | 'updated_at'
>[] = [
  {
    action: null,
    message: null,
    reject_reason: null,
    user_role: 'CLIENT',
    response_time: null,
    new_values: null,
    old_values: null,
    notes: null,
    reviewer_id: null,
    state: 'CLIENT',
  },
];

export const proposalLogSupervisorMock: Omit<
  ProposalLogEntity,
  'id' | 'proposal_id' | 'proposal' | 'created_at' | 'updated_at'
>[] = [
  {
    action: null,
    message: null,
    reject_reason: null,
    user_role: 'CLIENT',
    response_time: null,
    new_values: null,
    old_values: null,
    notes: null,
    reviewer_id: null,
    state: 'CLIENT',
  },
  {
    action: null,
    message: 'تم قبول المشروع من قبل مسوؤل الفرز',
    reject_reason: null,
    reviewer_id: 'c0508521-400e-4c42-8db0-13df42c1a241', // id frisky+moderator@soluvas.com
    user_role: 'MODERATOR',
    response_time: 29,
    new_values: null,
    old_values: null,
    notes: 'Already accepted by moderator',
    state: 'MODERATOR',
  },
];

export const itemBudgetMock: Omit<
  ProposalItemBudgetEntity,
  'id' | 'proposal_id' | 'proposal' | 'created_at' | 'updated_at'
>[] = [
  {
    clause: `GENERATED CLAUSE ${nanoid(4)}`,
    explanation: `GENERATED EXPLANATION ${nanoid(4)}`,
    amount: 100,
  },
];

export const beneficiariesMock: Omit<BeneficiaryEntity, 'id'> = {
  name: `Generated ${nanoid(4)}`,
  is_deleted: false,
};

export const baseProposalMock: ProposalEntity = {
  accreditation_type_id: null,
  added_value: null,
  amount_required_fsupport: 100,
  been_made_before: null,
  been_supported_before: null,
  beneficiary_id: 'e3776f97-9134-46b9-95d7-c09d6350a1b3',
  cashier_id: null,
  chairman_of_board_of_directors: null,
  clasification_field: null,
  clause: null,
  closing_report: null,
  created_at: new Date(),
  does_an_agreement: null,
  execution_time: 720,
  finance_id: null,
  fsupport_by_supervisor: null,
  governorate: 'طريف',
  id: nanoid(),
  inclu_or_exclu: null,
  inner_status: 'CREATED_BY_CLIENT',
  letter_ofsupport_req: {
    url: 'https://media.tmra.io/mocking-test/mock-data.pdf',
    size: 77815,
    type: 'application/pdf',
  },
  most_clents_projects: null,
  need_consultant: false,
  need_picture: null,
  num_ofproject_binicficiaries: 12,
  number_of_payments: null,
  number_of_payments_by_supervisor: null,
  oid: null,
  old_inner_status: null,
  on_consulting: false,
  on_revision: false,
  outter_status: 'ONGOING',
  partial_support_amount: null,
  pm_email: 'rdanang.dev@gmail.com',
  pm_mobile: '+966987654321',
  pm_name: `GENERATED PM NAME ${nanoid(4)}`,
  previously_add_bank: null,
  project_attachments: {
    url: 'https://media.tmra.io/mocking-test/mock-data.pdf',
    size: 77815,
    type: 'application/pdf',
  },
  project_beneficiaries: null,
  project_beneficiaries_specific_type: null,
  project_goals: `GENERATED PROJECT GOALS ${nanoid(4)}`,
  project_idea: `GENERATED PROJECT_IDEA ${nanoid(4)}`,
  project_implement_date: new Date(),
  project_location: 'منطقة مكة المكرمة',
  project_manager_id: null,
  project_name: `GENERATED-PROPOSAL ${nanoid(4)}`,
  project_number: 17519,
  project_numbers1: 17520,
  project_outputs: `GENERATED PROJECT OUTPUT ${nanoid(4)}`,
  project_risks: `GENERATED PROJECT RISKS ${nanoid(4)}`,
  project_strengths: `GENERATED PROJECT STRENGTH ${nanoid(4)}`,
  project_track: null,
  proposal_bank_id: '21b14e75-3e49-4669-96ae-afbc1222f216',
  reasons_to_accept: null,
  region: 'منطقة الحدود الشمالية',
  remote_or_insite: null,
  state: 'MODERATOR',
  step: 'ZERO',
  submitter_user_id: '0b7a7973-b7ac-4923-88b7-861e4630a34c', // user idnya umar umar+maru8@soluvas.com
  supervisor_id: null,
  support_goal_id: null,
  support_outputs: null,
  support_type: null,
  target_group_age: null,
  target_group_num: null,
  target_group_type: null,
  track_id: null,
  updated_at: new Date(),
  vat: null,
  vat_percentage: null,
  whole_budget: null,
};
