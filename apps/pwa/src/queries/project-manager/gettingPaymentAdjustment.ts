export const gettingPaymentAdjustment = `query MyQuery2($project_manager_id: String = "") {
  proposal(where: {inner_status: {_eq: ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION}, _and: {project_manager_id: {_eq: $project_manager_id}}}) {
    id
    project_name
    payments {
      id
    }
    created_at
  }
}`;
