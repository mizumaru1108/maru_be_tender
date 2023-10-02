export const numberOfRequests = `
query numberOfRequests {
  user_aggregate(where: {roles: {user_type_id: {_eq: CLIENT}}, _and: {status_id: {_eq: WAITING_FOR_ACTIVATION}}}) {
    aggregate {
      count(columns: created_at)
    }
  }
}
`;

export const activePartners = `
query activePartners {
  user_aggregate(where: {roles: {user_type_id: {_eq: CLIENT}}, _and: {status_id: {_eq: ACTIVE_ACCOUNT}}}) {
    aggregate {
      count(columns: created_at)
    }
  }
}`;

export const rejectedPartners = `
query rejectedPartners {
  user_aggregate(where: {roles: {user_type_id: {_eq: CLIENT}}, _and: {status_id: {_in: [DELETED, CANCELED_ACCOUNT]}}}) {
    aggregate {
      count(columns: created_at)
    }
  }
}

`;

export const suspendedPartners = `
query suspendedPartners {
  user_aggregate(where: {roles: {user_type_id: {_eq: CLIENT}}, _and: {status_id: {_eq: SUSPENDED_ACCOUNT}}}) {
    aggregate {
      count(columns: created_at)
    }
  }
}`;
