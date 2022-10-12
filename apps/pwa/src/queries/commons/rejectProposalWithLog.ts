export const rejectProposalWLog = `
  mutation MyMutation($proposalLogPayload: proposal_log_insert_input = {}, $proposalId: String = "", $updateProposalStatusAndStatePayloads: proposal_set_input = {}) {
    insert_proposal_log_one(object: $proposalLogPayload) {
      id
      proposal_id
      updated_at
    }
    update_proposal_by_pk(pk_columns: {id: $proposalId}, _set: $updateProposalStatusAndStatePayloads) {
      id
      inner_status
      outter_status
      state
    }
  }
`;

// PAYLOAD EXAMPLE you can see at types.ts file for refrences.
// "proposalLogPayload": {
//   "id": "xxxxx", // generated from nanoid()
//   "proposal_id": "xxx", // from the proposal it self
//   "reviewer_id": "xxxx", // user id of current user (moderator/ceo/etc ...)
//   "organization_id": "xxxx", // client id on the proposal data
//   "inner_status": "REJECTED_BY_CEO_WITH_COMMENT",
//   "outter_status": "CANCELED",
//   "state": "CEO", // roles
//   "procedures": "alooo ini ceo testing nge reject"
// }
// {
//   "updateProposalStatusAndStatePayloads": {
//      "inner_status": "REJECTED",
//      "outter_status": "CANCELED"
//      "state": "CEO"
//   },
//   "proposalId": "xxxx"
// }
