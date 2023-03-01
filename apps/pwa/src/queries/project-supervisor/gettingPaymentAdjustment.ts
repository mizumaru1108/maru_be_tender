// export const gettingPaymentAdjustment = `query MyQuery($where: proposal_bool_exp = {}, $limit: Int = 10, $offset: Int = 0, $order_by: [proposal_order_by!] = {}) {
//   data: proposal(where: $where, limit: $limit, offset: $offset, order_by: $order_by) {
//     id
//     project_name
//     payments {
//       id
//     }
//     created_at
//   }
// }
// `;

export const gettingPaymentAdjustment = `query MyQuery($where: proposal_bool_exp = {}, $limit: Int = 10, $offset: Int = 0, $order_by: [proposal_order_by!] = {}) {
  proposal_aggregate(where: $where) {
    aggregate {
      count
    }
  }
  data: proposal(where: $where, limit: $limit, offset: $offset, order_by: $order_by) {
    id
    updated_at
    created_at
    project_name
    state
    user {
      employee_name
      client_data{
        entity
        created_at
      }
    }
    payments {
      id
    }
    proposal_logs {
      reviewer {
        employee_name
      }
      created_at
    }
  }
}
`;
