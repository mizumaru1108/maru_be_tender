export const updateDraftProposal = `mutation MyMutation($id: String = "", $update: proposal_set_input = {}) {
  update_proposal(where: {id: {_eq: $id}}, _set: $update) {
    affected_rows
  }
}
`;
