export const DashboardClientPage = `query DashboardClientPage($id: String = "", $limit: Int = 2, $offset: Int = 0) {
  current_project: proposal(where: {submitter_user_id: {_eq: $id}, _and: {outter_status: {_eq: PENDING}, _and: {step: {_eq: ZERO}}}}) {
    id
    project_name
    created_at
    amount_required_fsupport
    project_idea
    outter_status
  }
  draft_projects: proposal(where: {_and: {step: {_neq: ZERO}}, submitter_user_id: {_eq: $id}}, limit: $limit, offset: $offset) {
    id
    project_name
    created_at
    amount_required_fsupport
    project_idea
    outter_status
  }
  pending_client_projects: proposal(where: {submitter_user_id: {_eq: $id}, _and: {outter_status: {_eq: PENDING}, _and: {step: {_eq: ZERO}}}}, limit: 10) {
    id
    project_name
    created_at
    project_idea
    outter_status
  }
  completed_client_projects:proposal(where: {submitter_user_id: {_eq: $id}, _and: {outter_status: {_eq: COMPLETED}, _and: {step: {_eq: ZERO}}}}, limit: 10) {
    id
    project_name
    created_at
    project_idea
    outter_status
  }
}`;
