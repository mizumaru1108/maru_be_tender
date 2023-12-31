export const clientMainPage = `
query clientMainPage {
  current_projects: proposal(where: {_and: [
    { step: { _neq: FIRST } },
    { step: { _neq: SECOND } },
  { step: { _neq: THIRD } },
  { step: { _neq: FOURTH } },
      { step: { _neq: FIFTH } },
    { outter_status: { _eq: ONGOING } }
  ]}, order_by: {created_at: desc}) {
  id
  created_at
  project_idea
  project_name
  amount_required_fsupport
  fsupport_by_supervisor
  project_number
  outter_status
}
  draft_projects: proposal(where: { step: { _neq: ZERO } }, order_by: {created_at: desc}, limit: 4, offset: 0) {
    id
    created_at
    project_idea
    project_name
    amount_required_fsupport
    project_number
  }
  pending_client_projects: proposal(where: {outter_status: {_eq: PENDING}, _and: {step: {_eq: ZERO}}}, order_by: {created_at: desc}, limit: 10) {
    id
    project_name
    created_at
    project_idea
    outter_status
    project_number
  }
  completed_client_projects:proposal(where: {outter_status: {_eq: COMPLETED}, _and: {step: {_eq: ZERO}}}, order_by: {created_at: desc}, limit: 10) {
    id
    project_name
    created_at
    project_idea
    outter_status
    project_number
  }
  all_client_projects:proposal(where: {step: {_eq: ZERO}}, order_by: {created_at: desc}, limit: 10) {
    id
    project_name
    created_at
    project_idea
    outter_status
    project_number
  }
    amandement_proposal:proposal(where: {outter_status: {_eq: ON_REVISION}, _and: {step: {_eq: ZERO}}}, order_by: {created_at: desc}, limit: 10) {
    id
  }
}
`;
