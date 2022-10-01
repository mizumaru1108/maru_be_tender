export const rejectProposal = `
  mutation MyMutation($proposalId: String, $rejectProposalPayloads: proposal_set_input = {}) {
    update_proposal(where: {id: {_eq: $proposalId}}, _set: $rejectProposalPayloads) {
      returning {
        id
        inner_status
        outter_status
      }
    }
  }
`;

// GRAPHQL QUERY EXAMPLE
// {
//   "rejectProposalPayloads": {
//      "inner_status": "REJECTED",
//      "outter_status": "CANCELED"
//   },
//   "proposalId": "xxxx"
// }
