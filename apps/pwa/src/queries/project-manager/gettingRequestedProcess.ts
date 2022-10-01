export const gettingRequestedProcess = `query MyQuery {
  proposal(where: {state: {_eq: PROJECT_MANAGER}}, limit: 10, order_by: {created_at: asc}) {
    id
    created_at
    project_idea
    project_name
  }
}
`;
