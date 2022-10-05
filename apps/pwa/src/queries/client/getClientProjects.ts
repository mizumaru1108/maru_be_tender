export const getClientProjects = `query MyQuery( $id: String = "") {
  pending_client_projects:proposal(where: {submitter_user_id: {_eq: $id}, _and: {outter_status: {_eq: PENDING}}}) {
    id
    project_name
    created_at
    project_idea
    outter_status
  }
  completed_client_projects:proposal(where: {submitter_user_id: {_eq: $id}, _and: {outter_status: {_eq: COMPLETED}}}) {
    id
    project_name
    created_at
    project_idea
    outter_status
  }
}
`;