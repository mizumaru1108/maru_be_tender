export const createNewFollowUp = `mutation MyMutation($object: proposal_follow_up_insert_input = {}) {
  insert_proposal_follow_up_one(object: $object) {
    id
  }
}
`;
