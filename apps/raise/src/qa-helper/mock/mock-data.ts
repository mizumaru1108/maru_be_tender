import { nanoid } from 'nanoid';
import { ProposalItemBudgetEntity } from '../../tender-proposal/item-budget/entities/proposal_item_budget.entity';
import { BeneficiaryEntity } from '../../beneficiary/entity/beneficiary.entity';
import { ProposalLogEntity } from '../../tender-proposal/tender-proposal-log/entities/proposal-log.entity';
import { ProjectTimelineEntity } from '../../tender-proposal/tender-proposal-timeline/entities/project-timeline.entity';
import { ProposalEntity } from '../../tender-proposal/tender-proposal/entities/proposal.entity';
import { v4 as uuidv4 } from 'uuid';

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

export const projectTimelineMock: Omit<ProjectTimelineEntity, 'proposal_id'>[] =
  [
    {
      id: uuidv4(),
      name: `GENERARTED NAME ${nanoid(4)}`,
      end_date: new Date(),
      start_date: new Date(),
    },
  ];

export const proposalLogModeratorMock: Omit<
  ProposalLogEntity,
  'proposal_id' | 'proposal' | 'created_at' | 'updated_at'
>[] = [
  {
    id: nanoid(),
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

export const itemBudgetMock: Omit<
  ProposalItemBudgetEntity,
  'proposal_id' | 'proposal' | 'created_at' | 'updated_at'
>[] = [
  {
    id: uuidv4(),
    clause: `GENERATED CLAUSE ${nanoid(4)}`,
    explanation: `GENERATED EXPLANATION ${nanoid(4)}`,
    amount: 100,
  },
];

export const beneficiariesMock: BeneficiaryEntity = {
  id: nanoid(),
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

// just ignore this for a moment
export const Proposal1 = {
  id: 'ZN3wmNHhrvnjGFdT49VEJ',
  project_name: 'DUMMY SUPER WAHID ',
  previously_add_bank: null,
  been_made_before: null,
  been_supported_before: null,
  closing_report: null,
  does_an_agreement: null,
  inclu_or_exclu: null,
  need_consultant: false,
  need_picture: null,
  on_consulting: false,
  on_revision: false,
  support_type: null,
  vat: null,
  clasification_field: null,
  old_inner_status: null,
  pm_email: 'rdanang.dev@gmail.com',
  pm_mobile: '+966987654321',
  pm_name: 'DUMMY SUPER WAHID ',
  project_beneficiaries: null,
  region: 'منطقة الحدود الشمالية',
  remote_or_insite: null,
  track_id: null,
  project_implement_date: new Date(),
  num_ofproject_binicficiaries: 12,
  oid: null,
  project_number: 17519,
  project_numbers1: 17520,
  target_group_num: null,
  vat_percentage: null,
  letter_ofsupport_req: {
    url: 'https://media.tmra.io/mocking-test/mock-data.pdf',
    size: 77815,
    type: 'application/pdf',
  },
  project_attachments: {
    url: 'https://media.tmra.io/mocking-test/mock-data.pdf',
    size: 77815,
    type: 'application/pdf',
  },
  amount_required_fsupport: 100,
  execution_time: 720,
  fsupport_by_supervisor: null,
  number_of_payments: null,
  number_of_payments_by_supervisor: null,
  partial_support_amount: null,
  whole_budget: null,
  accreditation_type_id: null,
  added_value: null,
  beneficiary_id: 'e3776f97-9134-46b9-95d7-c09d6350a1b3',
  cashier_id: null,
  chairman_of_board_of_directors: null,
  clause: null,
  finance_id: null,
  governorate: 'طريف',
  inner_status: 'CREATED_BY_CLIENT',
  most_clents_projects: null,
  outter_status: 'ONGOING',
  project_beneficiaries_specific_type: null,
  project_goals: 'DUMMY SUPER WAHID ',
  project_idea: 'DUMMY SUPER WAHID ',
  project_location: 'منطقة مكة المكرمة',
  project_manager_id: null,
  project_outputs: 'DUMMY SUPER WAHID ',
  project_risks: 'DUMMY SUPER WAHID ',
  project_strengths: 'DUMMY SUPER WAHID ',
  project_track: null,
  reasons_to_accept: null,
  state: 'MODERATOR',
  step: 'ZERO',
  submitter_user_id: '0b7a7973-b7ac-4923-88b7-861e4630a34c',
  supervisor_id: null,
  support_goal_id: null,
  support_outputs: null,
  target_group_age: null,
  target_group_type: null,
  created_at: new Date(),
  updated_at: new Date(),
  proposal_bank_id: '21b14e75-3e49-4669-96ae-afbc1222f216',
  proposal_beneficiaries: [beneficiariesMock],
};

// just ignore this for a moment
export const MockData: MockProposal = {
  proposal: {
    moderator: Proposal1,
  },
  item_budgets: {
    moderator: [
      {
        clause:
          'DUMMY SUPER WAHID                                                                                                                                                                                                                                              ',
        amount: 100,
        explanation: 'DUMMY SUPER WAHID ',
        id: 'ff20779c-58bb-4870-ac3f-6fde5db34502',
        proposal_id: 'ZN3wmNHhrvnjGFdT49VEJ',
        created_at: new Date(),
        updated_at: new Date(),
        proposal: Proposal1,
      },
    ],
  },
  proposal_log: {
    moderator: [
      {
        id: 'R9lKnpSgUTNUx7jULAMa_',
        proposal_id: 'ZN3wmNHhrvnjGFdT49VEJ',
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
        created_at: new Date('2023-06-22T17:45:12.683+00:00'),
        updated_at: new Date('2023-06-22T17:45:12.683+00:00'),
        proposal: Proposal1,
      },
    ],
  },
  project_timeline: {
    moderator: [
      {
        id: '242c5a11-eb97-49d6-a04a-8b69b94cf9f3',
        name: 'DUMMY SUPER WAHID ',
        end_date: new Date('2023-06-24'),
        start_date: new Date('2023-06-23'),
        proposal_id: 'ZN3wmNHhrvnjGFdT49VEJ',
      },
    ],
  },
};
