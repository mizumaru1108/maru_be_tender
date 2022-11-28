export const getAllClient = `
query getAllClient {
  user(where: {roles: {user_type_id: {_eq: CLIENT}}}) {
    id
    client_data {
      created_at
      entity
      updated_at
    }
    status_id
  }
}
`;

export const getNewClient = `
  query getNewClient {
    client_data(where: {status: {_eq: WAITING_FOR_ACTIVATION}}) {
      status
      updated_at
      id
      created_at
      entity
    }
  }
`;

export const getActiveClient = `
  query getActiveClient {
    client_data(where: {status: {_eq: ACTIVE_ACCOUNT}}) {
      status
      updated_at
      id
      created_at
      entity
    }
  }
`;

export const getRevisedClient = `
  query getRevisedClient {
    client_data(where: {status: {_eq: REVISED_ACCOUNT}}) {
      status
      updated_at
      id
      created_at
      entity
    }
  }
`;

export const getSuspendedClient = `
  query getSuspendedClient {
    client_data(where: {status: {_eq: SUSPENDED_ACCOUNT}}) {
      status
      updated_at
      id
      created_at
      entity
    }
  }
`;
