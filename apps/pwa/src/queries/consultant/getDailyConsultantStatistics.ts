export const getDailyConsultantStatistics = `query getDailyConsultantStatistics($user_id: String = "", $first_date: timestamptz = "", $second_date: timestamptz = "") {
  accepted_projects: proposal_log_aggregate(where: {reviewer_id: {_eq: $user_id}, _and: {action: {_eq: "accept"}, _and: {created_at: {_gte: $first_date}, _and: {created_at: {_lt: $second_date}}}}}) {
    aggregate {
      count
    }
  }
  pending_projects: proposal_log_aggregate(where: {reviewer_id: {_eq: $user_id}, _and: {action: {_eq: "pending"}, , _and: {action: {_eq: "accept"}, _and: {created_at: {_gte: $first_date}, _and: {created_at: {_lt: $second_date}}}}}}) {
    aggregate {
      count
    }
  }
  rejected_projects: proposal_log_aggregate(where: {reviewer_id: {_eq: $user_id}, _and: {action: {_eq: "rejected"}, _and: {_and: {created_at: {_gte: $first_date}, _and: {created_at: {_lt: $second_date}}}}}}) {
    aggregate {
      count
    }
  }
  incoming_requests: proposal_aggregate(where: {inner_status: {_eq: ACCEPTED_AND_NEED_CONSULTANT}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}) {
    aggregate {
      count
    }
  }
}`;