export const gettingPreviousRequests = `query gettingIncomingRequests($where: proposal_bool_exp = {}, $limit: Int = 10, $offset: Int = 0, $order_by: [proposal_order_by!] = {}) {
  data: proposal(where: $where, limit: $limit, offset: $offset, order_by: $order_by) {
    id
    created_at
    project_name
    user {
      employee_name
    }
    state
    outter_status
  }
}`;