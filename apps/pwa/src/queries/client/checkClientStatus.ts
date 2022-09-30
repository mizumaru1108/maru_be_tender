export const checkClientStatus = `query CheckClientStatus($id: String!) {
  user_by_pk(id: $id) {
    client_data {
      status
    }
  }
}`;
