export const GetProjectList = `
  query GetProjectList {
    proposal(where: {state: {_eq: CEO}, inner_status: {_in: [ACCEPTED_BY_PROJECT_MANAGER, ACCEPTED_BY_CONSULTANT]}}, limit: 5) {
      projectNumber: id
      projectName: project_name
      projectSection: project_kind_id
      associationName: user{
        client_data {
          entity
        }
      }
      createdAt: created_at
    }
    proposal_aggregate(where: {state: {_eq: CEO}, inner_status: {_in: [ACCEPTED_BY_PROJECT_MANAGER, ACCEPTED_BY_CONSULTANT]}}, limit: 5) {
      aggregate {
        totalData: count
      }
    }
  }
`;
