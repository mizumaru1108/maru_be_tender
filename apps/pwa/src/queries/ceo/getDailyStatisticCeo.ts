export const getDailyStatisticCeo = `
query getDailyCeoStatistics($user_id: String = "", $first_date: timestamptz = "", $second_date: timestamptz = "") {
  acceptableRequest: proposal_log_aggregate(where: {reviewer_id: {_eq: $user_id}, _and: {action: {_eq: "accept"}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}}) {
    aggregate {
      count(columns: id, distinct: true)
    }
  }
  pendingRequest: proposal_log_aggregate(where: {reviewer_id: {_eq: $user_id}, _and: {action: {_eq: "pending"}, , _and: {action: {_eq: "accept"}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}}}) {
    aggregate {
      count(columns: id, distinct: true)
    }
  }
  rejectedRequest: proposal_log_aggregate(where: {reviewer_id: {_eq: $user_id}, _and: {action: {_eq: "rejected"}, _and: {_and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}}}) {
    aggregate {
      count(columns: id, distinct: true)
    }
  }
  totalRequest: proposal_aggregate {
    aggregate {
      count(columns: id, distinct: true)
    }
  }
}
`;

// totalRequest: proposal_aggregate(where: {_and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}) {
//   aggregate {
//     count(columns: id, distinct: true)
//   }
// }
