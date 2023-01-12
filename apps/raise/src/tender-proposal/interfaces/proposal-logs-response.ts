import { proposal_log } from '@prisma/client';

export interface IProposalLogsResponse {
  data: proposal_log & {
    proposal: {
      user: {
        employee_name: string | null;
        email: string;
        mobile_number: string | null;
      };
      id: string;
      project_name: string;
      submitter_user_id: string;
    };
    reviewer: {
      employee_name: string | null;
      email: string;
      mobile_number: string | null;
    };
  };
}
