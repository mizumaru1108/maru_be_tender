export const gettingAllMyProposels = `query MyQuery($cashier_id: String = "") {
  proposal(where: {inner_status: {_eq: ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION}, _and: {cashier_id: {_eq: $cashier_id}}}) {
    id
    project_name
    project_idea
    created_at
    payments {
      id
    }
  }
}
`;
