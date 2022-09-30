export const GetProjectList = `
    query GetProjectList {
      proposal(where: {state: {_eq: CEO}}, limit: 5) {
        projectNumber: id
        projectName: project_name
        projectSection: project_kind_id
        createdAt: created_at
      }
      proposal_aggregate(where: {state: {_eq: CEO}}, limit: 5) {
        aggregate {
          totalData: count
        }
      }
    }
`;
