export const asignProposalToAUser = `mutation MyMutation($_set: proposal_set_input = {}, $where: proposal_bool_exp = {}) {
  update_proposal(_set: $_set, where: $where) {
    affected_rows
  }
}`;
