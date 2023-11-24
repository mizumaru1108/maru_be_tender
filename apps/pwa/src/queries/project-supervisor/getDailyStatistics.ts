// old version
// export const getDailySupervisorStatistics = `
// query getDailySupervisorStatistics($user_id: String = "", $first_date: timestamptz = "", $second_date: timestamptz = "") {
//   acceptableRequest: proposal_log_aggregate(where: {reviewer_id: {_eq: $user_id}, action: {_eq: "accept"}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}) {
//     aggregate {
//       count(columns: proposal_id, distinct: true)
//     }
//   }
//   rejectedRequest: proposal_log_aggregate(where: {reviewer_id: {_eq: $user_id}, _and: {action: {_eq: "reject"}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}}) {
//     aggregate {
//       count(columns: proposal_id, distinct: true)
//     }
//   }
//   pendingRequest: proposal_aggregate(where: {supervisor_id: {_eq: $user_id}, _and: {inner_status: {_eq: ACCEPTED_BY_SUPERVISOR}, state: {_eq: PROJECT_MANAGER}, _and: {_and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}}}) {
//     aggregate {
//       count(columns: id, distinct: true)
//     }
//   }
//   totalRequest: proposal_aggregate(where: {_and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}) {
//     aggregate {
//       count(columns: id, distinct: true)
//     }
//   }
// }
// `;

// new version
export const getDailySupervisorStatistics = `
query MyQuery($user_id: String = "", $track_id: String = "",$_in_outter_status: [proposal_request_enum!] = []) {
  acceptableRequest: proposal_aggregate(where: {proposal_logs: {_and: {action: {_in: "accept"}, user_role: {_eq: "PROJECT_SUPERVISOR"}}}, step: {_eq: ZERO}, oid: {_is_null: true}, inner_status: {_neq: ACCEPTED_BY_MODERATOR}, supervisor_id: {_eq: $user_id}, track_id: {_eq: $track_id}}) {
    aggregate {
      count 
    }
  }

  incomingNewRequest: proposal_aggregate(where: {step: {_eq: ZERO}, oid: {_is_null: true}, inner_status: {_eq: ACCEPTED_BY_MODERATOR}, track_id: {_eq: $track_id}, outter_status: {_eq: ONGOING}, supervisor_id: {_in: [$user_id]}, state: {_eq: PROJECT_SUPERVISOR}}) {
    aggregate {
      count
    }
  }
  
  rejectedRequest:proposal_aggregate(where: {proposal_logs: {_and: {action: {_in: "reject"}, user_role: {_eq: "PROJECT_SUPERVISOR"}}}, step: {_eq: ZERO}, oid: {_is_null: true}, inner_status: {_neq: ACCEPTED_BY_MODERATOR}, supervisor_id: {_eq: $user_id}, track_id: {_eq: $track_id}, outter_status: {_in: $_in_outter_status}}) {
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
