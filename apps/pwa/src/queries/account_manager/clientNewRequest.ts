export const tableNewRequest = `
  query tableNewRequest {
    client_data(where: {status: {_eq: WAITING_FOR_ACTIVATION}}) {
      status
      id
      created_at
      entity
    }
  }
`;

export const tableInfoUpdateRequest = `
  query tableInfoUpdateRequest {
    client_data(where: {status: {_in: REVISED_ACCOUNT}}) {
      status
      id
      created_at
      entity
    }
  }
`;