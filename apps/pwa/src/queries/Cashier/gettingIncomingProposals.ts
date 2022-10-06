export const gettingIncomingProposals = `query MyQuery2 {
  proposal(where: {inner_status: {_eq: ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION}, _and: {cashier_id: {_is_null: true}}}) {
    project_name
    project_idea
    created_at
    payments {
      id
    }
  }
}
`;
