export const getDailyProjectManagerStatistics = `query getDailySupervisorStatistics($user_id: String = "", $first_date: timestamptz = "", $second_date: timestamptz = "") {
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
  rejectedRequest: proposal_log_aggregate(where: {reviewer_id: {_eq: $user_id}, _and: {action: {_eq: "rejected"}, _and: {_and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}}}) {
    aggregate {
      count
    }
  }
  totalRequest: proposal_aggregate {
    aggregate {
      count(columns: id, distinct: true)
    }
  }
}`;

// particular_projects: proposal_aggregate(where: {project_manager_id: {_eq: $user_id}, _and: {inner_status: {_eq: ACCEPTED_BY_SUPERVISOR}, _and: {outter_status: {_eq: ONGOING}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}}}) {
//   aggregate {
//     count
//   }
// }
// general_projects: proposal_aggregate(where: {project_manager_id: {_is_null: true}, _and: {inner_status: {_eq: ACCEPTED_BY_SUPERVISOR}, _and: {outter_status: {_eq: ONGOING}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}}}) {
//   aggregate {
//     count
//   }
// }
// totalRequest: proposal_aggregate(where: {_and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}) {
//   aggregate {
//     count(columns: id, distinct: true)
//   }
// }
