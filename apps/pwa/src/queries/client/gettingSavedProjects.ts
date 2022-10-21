export const gettingSavedProjects = `query GettingSavedProjects($id: String = "") {
  proposal(where: {_and: {step: {_neq: ZERO}}, submitter_user_id: {_eq: $id}}, limit: 2) {
    id
    project_idea
    project_name
    created_at
  }
}
`;
