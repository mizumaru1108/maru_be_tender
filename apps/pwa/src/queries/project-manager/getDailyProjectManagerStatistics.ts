// // old version
// export const getDailyProjectManagerStatistics = `query getDailySupervisorStatistics($user_id: String = "", $first_date: timestamptz = "", $second_date: timestamptz = "") {
//   acceptableRequest: proposal_log_aggregate(where: {reviewer_id: {_eq: $user_id}, _and: {action: {_eq: "accept"}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}}) {
//     aggregate {
//       count
//     }
//   }
//   pendingRequest: proposal_log_aggregate(where: {reviewer_id: {_eq: $user_id}, _and: {action: {_eq: "pending"}, , _and: {action: {_eq: "accept"}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}}}) {
//     aggregate {
//       count
//     }
//   }
//   rejectedRequest: proposal_log_aggregate(where: {reviewer_id: {_eq: $user_id}, _and: {action: {_eq: "reject"}, _and: {_and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}}}) {
//     aggregate {
//       count
//     }
//   }
//   totalRequest: proposal_aggregate {
//     aggregate {
//       count(columns: id, distinct: true)
//     }
//   }
// }`;

// new version
export const getDailyProjectManagerStatistics = `
query MyQuery($user_id: String = "", $track_id: String = "") {
  acceptableRequest:proposal_aggregate(where: {proposal_logs: {_and: {action: {_in: ["accept", "update"]}, user_role: {_eq: "PROJECT_MANAGER"}}}, step: {_eq: ZERO}, oid: {_is_null: true}, inner_status: {_nin: [ACCEPTED_BY_SUPERVISOR,ACCEPTED_BY_MODERATOR]}, project_manager_id: {_eq: $user_id}, track_id: {_eq: $track_id}}) {
    aggregate {
      count
    }
  }

  incomingNewRequest: proposal_aggregate(where: {step: {_eq: ZERO}, oid: {_is_null: true}, inner_status: {_in: [ACCEPTED_BY_SUPERVISOR, REJECTED_BY_SUPERVISOR]}, track_id: {_eq: $track_id}, outter_status: {_in: [PENDING_CANCELED, ONGOING]}, project_manager_id: {_in: [$user_id]}}) {
    aggregate {
    count
    }
  }

  rejectedRequest: proposal_aggregate(where: {step: {_eq: ZERO}, oid: {_is_null: true}, inner_status: {_nin: [ACCEPTED_BY_MODERATOR, ACCEPTED_BY_SUPERVISOR], _in: [REJECTED_BY_SUPERVISOR, REJECTED_BY_PROJECT_MANAGER]}, track_id: {_eq: $track_id}}) {
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
