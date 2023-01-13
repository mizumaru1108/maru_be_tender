// export const gettingMyRequestedProcess = `query MyQuery($limit: Int = 4, $project_manager_id: String = "", $project_track: project_tracks_enum = BAPTISMS) {
//   proposal(where: {state: {_eq: PROJECT_MANAGER}, _and: {project_manager_id: {_eq: $project_manager_id}, _and: {project_track: {_eq: $project_track}}}}, limit: $limit, order_by: {created_at: asc}) {
//     id
//     created_at
//     project_idea
//     project_name
//   }
// }
// `;

export const gettingMyRequestedProcess = `query MyQuery($limit: Int = 4, $project_manager_id: String = "", $project_track: project_tracks_enum = BAPTISMS) {
  proposal_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  proposal(where: {state: {_eq: PROJECT_MANAGER}, _and: {project_manager_id: {_eq: $project_manager_id}, _and: {project_track: {_eq: $project_track}}}}, limit: $limit, order_by: {created_at: asc}) {
    id
    created_at
    project_idea
    project_name
  }
}
`;
