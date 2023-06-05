import { InnerStatus, OutterStatus } from './commons';

export interface BankInformation {
  id: string;
  bank_account_name: string;
  bank_account_number: number;
  bank_name: string;
  card_image: { url: string; size: number | undefined; type: string; border_color?: string };
}

export interface Cheques {
  id: string;
  number: number;
  payment_id: number;
  transfer_receipt:
    | string
    | {
        size: number;
        type: string;
        url: string;
      };
  deposit_date: Date;
}

export interface ItemBudget {
  // amount: number;
  amount: any;
  explanation: string;
  clause: string;
  id: string;
  created_at: Date;
}

export type PaymentStatus =
  | 'set_by_supervisor'
  | 'issued_by_supervisor'
  | 'accepted_by_project_manager'
  | 'accepted_by_finance'
  | 'done';

export type AccreditationTypeId = 'PLAIN' | 'INCOMING';

export interface FollowUps {
  id: string;
  submitter_role: string;
  employee_only: boolean;
  content: string;
  created_at: Date;
  attachments: [{ url: string; size: number | undefined; type: string }];
  user: {
    employee_name: string;
    roles: {
      role: string;
    }[];
  };
}

export interface tracks {
  id: string;
  name: string;
  with_consultation: boolean;
}

export interface timeline {
  id: string;
  name: string;
  start_date: Date;
  end_date: Date;
  proposal_id: string;
}

export interface TrackBudget {
  id: string;
  name: string;
  budget: number;
  total_budget_used: number;
  remaining_budget: number;
}

export interface Proposal {
  id: string;
  project_name: string;
  project_implement_date: Date;
  project_location: string; // Orign
  project_track: string; // Tracks
  submitter_user_id: string;
  project_number: number;
  closing_report: boolean;
  need_picture: boolean;
  does_an_agreement: boolean;
  vat: boolean;
  vat_percentage: number;
  inclu_or_exclu: boolean;
  support_goal_id: string;
  support_outputs: string;
  track_id: string;
  accreditation_type_id: AccreditationTypeId;
  timelines: timeline[];
  governorate: string;
  track_budget: TrackBudget;
  // proposal_logs: {
  //   id: string;
  //   proposal_id: string;
  //   created_at: Date;
  //   updated_at: Date;
  //   reviewer_id: string;
  //   state: string;
  //   notes: string;
  //   action: string;
  //   message: string;
  //   user_role: string;
  //   // response_time: string;
  //   reject_reason: string;
  // }[];
  clasification_field: string;
  track: {
    id: string;
    name: string;
    with_consultation: boolean;
    created_at: Date;
  };
  proposal_logs: Log[];
  user: {
    id: string;
    employee_name: string;
    email: string;
    mobile_number: string;
    roles:
      | {
          role: {
            // title: string;
            id: string;
          };
        }[]
      | [];
    client_data: {
      region: string; // Orign
      governorate: string; // the values of the orign
      date_of_esthablistmen: Date;
      num_of_beneficiaries: number;
      ceo_name: string;
      chairman_name: string;
      entity: string;
    };
    bank_informations: BankInformation[];
  };
  created_at: Date;
  num_ofproject_binicficiaries: number;
  region: string;
  execution_time: number;
  project_idea: string;
  project_goals: string;
  project_outputs: string;
  project_strengths: string;
  project_risks: string;
  bank_informations: BankInformation[];
  bank_information?: BankInformation;
  amount_required_fsupport: number;
  fsupport_by_supervisor: number;
  letter_ofsupport_req: { url: string; size: number | undefined; type: string };
  project_attachments: { url: string; size: number | undefined; type: string };
  pm_email: string;
  pm_name: String;
  pm_mobile: string;
  project_beneficiaries: string;
  inner_status: InnerStatus; // outter_status
  outter_status: OutterStatus; // Outter_status
  state: string; // State
  added_value: string;
  been_made_before: boolean;
  been_supported_before: boolean;
  chairman_of_board_of_directors: string;
  most_clents_projects: string;
  reasons_to_accept: string;
  // remote_or_insite: boolean;
  remote_or_insite: string;
  // target_group_age: number;
  target_group_age: string;
  target_group_num: number;
  target_group_type: string;
  recommended_supports: ItemBudget[];
  clause: string;
  payments: {
    id: string;
    payment_amount: number;
    payment_date: Date;
    status: PaymentStatus;
    order: string;
    cheques: Cheques[];
    created_at: Date;
  }[];
  number_of_payments: number;
  number_of_payments_by_supervisor: number;
  support_type: boolean;
  proposal_item_budgets: ItemBudget[];
  proposal_item_budgets_aggregate: {
    aggregate: {
      sum: {
        amount: number;
      };
    };
  };
  follow_ups: FollowUps[];
  supervisor_id?: string | null;
  project_manager_id?: string | null;
  cashier_id?: string | null;
  finance_id?: string | null;
}

