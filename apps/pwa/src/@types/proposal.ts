import { InnerStatus, OutterStatus } from './commons';

export interface BankInformation {
  id: string;
  bank_account_name: string;
  bank_account_number: number;
  bank_name: string;
  card_image: { url: string; size: number | undefined; type: string };
}

export interface Cheques {
  id: string;
  number: number;
  payment_id: number;
  transfer_receipt: string;
  deposit_date: Date;
}

export interface ItemBudget {
  amount: number;
  explanation: string;
  clause: string;
  id: string;
}

export type PaymentStatus =
  | 'SET_BY_SUPERVISOR'
  | 'ISSUED_BY_SUPERVISOR'
  | 'ACCEPTED_BY_PROJECT_MANAGER'
  | 'ACCEPTED_BY_FINANCE'
  | 'DONE';

export interface FollowUps {
  id: string;
  content: string;
  created_at: Date;
  attachments: { url: string; size: number | undefined; type: string };
  user: {
    employee_name: string;
    roles: {
      role: string;
    }[];
  };
}

export interface Proposal {
  id: string;
  project_name: string;
  project_implement_date: Date;
  project_location: string; // Orign
  project_track: string; // Tracks
  user: {
    id: string;
    employee_name: string;
    email: string;
    mobile_number: string;
    roles:
      | {
          role: {
            title: string;
          };
        }[]
      | [];
    client_data: {
      region: string; // Orign
      governorate: string; // the values of the orign
      date_of_esthablistmen: Date;
      num_of_beneficiaries: number;
    };
    bank_informations: BankInformation[];
  };
  created_at: Date;
  num_ofproject_binicficiaries: number;
  region: string;
  execution_time: string;
  project_idea: string;
  project_goals: string;
  project_outputs: string;
  project_strengths: string;
  project_risks: string;
  bank_informations: BankInformation[];
  amount_required_fsupport: number;
  letter_ofsupport_req: { url: string; size: number | undefined; type: string };
  project_attachments: { url: string; size: number | undefined; type: string };
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
  remote_or_insite: boolean;
  target_group_age: number;
  target_group_num: number;
  target_group_type: string;
  recommended_supports: ItemBudget[];
  clause: string;
  payments: {
    id: string;
    payment_amount: number;
    payment_date: Date;
    status: PaymentStatus;
    order: number;
    cheques: Cheques[];
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
}

export type ActiveTap =
  | 'main'
  | 'project-budget'
  | 'project-timeline'
  | 'follow-ups'
  | 'payments'
  | 'project-path'
  | 'supervisor-revision';
