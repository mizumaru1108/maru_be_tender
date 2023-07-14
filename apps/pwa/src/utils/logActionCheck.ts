export enum CheckType {
  in = 'in',
  notIn = 'notIn',
}
export enum LogAction {
  Accept = 'accept',
  Reject = 'reject',
  Update = 'update',
  Pending = 'pending',
  AcceptAndNeedConsultant = 'accept_and_need_consultant',
  OneStepBack = 'one_step_back',
  StepBack = 'step_back',
  SendBackForRevision = 'send_back_for_revision',
  SendingClosingReport = 'sending_closing_report',
  InsertPayment = 'insert_payment',
  IssuedBySupervisor = 'issued_by_supervisor',
  SetBySupervisor = 'set_by_supervisor',
  AcceptedByProjectManager = 'accepted_by_project_manager',
  AcceptedByFinance = 'accepted_by_finance',
  Done = 'done',
  UploadedByCashier = 'uploaded_by_cashier',
  ProjectCompleted = 'project_completed',
  SendRevisedVersion = 'send_revised_version',
  CompletePayment = 'complete_payment',
  RejectCheque = 'reject_cheque',
}
interface Log {
  action: LogAction;
  type: CheckType;
  logAction: LogAction[];
}

export const LogActionCheck = ({ action, type, logAction }: Log): boolean => {
  // console.log({ action, type, logAction });
  let checkItem = false;
  if (type === CheckType.in) {
    checkItem = logAction.indexOf(action) > -1 ? true : false;
  } else {
    checkItem = logAction.indexOf(action) === -1 ? true : false;
  }
  return checkItem;
};
