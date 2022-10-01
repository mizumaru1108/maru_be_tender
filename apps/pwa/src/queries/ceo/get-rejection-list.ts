export const GetRejectionList = `
  query GetRejectedList {
    proposal(where: {state: {_eq: CEO}, inner_status: {_eq: REJECTED}}, limit: 5) {
      projectNumber: id
      projectName: project_name
      projectSection: project_kind_id
      createdAt: created_at
    }
    proposal_aggregate(where: {state: {_eq: CEO}, inner_status: {_eq: REJECTED}}, limit: 5) {
      aggregate {
        totalData: count
      }
    }
  }
`;
