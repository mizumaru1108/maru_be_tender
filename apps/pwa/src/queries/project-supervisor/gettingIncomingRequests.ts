export const gettingIncomingRequests = `query MyQuery($limit: Int = 4) {
  proposal(where: {state: {_eq: PROJECT_SUPERVISOR}, _and: {supervisor_id: {_is_null: true}}}, limit: $limit, order_by: {created_at: asc}) {
    id
    created_at
    project_idea
    project_name
  }
}
`;
