export const rejectProposalWLog = `
  mutation MyMutation($proposalId: String = "", $updateProposalStatusAndStatePayloads: proposal_set_input = {}) {
    update_proposal_by_pk(pk_columns: {id: $proposalId}, _set: $updateProposalStatusAndStatePayloads) {
      id
      inner_status
      outter_status
      state
    }
  }
`;
