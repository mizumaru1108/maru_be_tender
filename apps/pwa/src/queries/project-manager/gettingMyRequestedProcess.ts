export const gettingMyRequestedProcess = `query MyQuery($limit: Int = 4, $project_manager_id: String = "") {
  proposal(where: {state: {_eq: PROJECT_MANAGER}, _and: {project_manager_id: {_eq: $project_manager_id}}}, limit: $limit, order_by: {created_at: asc}) {
    id
    created_at
    project_idea
    project_name
  }
}

`;
