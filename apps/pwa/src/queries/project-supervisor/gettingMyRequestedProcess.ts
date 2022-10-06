export const gettingMyRequestedProcess = `query MyQuery($limit: Int = 4, $supervisor_id: String = "") {
  proposal(where: {state: {_eq: PROJECT_SUPERVISOR}, _and: {supervisor_id: {_eq: $supervisor_id}}}, limit: $limit, order_by: {created_at: asc}) {
    id
    created_at
    project_idea
    project_name
  }
}
`;
