export const gettingPaymentAdjustment = `query MyQuery($where: proposal_bool_exp = {}, $limit: Int = 10, $offset: Int = 0, $order_by: [proposal_order_by!] = {}) {
  data: proposal(where: $where, limit: $limit, offset: $offset, order_by: $order_by) {
    id
    project_name
    payments {
      id
    }
    created_at
  }
}
`;
