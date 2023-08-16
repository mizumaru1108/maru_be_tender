import { Prisma } from '@prisma/client';

export type InnerStatus =
  | 'ACCEPTED_BY_MODERATOR'
  | 'CREATED_BY_CLIENT'
  | 'ASKING_MODERATOR_CHANGES'
  | 'ASKING_CLIENT_CHANGES'
  | 'REJECTED_BY_MODERATOR'
  | 'REVISED_BY_PROJECT_MANAGER'
  | 'INCORRECT_PAYMENT_DETAIL'
  | 'PAYMENT_DETAIL_REVISIED_BY_SUPERVISOR'
  | 'REJECTED_BY_SUPERVISOR_WITH_COMMENT'
  | 'ACCEPTED_BY_SUPERVISOR'
  | 'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR'
  | 'NEED_REPORT_BY_CLIENT'
  | 'CLIENT_UPLOAD_REPORT'
  | 'ASKING_SUPERVISOR_CHANGES'
  | 'ACCEPTED_AND_NEED_CONSULTANT'
  | 'REJECTED_BY_CONSULTANT'
  | 'ACCEPTED_BY_CONSULTANT'
  | 'ASKING_PROJECT_MANAGER_CHANGES'
  | 'REJECTED_BY_CEO_WITH_COMMENT'
  | 'ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION'
  | 'ACCEPTED_BY_FOR_PAYMENT_SPESIFICATION'
  | 'ASKING_PROJECT_SUPERVISOR_CHANGES'
  | 'ACCEPTED_BY_FINACE'
  | 'DONE_BY_CASHIER'
  | 'ACCEPTED_BY_PROJECT_MANAGER'
  | 'PAYMENT_SPECIFICATION_BY_SUPERVISOR'
  | 'PROJECT_COMPLETED'
  | 'REJECTED_BY_PROJECT_MANAGER_WITH_COMMENT'
  | 'REVISED_BY_CLIENT'
  | 'WAITING_FOR_EDIT_REQUEST_APPROVAL_FROM_SUPERVISOR'
  | 'REJECTED_BY_SUPERVISOR'
  | 'REJECTED_BY_PROJECT_MANAGER'
  | 'REJECTED_BY_CEO';

