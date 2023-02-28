export const getProposalLog = `query getProposalLog($proposal_id: String = "") {
  log: proposal_log(where: {proposal_id: {_eq: $proposal_id}, user_role: {_neq: "CLIENT"}}, order_by: {created_at: asc}) {
    id
    action
    message
    notes
    created_at
    user_role
    proposal: proposal {
      inclu_or_exclu
      does_an_agreement
      closing_report
      clasification_field
      clause
      support_outputs
      vat
      vat_percentage
      support_goal_id
      support_type
      number_of_payments_by_supervisor
      need_picture
      fsupport_by_supervisor
      updated_at
      created_at
      state
  }
  }
}
`;
