export const getRejectedProjects = `query getRejectedProjects($limit: Int = 10, $offset: Int = 10, $order_by: [proposal_order_by!] = {}, $where: proposal_bool_exp = {}) {
  data: proposal(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {
    id
    project_name
    user {
      client_data {
        entity
      }
    }
    project_track
    created_at
  }
  total: proposal_aggregate(where: {outter_status: {_eq: CANCELED}}) {
    aggregate {
      count
    }
  }
}
`;
