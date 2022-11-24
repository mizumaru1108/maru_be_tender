export const gettingPreviousRequests = `query MyQuery($limit: Int = 10, $offset: Int = 0, $order_by: [proposal_order_by!] = {}, $where: proposal_bool_exp = {}) {
  data: proposal(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {
    id
    created_at
    project_idea
    project_name
  }
}`;