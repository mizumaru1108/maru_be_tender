// // old version
// export const getDailyStatisticCeo = `
// query getDailyCeoStatistics($user_id: String = "", $first_date: timestamptz = "", $second_date: timestamptz = "") {
//   acceptableRequest: proposal_log_aggregate(where: {reviewer_id: {_eq: $user_id}, _and: {action: {_eq: "accept"}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}}) {
//     aggregate {
//       count(columns: id, distinct: true)
//     }
//   }
//   pendingRequest: proposal_log_aggregate(where: {reviewer_id: {_eq: $user_id}, _and: {action: {_eq: "pending"}, , _and: {action: {_eq: "accept"}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}}}) {
//     aggregate {
//       count(columns: id, distinct: true)
//     }
//   }
//   rejectedRequest: proposal_log_aggregate(where: {reviewer_id: {_eq: $user_id}, _and: {action: {_eq: "reject"}, _and: {_and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}}}) {
//     aggregate {
//       count(columns: id, distinct: true)
//     }
//   }
//   totalRequest: proposal_aggregate {
//     aggregate {
//       count(columns: id, distinct: true)
//     }
//   }
// }
// `;

// new version
export const getDailyStatisticCeo = `
query MyQuery {
  acceptableRequest: proposal_aggregate(where: {proposal_logs: {_and: {action: {_in: ["accept", "update"]}, user_role: {_eq: "CEO"}}}, step: {_eq: ZERO}, oid: {_is_null: true}, inner_status: {_nin: [ACCEPTED_BY_SUPERVISOR, ACCEPTED_BY_MODERATOR, ACCEPTED_BY_PROJECT_MANAGER]}}) {
    aggregate {
      count
    }
  }

  incomingNewRequest: proposal_aggregate(where: {oid: {_is_null: true}, inner_status: {_in: [ACCEPTED_BY_PROJECT_MANAGER, ACCEPTED_BY_CONSULTANT]}, state: {_eq: CEO}, step: {_eq: ZERO}}) {
    aggregate {
      count
    }
  }

  rejectedRequest: proposal_aggregate(where: {step: {_eq: ZERO}, oid: {_is_null: true}, inner_status: {_in: [REJECTED_BY_CEO, REJECTED_BY_PROJECT_MANAGER, REJECTED_BY_CONSULTANT]}, supervisor_id: {_is_null: false}}) {
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
