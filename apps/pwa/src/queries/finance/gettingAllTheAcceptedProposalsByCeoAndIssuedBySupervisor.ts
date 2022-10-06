export const gettingAllTheAcceptedProposalsByCeoAndIssuedBySupervisor = `query MyQuery2 {
  proposal(where: {inner_status: {_eq: ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION}, _and: {finance_id: {_is_null: true}}}) {
    id
    created_at
    project_idea
    project_name
  }
}
`;
