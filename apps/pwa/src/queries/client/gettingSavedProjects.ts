export const gettingSavedProjects = `query GettingSavedProjects($limit: Int = 2, $offset: Int = 0, $order_by: [proposal_order_by!] = {}, $where: proposal_bool_exp = {step: {_neq: ZERO}}) {
  data: proposal(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {
    id
    project_idea
    project_name
    created_at
    inner_status
    project_number
    user {
      client_data{
        created_at
      }
    }
  }
}
`;
