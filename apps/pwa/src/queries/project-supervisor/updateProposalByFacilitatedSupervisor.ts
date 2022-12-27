export const updateProposalByFacilitatedSupervisor = `mutation updateProposalByFacilitatedSupervisor($proposal_id: String = "", $new_values: proposal_set_input = {}, $log: [proposal_log_insert_input!] = {}, $recommended_support: [recommended_support_consultant_insert_input!] = {}) {
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
  insert_recommended_support_consultant(objects: $recommended_support) {
    returning {
      amount
      clause
      explanation
      id
      proposal_id
    }
  }
}`;
