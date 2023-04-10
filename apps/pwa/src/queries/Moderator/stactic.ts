export const moderatorStatistics = `query moderatorStatistics($start_date: timestamptz = "", $end_date: timestamptz = "") {
  acceptableRequest: proposal_log_aggregate(where: {action: {_eq: "accept"}, _and: {updated_at: {_gte: $start_date}, _and: {updated_at: {_lt: $end_date}}}}) {
    aggregate {
      count
    }
  }
  rejectedRequest: proposal_log_aggregate(where: {action: {_eq: "reject"}, _and: {updated_at: {_gte: $start_date}, _and: {updated_at: {_lt: $end_date}}}}) {
    aggregate {
      count
    }
  }
  incomingNewRequest: proposal_aggregate(where: { _and: {updated_at: {_gte: $start_date}, _and: {updated_at: {_lt: $end_date}}}, project_track: {_is_null: true}}) {
    aggregate {
      count
    }
  }
  totalRequest: proposal_aggregate(where: {_and: {updated_at: {_gte: $start_date}, _and: {updated_at: {_lt: $end_date}}}}) {
    aggregate {
      count
    }
  }
}`;

// pendingRequest: proposal_aggregate(where: {_and: {updated_at: {_gte: $start_date}, _and: {updated_at: {_lt: $end_date}}}, state: {_eq: PROJECT_SUPERVISOR}, inner_status: {_eq: ACCEPTED_BY_MODERATOR}}) {
//   aggregate {
//     count
//   }
// }
