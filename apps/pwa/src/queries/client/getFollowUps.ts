export const getFollowUps = `query getFollowUps($where: proposal_follow_up_bool_exp = {}) {
  proposal_follow_up(where: $where) {
    id
    action
    file
    user_id
    employee {
      employee_name
      roles {
        role: user_type_id
      }
    }
    created_at
  }
}

`;
