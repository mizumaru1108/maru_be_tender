export const deleteDraftProposal = `mutation MyMutation($id: String = "") {
  delete_proposal_by_pk(id: $id) {
    id
  }
}`;
