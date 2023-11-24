// // old version
// export const getDailyCashierStatistics = `query getDailyCashierStatistics($first_date: timestamptz = "", $second_date: timestamptz = "") {
//   incoming_requests: proposal_aggregate(where: {inner_status: {_eq: ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}) {
//     aggregate {
//       count
//     }
//   }
// }`;

// new version
export const getDailyCashierStatistics = `
query MyQuery($user_id: String = "") {
  acceptableRequest: proposal_aggregate(where: {step: {_eq: ZERO}, oid: {_is_null: true}, _or: [{cashier_id: {_eq: $user_id}},{cashier_id: {_is_null:true}}], inner_status: {_in: [ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR,DONE_BY_CASHIER,PROJECT_COMPLETED,REQUESTING_CLOSING_FORM]}}) {
    aggregate {
      count
    }
  }
  
  incomingNewRequest: proposal_aggregate(where: {step: {_eq: ZERO}, oid: {_is_null: true}, inner_status: {_in: [ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR]}, outter_status: {_in: [ONGOING]}, cashier_id: {_is_null: true}, payments: {status: {_in: [reject_cheque,accepted_by_finance,done]}}}) {
    aggregate {
      count
    }
  }

  inprocessRequest: proposal_aggregate(where: {cashier_id: {_eq: $user_id}, inner_status: {_eq: ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR}, outter_status: {_eq: ONGOING}, finance_id: {_is_null: false}, state: {_eq: PROJECT_MANAGER}, step: {_eq: ZERO}}) {
    aggregate {
      count
    }
    nodes {
      payments(where: {status: {_in: [accepted_by_finance, reject_cheque, done]}}) {
        status
      }
    }
  }
}
`;
