// export const gettingIncomingRequests = `query gettingIncomingRequests($where: proposal_bool_exp = {}, $limit: Int = 10, $offset: Int = 0, $order_by: [proposal_order_by!] = {}) {
//   data: proposal(where: $where, limit: $limit, offset: $offset, order_by: $order_by) {
//     id
//     created_at
//     project_name
//     user {
//       employee_name
//     }
//     state
//   }
// }
// `;
export const gettingIncomingRequests = `
query gettingIncomingRequests($where: proposal_bool_exp = {}, $limit: Int = 10, $offset: Int = 0, $order_by: [proposal_order_by!] = {}) {
  proposal_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data: proposal(where: $where, limit: $limit, offset: $offset, order_by: $order_by) {
    id
    created_at
    updated_at
    project_name
    state
    project_number
    user {
      employee_name
      client_data{
        entity
      }
    }
    proposal_logs {
      created_at
    }
  } 
}
`;
