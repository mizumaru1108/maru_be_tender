export const getProposalLog = `query getProposalLog($proposal_id: String = "") {
  log: proposal_log(where: {proposal_id: {_eq: $proposal_id}}) {
    id
    action
    message
    notes
    user_role
  }
}

`;
