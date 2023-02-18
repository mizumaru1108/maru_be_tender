export const GetProjectList = `
query GetProjectList ($track: [project_tracks_enum!]) {
  proposal(where: {state: {_eq: CEO}, inner_status: {_in: [ACCEPTED_BY_PROJECT_MANAGER, ACCEPTED_BY_CONSULTANT]}, project_track: {_in: $track}}) {
    projectNumber: id
    projectName: project_name
    projectSection: project_track
    associationName: user {
      client_data {
        entity
      }
    }
    createdAt: created_at
  }
  proposal_aggregate(where: {state: {_eq: CEO}, inner_status: {_in: [ACCEPTED_BY_PROJECT_MANAGER, ACCEPTED_BY_CONSULTANT]}, project_track: {_in: $track}}, limit: 5) {
    aggregate {
      totalData: count
    }
  }
}
`;
