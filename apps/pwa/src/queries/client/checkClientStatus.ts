export const checkClientStatus = `query CheckClientStatus($id: String!) {
  user: user_by_pk(id: $id) {
    status: status_id
  }
}
`;
