export const updateProposalByModerator = `mutation updateProposalByModerator($proposal_id: String = "", $new_values: proposal_set_input = {}, $log: [proposal_log_insert_input!] = {}) {
  update_proposal_by_pk(pk_columns: {id: $proposal_id}, _set: $new_values) {
    id
    inner_status
    outter_status
    state
    project_track
  }
  insert_proposal_log(objects: $log) {
    affected_rows
  }
}
`;
