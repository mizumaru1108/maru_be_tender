// export const gettingIncomingRequests = `query MyQuery($limit: Int = 10, $order_by: [proposal_order_by!] = {}, $offset: Int = 0, $where: proposal_bool_exp = {}) {
//   data: proposal(limit: $limit, order_by: $order_by, offset: $offset, where: $where) {
//     id
//     created_at
//     project_idea
//     project_name
//   }
// }
// `;

export const gettingIncomingRequests = `query MyQuery($limit: Int = 10, $order_by: [proposal_order_by!] = {}, $offset: Int = 0, $where: proposal_bool_exp = {}) {
  proposal_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data: proposal(limit: $limit, order_by: $order_by, offset: $offset, where: $where) {
    id
    created_at
    project_idea
    state
    project_name
    user {
      employee_name
      client_data{
        entity
        created_at
      }
    }
    proposal_logs {
      reviewer {
        employee_name
      }
    }
  }
}
`;
