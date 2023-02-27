export const tableNewRequest = `
query tableNewRequest {
  user(where: {roles: {user_type_id: {_eq: CLIENT}}, status_id: {_eq: WAITING_FOR_ACTIVATION}}) {
    id
    email
    client_data {
      entity
      created_at
    }
  }
}
`;

export const tableInfoUpdateRequest = `
query tableInfoUpdateRequest {
  user(where: {roles: {user_type_id: {_eq: CLIENT}}, status_id: {_eq: REVISED_ACCOUNT}}) {
    id
    email
    client_data {
      entity
      created_at
    }
  }
}
`;

export const getEditRequestProfileList = `
query MyQuery {
  edit_requests {
    created_at
    status_id
    id
    user {
      client_data {
        entity
      }
    }
  }
}
`;
