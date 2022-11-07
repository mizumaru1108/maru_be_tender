export const getTheSpentBudgetForSpecificProposal = `query MyQuery($proposal_id: String = "") {
  payment_aggregate(where: {proposal_id: {_eq: $proposal_id}, _and: {status: {_eq: DONE}}}) {
    aggregate {
      spent_budget: count(columns: created_at)
    }
  }
}
`;
