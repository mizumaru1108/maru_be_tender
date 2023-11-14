export enum ProposalLogActionEnum {
  /**
   * Role: Supervisor,
   * Brief: for example if there's 3 payment, and one of them is issued,
   * the issued payment will move to project manager (it mean accepted / published from spv to pm)
   */
  ISSUED_BY_SUPERVISOR = 'issued_by_supervisor',

  STEP_BACK = 'step_back',

  /**
   * Role: Cashier
   * Brief: the batch of payment on proposal that already accepted_by_finance has been paid to the client,
   * then cashier will upload the cheque of that payment batch, the step will be fallback to finance again.
   */
  UPLOADED_BY_CASHIER = 'uploaded_by_cashier',

  /**
   * Role: finance
   * Brief: if the uploaded is rejected by finance for some reason (ex: cheque is blured or something else),
   * the status will be reject cheque, then it will move to cashier again.
   */
  REJECT_CHEQUE = 'reject_cheque',

  /**
   * Role: Finance
   * Brief: if the uploaded cheque is approved by finance, then it will be done (the batch of that payment)
   */
  DONE = 'done',

  /**
   * Role: Finance
   * Brief: the approved payment from pm is approved by finance and moved to cashier
   */
  ACCEPTED_BY_FINANCE = 'accepted_by_finance',

  /**
   * Role: Supervisor,
   * Brief: After payment has been set (setting the proposal payment date, and amount)
   */
  SET_BY_SUPERVISOR = 'set_by_supervisor',

  COMPLETE_PAYMENT = 'complete_payment',

  /**
   * Role: PM,
   * Brief: the issued payment form spv is approved by pm and moved to finance,
   */
  ACCEPTED_BY_PROJECT_MANAGER = 'accepted_by_project_manager',

  /**
   * Role: PM,
   * Brief: the issued payment form spv is rejected by pm and moved back to spv, (set_by_supervisor)
   */
  REJECTED_BY_PROJECT_MANAGER = 'rejected_by_project_manager',

  /**
   * Brief: when client send the revised version of the proposal
   */
  SEND_REVISED_VERSION = 'send_revised_version',
  /**
   * Brief: Other admin roles ask to supervisor to send an amandement to client.
   */
  ASK_FOR_AMANDEMENT_REQUEST = 'ask_for_amandement_request',

  ACCEPT = 'accept',
}
