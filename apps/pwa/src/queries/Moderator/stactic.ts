// old version
// export const moderatorStatistics = `query moderatorStatistics($start_date: timestamptz = "", $end_date: timestamptz = "") {
//   acceptableRequest: proposal_log_aggregate(where: {action: {_eq: "accept"}, _and: {updated_at: {_gte: $start_date}, _and: {updated_at: {_lt: $end_date}}}}) {
//     aggregate {
//       count
//     }
//   }
//   rejectedRequest: proposal_log_aggregate(where: {action: {_eq: "reject"}, _and: {updated_at: {_gte: $start_date}, _and: {updated_at: {_lt: $end_date}}}}) {
//     aggregate {
//       count
//     }
//   }
//   incomingNewRequest: proposal_aggregate(where: { _and: {updated_at: {_gte: $start_date}, _and: {updated_at: {_lt: $end_date}}}, project_track: {_is_null: true}}) {
//     aggregate {
//       count
//     }
//   }
//   totalRequest: proposal_aggregate(where: {_and: {updated_at: {_gte: $start_date}, _and: {updated_at: {_lt: $end_date}}}}) {
//     aggregate {
//       count
//     }
//   }
// }
// `;

// new version
export const moderatorStatistics = `
query moderatorStatistics {
  acceptableRequest:proposal_aggregate(where: {proposal_logs: {_and: {action: {_in: "accept"}, user_role: {_eq: "MODERATOR"}}}, step: {_eq: ZERO}, oid: {_is_null: true}}) {
    aggregate {
      count
    }
  }
  
  rejectedRequest:proposal_aggregate(where: {proposal_logs: {_and: {action: {_in: "reject"}, user_role: {_eq: "MODERATOR"}}}, step: {_eq: ZERO}, oid: {_is_null: true}}) {
    aggregate {
      count
    }
  }
  
  incomingNewRequest:proposal_aggregate(where: {state: {_eq: MODERATOR}, outter_status: {_eq: ONGOING}, step: {_eq: ZERO}, oid: {_is_null: true}}) {
    aggregate {
      count
    }
  }
  
  totalRequest:proposal_aggregate(where: {step: {_eq: ZERO}, oid: {_is_null: true}}) {
    aggregate {
      count
    }
  }
}
`;
