export const GetMyRejectionList = `
  query GetMyRejectionList($reviewerId: String! = "$") {
    data: proposal_log(where: {state: {_eq: CEO}, outter_status: {_eq: CANCELED}, reviewer_id: {_eq: $reviewerId}}, limit: 5) {
      proposal {
        projectNumber: id
        projectName: project_name
        projectSection: project_track
        associationName: user{
          client_data {
            entity
          }
        }
        createdAt: created_at
      }
    }
    proposal_log_aggregate(where: {state: {_eq: CEO}, outter_status: {_eq: CANCELED}, reviewer_id: {_eq: $reviewerId}}, limit: 5) {
      aggregate {
        totalData: count
      }
    }
  }
`;
