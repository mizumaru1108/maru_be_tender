export const gettingIncomingRequests = `query MyQuery($limit: Int = 4) {
  proposal(where: {state: {_eq: PROJECT_MANAGER}, _and: {project_manager_id: {_eq: "null"}}}, limit: $limit, order_by: {created_at: asc}) {
    id
    created_at
    project_idea
    project_name
  }
}
`;
