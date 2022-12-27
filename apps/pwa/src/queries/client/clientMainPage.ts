export const clientMainPage = `query clientMainPage {
  current_projects: proposal(where: {outter_status: {_eq: ONGOING}}) {
    id
    created_at
    project_idea
    project_name
    amount_required_fsupport
    fsupport_by_supervisor
  }
  draft_projects: proposal(where: { step: { _neq: ZERO } }, limit: 4, offset: 0) {
    id
    created_at
    project_idea
    project_name
    amount_required_fsupport
  }
  pending_client_projects: proposal(where: {outter_status: {_eq: PENDING}, _and: {step: {_eq: ZERO}}}, limit: 10) {
    id
    project_name
    created_at
    project_idea
    outter_status
  }
  completed_client_projects:proposal(where: {outter_status: {_eq: COMPLETED}, _and: {step: {_eq: ZERO}}}, limit: 10) {
    id
    project_name
    created_at
    project_idea
    outter_status
  }
}
`;