export enum InnerStatusEnum {
  ACCEPTED_BY_MODERATOR = 'ACCEPTED_BY_MODERATOR',
  CREATED_BY_CLIENT = 'CREATED_BY_CLIENT',
  ASKING_MODERATOR_CHANGES = 'ASKING_MODERATOR_CHANGES',
  ASKING_CLIENT_CHANGES = 'ASKING_CLIENT_CHANGES',
  REJECTED_BY_MODERATOR = 'REJECTED_BY_MODERATOR',
  REVISED_BY_PROJECT_MANAGER = 'REVISED_BY_PROJECT_MANAGER',
  INCORRECT_PAYMENT_DETAIL = 'INCORRECT_PAYMENT_DETAIL',
  PAYMENT_DETAIL_REVISIED_BY_SUPERVISOR = 'PAYMENT_DETAIL_REVISIED_BY_SUPERVISOR',
  REJECTED_BY_SUPERVISOR_WITH_COMMENT = 'REJECTED_BY_SUPERVISOR_WITH_COMMENT',
  ACCEPTED_BY_SUPERVISOR = 'ACCEPTED_BY_SUPERVISOR',
  ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR = 'ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR',
  NEED_REPORT_BY_CLIENT = 'NEED_REPORT_BY_CLIENT',
  CLIENT_UPLOAD_REPORT = 'CLIENT_UPLOAD_REPORT',
  ASKING_SUPERVISOR_CHANGES = 'ASKING_SUPERVISOR_CHANGES',
  ACCEPTED_AND_NEED_CONSULTANT = 'ACCEPTED_AND_NEED_CONSULTANT',
  REJECTED_BY_CONSULTANT = 'REJECTED_BY_CONSULTANT',
  ACCEPTED_BY_CONSULTANT = 'ACCEPTED_BY_CONSULTANT',
  ASKING_PROJECT_MANAGER_CHANGES = 'ASKING_PROJECT_MANAGER_CHANGES',
  REJECTED_BY_CEO_WITH_COMMENT = 'REJECTED_BY_CEO_WITH_COMMENT',
  ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION = 'ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION',
  ACCEPTED_BY_FOR_PAYMENT_SPESIFICATION = 'ACCEPTED_BY_FOR_PAYMENT_SPESIFICATION',
  ASKING_PROJECT_SUPERVISOR_CHANGES = 'ASKING_PROJECT_SUPERVISOR_CHANGES',
  ACCEPTED_BY_FINACE = 'ACCEPTED_BY_FINACE',
  DONE_BY_CASHIER = 'DONE_BY_CASHIER',
  ACCEPTED_BY_PROJECT_MANAGER = 'ACCEPTED_BY_PROJECT_MANAGER',
  PAYMENT_SPECIFICATION_BY_SUPERVISOR = 'PAYMENT_SPECIFICATION_BY_SUPERVISOR',
  PROJECT_COMPLETED = 'PROJECT_COMPLETED',
  REJECTED_BY_PROJECT_MANAGER_WITH_COMMENT = 'REJECTED_BY_PROJECT_MANAGER_WITH_COMMENT',
  REVISED_BY_CLIENT = 'REVISED_BY_CLIENT',
  WAITING_FOR_EDIT_REQUEST_APPROVAL_FROM_SUPERVISOR = 'WAITING_FOR_EDIT_REQUEST_APPROVAL_FROM_SUPERVISOR',
  REJECTED_BY_SUPERVISOR = 'REJECTED_BY_SUPERVISOR',
  REJECTED_BY_PROJECT_MANAGER = 'REJECTED_BY_PROJECT_MANAGER',
  REJECTED_BY_CEO = 'REJECTED_BY_CEO',
  REQUESTING_CLOSING_FORM = 'REQUESTING_CLOSING_FORM',
}

export type OutterStatus =
  | 'PENDING'
  | 'CANCELED'
  | 'COMPLETED'
  | 'ONGOING'
  | 'ON_REVISION';

export enum OutterStatusEnum {
  PENDING = 'PENDING',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED',
  ONGOING = 'ONGOING',
  ON_REVISION = 'ON_REVISION',
  ASKED_FOR_AMANDEMENT = 'ASKED_FOR_AMANDEMENT',
  ASKED_FOR_AMANDEMENT_PAYMENT = 'ASKED_FOR_AMANDEMENT_PAYMENT',
}

/* enum for proposal action and proposal_log action */
export enum ProposalAction {
  ACCEPT = 'accept',
  UPDATE = 'update',
  ACCEPT_AND_ASK_FOR_CONSULTATION = 'accept_and_ask_for_consultation', //is there any ?
  ASK_FOR_AMANDEMENT_REQUEST = 'ask_for_amandement_request',
  COMPLETE = 'complete',
  COMPLETE_PAYMENT = 'complete_payment',
  PROJECT_COMPLETED = 'project_completed',
  REJECT = 'reject',
  SEND_BACK_FOR_REVISION = 'send_back_for_revision',
  SENDING_CLOSING_REPORT = 'sending_closing_report',
  SEND_REVISED_VERSION = 'send_revised_version',
  STEP_BACK = 'step_back',
  STUDY_AGAIN = 'study_again',
  INSERT_PAYMENT = 'insert_payment',
  ISSUED_BY_SUPERVISOR = 'issued_by_supervisor',
  ACCEPTED_BY_FINANCE = 'accepted_by_finance',
  ACCEPTED_BY_PROJECT_MANAGER = 'accepted_by_project_manager',
  UPLOADED_BY_CASHIER = 'uploaded_by_cashier',
  SET_BY_SUPERVISOR = 'set_by_supervisor',
  DONE = 'done',
  REJECT_CHEQUE = 'reject_cheque',
}

export type ProposalItemBudget = {
  id: string;
  proposal_id: string;
  amount: Prisma.Decimal;
  clause: string;
  explanation: string;
};
