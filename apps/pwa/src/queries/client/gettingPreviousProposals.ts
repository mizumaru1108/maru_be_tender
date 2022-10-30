export const gettingPreviousProposals = `query MyQuery($id: String = "", $limit: Int = 10, $offset: Int = 0, $order_by: [proposal_order_by!] = {}, $tap_filter: proposal_request_enum = COMPLETED) {
  data: proposal(where: {submitter_user_id: {_eq: $id}, outter_status: {_eq: $tap_filter}}, limit: $limit, offset: $offset, order_by: $order_by) {
    id
    outter_status
    project_name
    project_idea
    created_at
  }
}
`;
