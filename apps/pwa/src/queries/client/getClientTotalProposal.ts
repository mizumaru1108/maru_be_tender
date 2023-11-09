export const getClientTotalProposal = `
query MyQuery($submitter_user_id: String = "", $_lte: timestamptz = "", $_gte: timestamptz = "") {
  proposal_aggregate(where: {submitter_user_id: {_eq: $submitter_user_id}, _and: {created_at: {_lte: $_lte, _gte: $_gte}}}) {
    aggregate {
      count(columns: outter_status)
    }
  }
}
`;
