export const gettingSavedProjects = `query GettingSavedProjects($id: String = "") {
  proposal(where: {id: {_eq: $id}, _and: {step: {_neq: ZERO}}}) {
    id
  }
}
`;
