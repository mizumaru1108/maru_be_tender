// // old version
// export const getDailyFinanceStatistics = `query getDailyFinanceStatistics($first_date: timestamptz = "", $second_date: timestamptz = "") {
//   incoming_requests: proposal_aggregate(where: {inner_status: {_eq: ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}) {
//     aggregate {
//       count
//     }
//   }
// }`;

// new version
export const getDailyFinanceStatistics = `
query MyQuery($user_id: String = "") {

  acceptableRequest: proposal_aggregate(where: {step: {_eq: ZERO}, oid: {_is_null: true}, _or: [{finance_id: {_eq: $user_id}}, {finance_id: {_is_null: true}}], payments: {status: {_in: [accepted_by_finance,done]}}}) {
    aggregate {
      count
    }
  }
  
  incomingNewRequest: proposal_aggregate(where: {step: {_eq: ZERO}, oid: {_is_null: true}, inner_status: {_in: [ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR]}, outter_status: {_in: [ONGOING]}, payments: {status: {_in: [accepted_by_project_manager, uploaded_by_cashier]}}, finance_id: {_eq: $user_id}}) {
    aggregate {
      count
    }
  }
}
`;
