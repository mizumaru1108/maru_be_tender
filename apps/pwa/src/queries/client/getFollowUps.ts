export const getFollowUps = `query MyQuery($proposal_id: String = "") {
  proposal_follow_up(where: {proposal_id: {_eq: $proposal_id}}) {
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
