export const rejectProposalWLog = `mutation MyMutation($ceoRejectProposalPayload: proposal_log_insert_input = {}) {
  insert_proposal_log_one(object: $ceoRejectProposalPayload) {
    id
    proposal_id      
    status
    updated_at
  }
}`;

// PAYLOAD EXAMPLE
// {
//   "object": {
//     "id":"xxxxx",
//     "reviewer_id": "xxxxx",
//     "proposal_id": "xxxxx",
//     "organization_id": "xxxxx",
//     "status": "REJECTED",
//     "assign": "xxxxxxxx",
//     "notes": "Notes Project For Rejected",
//     "procedures": "Prosedures Project Rejected"
//   }
// }
