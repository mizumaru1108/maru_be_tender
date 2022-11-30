export const approveProposal = `
  mutation MyMutation($proposalId: String, $approveProposalPayloads: proposal_set_input = {}) {
    update_proposal(where: {id: {_eq: $proposalId}}, _set: $approveProposalPayloads) {
      returning {
        id
        inner_status
        outter_status
        state
      }
    }
  }
`;