export type AmandementProposal = Omit<
  Proposal,
  | 'project_name'
  | 'project_track'
  | 'user'
  | 'created_at'
  | 'region'
  | 'execution_time'
  | 'bank_informations'
  | 'bank_information'
  | 'fsupport_by_supervisor'
  | 'inner_status'
  | 'outter_status'
  | 'state'
  | 'added_value'
  | 'been_made_before'
  | 'been_supported_before'
  | 'chairman_of_board_of_directors'
  | 'most_clents_projects'
  | 'reasons_to_accept'
  | 'remote_or_insite'
  | 'target_group_age'
  | 'target_group_num'
  | 'target_group_type'
  | 'recommended_supports'
  | 'clause'
  | 'payments'
  | 'number_of_payments'
  | 'number_of_payments_by_supervisor'
  | 'support_type'
  | 'proposal_item_budgets'
  | 'proposal_item_budgets_aggregate'
  | 'follow_ups'
>;

export interface AmandmentRequestForm extends AmandementProposal {
  project_name: string;
  execution_time: number;
  project_beneficiaries_specific_type: string;
  pm_name: string;
  pm_mobile: string;
  pm_email: string;
  region: string;
  governorate: string;
  proposal_item_budgets: ItemBudget[];
}

export type AmandementProposalList = {
  id: string;
  user: {
    employee_name: string;
  };
  reviewer: {
    employee_name: string;
  };
  proposal: {
    project_number: number;
    project_name: string;
    id: string;
  };
  created_at: Date;
};

export type AmandementFields = {
  amount_required_fsupport: string;
  letter_ofsupport_req: string;
  num_ofproject_binicficiaries: string;
  project_attachments: string;
  project_beneficiaries: string;
  project_goals: string;
  project_idea: string;
  project_implement_date: string;
  project_location: string;
  project_outputs: string;
  project_risks: string;
  project_strengths: string;
  notes: string;
};

export type ActiveTap =
  | 'main'
  | 'project-budget'
  | 'project-timeline'
  | 'follow-ups'
  | 'payments'
  | 'project-path'
  | 'supervisor-revision';

export type UpdateStatus = 'no-change' | 'updating' | 'updated' | 'error';

type Role =
  | 'CLIENT'
  | 'MODERATOR'
  | 'PROJECT_SUPERVISOR'
  | 'PROJECT_MANAGER'
  | 'CEO'
  | 'FINANCE'
  | 'CASHIER';

export type PropsalLog = {
  clasification_field: string;
  clause: string;
  closing_report: boolean;
  does_an_agreement: boolean;
  inclu_or_exclu: boolean;
  number_of_payments_by_supervisor: number;
  fsupport_by_supervisor: string;
  support_outputs: string;
  support_type: boolean;
  support_goal_id: string;
  need_picture: boolean;
  vat: boolean;
  vat_percentage: number;
  created_at: any;
  updated_at: any;
  state: string;
  project_track: string;
  track_id: string;
};

export type PropsalLogGrants = {
  notes: string;
  updated_at: any;
  action: string;
  message: string;
  user_role: string;
  proposal?: {
    accreditation_type_id: string;
    added_value: string;
    been_made_before: boolean;
    been_supported_before: boolean;
    chairman_of_board_of_directors: string;
    clasification_field: string;
    clause: string;
    closing_report: boolean;
    does_an_agreement: boolean;
    fsupport_by_supervisor: number;
    inclu_or_exclu: string;
    need_picture: boolean;
    number_of_payments_by_supervisor: number;
    reasons_to_accept: string;
    remote_or_insite: string;
    support_goal_id: string;
    support_outputs: string;
    support_type: boolean;
    // target_group_age: number;
    target_group_age: string;
    target_group_num: number;
    target_group_type: string;
    vat: boolean;
    vat_percentage: number;
  };
};

export type Log = {
  id?: string;
  proposal_id?: string;
  message: string;
  notes: string;
  state: string;
  action:
    | 'accept'
    | 'reject'
    | 'pending'
    | 'accept_and_need_consultant'
    | 'one_step_back'
    | 'step_back'
    | 'send_back_for_revision'
    | 'sending_closing_report'
    | 'insert_payment'
    | 'issued_by_supervisor'
    | 'set_by_supervisor'
    | 'accepted_by_project_manager'
    | 'accepted_by_finance'
    | 'done'
    | 'project_completed'
    | 'send_revised_version'
    | 'complete_payment';
  created_at: Date;
  updated_at: Date;
  user_role: Role;
  reviewer: {
    employee_name: string;
  };
  user_role_id: string;
  proposal?: PropsalLog;
  reject_reason?: string;
  reviewer_id?: string;
  employee_name: string;
};
