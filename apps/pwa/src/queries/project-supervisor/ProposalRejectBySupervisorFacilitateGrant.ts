export const ProposalRejectBySupervisorFacilitateGrant = `mutation ProposalAcceptBySupervisorFacilitateGrant($log: [proposal_log_insert_input!] = {}, $new_values: proposal_set_input = {}, $proposal_id: String = "") {
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
