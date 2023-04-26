import {
  proposal,
  track,
  proposal_item_budget,
  proposal_log,
  bank_information,
  proposal_follow_up,
  payment,
  cheque,
  client_data,
  user_role,
  user,
} from '@prisma/client';

export interface FetchProposalByIdResponse {
  response:
    | (proposal & {
        track: track | null;
        proposal_item_budgets: proposal_item_budget[];
        proposal_logs: proposal_log[];
        bank_information: bank_information | null;
        user: {
          id: string;
          email: string;
          mobile_number?: string | null;
          employee_name?: string | null;
          client_data?: client_data | null;
          roles: user_role[];
          bank_information: bank_information[];
        };
        follow_ups: (proposal_follow_up & {
          user: user & {
            roles: user_role[];
          };
        })[];
        payments: (payment & {
          cheques: cheque[];
        })[];
      })
    | null;
}
