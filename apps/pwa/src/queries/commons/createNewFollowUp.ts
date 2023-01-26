export const createNewFollowUp = `mutation createNewFollowUp($object: proposal_follow_up_insert_input = {}) {
  insert_proposal_follow_up_one(object: $object) {
    id
    content
    attachments
    created_at
    user {
      employee_name
      roles {
        role: user_type_id
      }
    }
  }
}

`;
