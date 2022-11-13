export const gettingIncomingRequests = `query MyQuery($limit: Int = 10, $order_by: [proposal_order_by!] = {}, $offset: Int = 0, $where: proposal_bool_exp = {}) {
  data: proposal(limit: $limit, order_by: $order_by, offset: $offset, where: $where) {
    id
    created_at
    project_idea
    project_name
  }
}
`;
