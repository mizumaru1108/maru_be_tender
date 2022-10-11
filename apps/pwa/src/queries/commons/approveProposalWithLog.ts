export const AcceptProposalWLog = `
  mutation MyMutation($ceoAcceptProposalPayload: proposal_log_insert_input = {}) {
    insert_proposal_log_one(object: $ceoAcceptProposalPayload) {
      id
      proposal_id
      moderators
      status
      updated_at
    }
  }`;
