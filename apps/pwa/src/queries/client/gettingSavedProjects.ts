export const gettingSavedProjects = `query GettingSavedProjects($id: String = "") {
  proposal(where: {id: {_eq: $id}, _and: {step: {_eq: ZERO}}}) {
    id
  }
}
`;
