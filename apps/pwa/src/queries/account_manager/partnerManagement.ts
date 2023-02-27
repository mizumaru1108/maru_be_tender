export const getAllClient = `
query getAllClient {
  user(where: {roles: {user_type_id: {_eq: CLIENT}}}) {
    id
    email
    client_data {
      created_at
      entity
      updated_at
    }
    status_id
  }
}
`;
