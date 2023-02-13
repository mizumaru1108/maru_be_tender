// export const gettingIncomingRequests = `query MyQuery($limit: Int = 4, $project_track: project_tracks_enum = "") {
//   proposal(where: {state: {_eq: PROJECT_MANAGER}, _and: {project_manager_id: {_eq: "null"}, _and: {project_track: {_eq: $project_track}}}}, limit: $limit, order_by: {created_at: asc}) {
//     id
//     created_at
//     project_idea
//     project_name
//   }
// }
// `;

export const gettingIncomingRequests = `query MyQuery($limit: Int = 4, $project_track: project_tracks_enum = "") {
  proposal_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  proposal(where: {state: {_eq: PROJECT_MANAGER}, _and: {project_manager_id: {_eq: "null"}, _and: {project_track: {_eq: $project_track}}}}, limit: $limit, order_by: {created_at: asc}) {
    id
    created_at
    project_idea
    project_name
  }
  proposal_logs {
    reviewer {
      employee_name
    }
  }
}
`;
