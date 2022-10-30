export const gettingSavedProjects = `query GettingSavedProjects($id: String = "", $limit: Int = 2, $offset: Int = 0, $order_by: [proposal_order_by!] = {}) {
  data: proposal(where: {_and: {step: {_neq: ZERO}}, submitter_user_id: {_eq: $id}}, limit: $limit, offset: $offset, order_by: $order_by) {
    id
    project_idea
    project_name
    created_at
    inner_status
  }
}
`;
