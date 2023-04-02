export const getDailyConsultantStatistics = `query getDailyConsultantStatistics($user_id: String = "", $first_date: timestamptz = "", $second_date: timestamptz = "") {
  acceptableRequest: proposal_log_aggregate(where: {reviewer_id: {_eq: $user_id}, _and: {action: {_eq: "accept"}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}}) {
    aggregate {
      count
    }
  }
  pendingRequest: proposal_log_aggregate(where: {reviewer_id: {_eq: $user_id}, _and: {action: {_eq: "pending"}, , _and: {action: {_eq: "accept"}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}}}) {
    aggregate {
      count
    }
  }
  rejectedRequest: proposal_log_aggregate(where: {reviewer_id: {_eq: $user_id}, _and: {action: {_eq: "reject"}, _and: {_and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}}}) {
    aggregate {
      count
    }
  }
  incomingNewRequest: proposal_aggregate(where: {inner_status: {_eq: ACCEPTED_AND_NEED_CONSULTANT}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}) {
    aggregate {
      count
    }
  }
}`;
