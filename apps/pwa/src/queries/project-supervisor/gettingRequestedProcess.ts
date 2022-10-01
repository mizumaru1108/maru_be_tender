export const gettingRequestedProcess = `query MyQuery($limit: Int = 4) {
  proposal(where: {state: {_eq: PROJECT_SUPERVISOR}}, limit: $limit, order_by: {created_at: asc}) {
    id
    created_at
    project_idea
    project_name
  }
}
`;
