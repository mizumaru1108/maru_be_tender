export const CreateProposalLog = `
  mutation CreateProposalLog($proposalLogPayload: proposal_log_insert_input = {}) {
    insert_proposal_log_one(object: $proposalLogPayload) {
      id
      proposal_id
      status
      updated_at 
    }
  }
`;

// GRAPHQL QUERY EXAMPLE
// {
// "object": {
//   "id":"xxxxx",
//   "reviewer_id": "xxx",
//   "proposal_id": "xxxxx",
//   "organization_id": "xxxx", // from clientid
//   "status": "ACCEPTED",
//   "assign": "xxxx", // asfasdf
//   "notes": "Notes Approve By CEO",
//   "procedures": "This is procedure From CEO"
// }
// }
