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

// GRAPHQL QUERY EXAMPLE
// {
//   "approveProposalPayloads": {
//     "inner_status": "ACCEPTED",
//     "outter_status": "PENDING",
//     "state": "PROJECT_SUPERVISOR"
//   },
//   "proposalId": "7s9nC_CaeZ6fM3pWi5oTj"
// }
