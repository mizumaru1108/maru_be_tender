export const gettingAllMyProposals = `query MyQuery($finance_id: String = "") {
  proposal(where: {inner_status: {_eq: ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION}, _and: {finance_id: {_eq: $finance_id}}}) {
    id
    created_at
    project_idea
    project_name
  }
}
`;
