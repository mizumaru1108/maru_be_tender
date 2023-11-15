// // new version
// export const getDailyConsultantStatistics = `query getDailyConsultantStatistics($user_id: String = "", $first_date: timestamptz = "", $second_date: timestamptz = "") {
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
//   incomingNewRequest: proposal_aggregate(where: {inner_status: {_eq: ACCEPTED_AND_NEED_CONSULTANT}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}) {
//     aggregate {
//       count
//     }
//   }
// }`;

// new version
export const getDailyConsultantStatistics = `
query MyQuery {
  acceptableRequest: proposal_aggregate(where: {proposal_logs: {_and: {action: {_in: ["accept"]}, user_role: {_eq: "CONSULTANT"}}}, step: {_eq: ZERO}, oid: {_is_null: true}, track: {with_consultation: {_eq: true}}}) {
    aggregate {
      count
    }
  }

  incomingNewRequest: proposal_aggregate(where: {step: {_eq: ZERO}, oid: {_is_null: true}, inner_status: {_in: [ACCEPTED_AND_NEED_CONSULTANT]}, outter_status: {_in: [ ONGOING]}}) {
    aggregate {
      count
    }
  }

  rejectedRequest: proposal_aggregate(where: {step: {_eq: ZERO}, oid: {_is_null: true}, proposal_logs: {_and: {action: {_in: ["reject"]}, user_role: {_eq: "CONSULTANT"}}}}) {
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
