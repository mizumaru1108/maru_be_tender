export const getClientTotalProposal = `
query MyQuery($submitter_user_id: String = "") {
  proposal_aggregate(where: {submitter_user_id: {_eq: $submitter_user_id}}) {
    aggregate {
      count(columns: outter_status)
    }
  }
}
`;
