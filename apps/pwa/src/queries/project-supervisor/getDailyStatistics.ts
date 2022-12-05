export const getDailySupervisorStatistics = `query getDailySupervisorStatistics($user_id: String = "", $first_date: timestamptz = "", $second_date: timestamptz = "") {
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
  rejected_projects: proposal_log_aggregate(where: {reviewer_id: {_eq: $user_id}, _and: {action: {_eq: "rejected"}, , _and: {action: {_eq: "accept"}, _and: {created_at: {_gte: $first_date}, _and: {created_at: {_lt: $second_date}}}}}}) {
    aggregate {
      count
    }
  }
  particular_projects: proposal_aggregate(where: {supervisor_id: {_eq: $user_id}, _and: {inner_status: {_eq: ACCEPTED_BY_MODERATOR}, _and: {outter_status: {_eq: ONGOING}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}}}) {
    aggregate {
      count
    }
  }
  general_projects: proposal_aggregate(where: {supervisor_id: {_is_null: true}, _and: {inner_status: {_eq: ACCEPTED_BY_MODERATOR}, _and: {outter_status: {_eq: ONGOING}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}}}) {
    aggregate {
      count
    }
  }
}`;
