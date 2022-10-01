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
query tableInfoUpdateRequest($reviewer_id: String!){
  client_log(where: {reviewer_id: {_eq: $reviewer_id}, status: {_eq: REVISED_ACCOUNT}}) {
    client_data {
      status
      id
      entity
      created_at
    }
  }
}
`;