export const getFollowUps = `query MyQuery($where: proposal_follow_up_bool_exp = {}) {
  proposal_follow_up(where: $where) {
    id
    action
    file
    user_id
    employee {
      employee_name
      user_type_id
    }
    created_at
  }
}
`;
