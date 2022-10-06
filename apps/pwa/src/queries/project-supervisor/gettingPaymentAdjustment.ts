export const gettingPaymentAdjustment = `query MyQuery2($supervisor_id: String = "") {
  proposal(where: {inner_status: {_eq: ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION}, _and: {supervisor_id: {_eq: $supervisor_id}}}) {
    id
    project_name
    payments {
      id
    }
    created_at
  }
}
`;
