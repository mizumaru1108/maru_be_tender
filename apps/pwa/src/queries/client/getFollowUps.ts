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

export const getFollowUpsEmployee = `query getFollowUpsEmployee ($proposal_id: String = "") {
  client_follow_ups: proposal_follow_up(where: {proposal_id: {_eq: $proposal_id}, _and: {employee_id: {_is_null: true}}}) {
    id
    file
    action
    user {
      employee_name
    }
    created_at
    user_id
  }
  employee_follow_ups: proposal_follow_up(where: {user_id: {_is_null: true}, _and: {proposal_id: {_eq: $proposal_id}}}) {
    id
    file
    action
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

export const getFollowUpsClient = `query getFollowUpsEmployee($proposal_id: String = "") {
  proposal_follow_up(where: {proposal_id: {_eq: $proposal_id}}) {
    id
    file
    action
    user {
      employee_name
    }
    created_at
  }
}

`;
