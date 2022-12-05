export const stepBackOneProposal = `mutation stepBackOneProposal($proposal_id: String = "", $new_values: proposal_set_input = {}) {
  update_proposal_by_pk(pk_columns: {id: $proposal_id}, _set: $new_values) {
    id
  }
}
`;
