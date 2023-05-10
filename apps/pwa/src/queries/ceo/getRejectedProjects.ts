export const getRejectedProjects = `
query getRejectedProjects($limit: Int = 10, $offset: Int = 10, $order_by: [proposal_order_by!] = {}, $where: proposal_bool_exp = {}) {
  data: proposal(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {
    id
    project_name
    project_number
    user {
      client_data {
        entity
        user_id
      }
    }
    project_track
    created_at
    track_id
  }
  total: proposal_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}
`;
