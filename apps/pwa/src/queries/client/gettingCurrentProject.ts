export const gettingCurrentProject = `query GettingCurrentProject($id: String = "") {
  proposal(where: {submitter_user_id: {_eq: $id}, _and: {outter_status: {_eq: PENDING}, _and: {step: {_eq: ZERO}}}}) {
    id
    project_name
    created_at
    amount_required_fsupport
    project_idea
    outter_status
  }
}
`;
