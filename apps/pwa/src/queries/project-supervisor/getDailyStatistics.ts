export const getDailySupervisorStatistics = `query getDailySupervisorStatistics($user_id: String = "", $first_date: timestamptz = "", $second_date: timestamptz = "") {
  acceptableRequest: proposal_log_aggregate(where: {reviewer_id: {_eq: $user_id}, action: {_eq: "accept"}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}) {
    aggregate {
      count(columns: proposal_id, distinct: true)
    }
  }
  rejectedRequest: proposal_log_aggregate(where: {reviewer_id: {_eq: $user_id}, _and: {action: {_eq: "reject"}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}}) {
    aggregate {
      count(columns: proposal_id, distinct: true)
    }
  }
  pendingRequest: proposal_aggregate(where: {supervisor_id: {_eq: $user_id}, _and: {inner_status: {_eq: ACCEPTED_BY_SUPERVISOR}, state: {_eq: PROJECT_MANAGER}, _and: {_and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}}}) {
    aggregate {
      count(columns: id, distinct: true)
    }
  }
  totalRequest: proposal_aggregate(where: {_and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}) {
    aggregate {
      count(columns: id, distinct: true)
    }
  }
}`;
