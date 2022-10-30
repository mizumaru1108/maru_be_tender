export const numberOfRequests = `
query numberOfRequests {
  client_data_aggregate(where: {status: {_in: [WAITING_FOR_ACTIVATION, REVISED_ACCOUNT]}}) {
    aggregate {
      count(columns: status)
    }
  }
}`;

export const activePartners = `
query activePartners {
  client_data_aggregate(where: {status: {_eq: ACTIVE_ACCOUNT}}) {
    aggregate {
      count(columns: status)
    }
  }
}`;

export const rejectedPartners = `
query rejectedPartners {
  client_data_aggregate(where: {status: {_eq: CANCELED_ACCOUNT}}) {
    aggregate {
      count(columns: status)
    }
  }
}`;

export const suspendedPartners = `
query suspendedPartners {
  client_data_aggregate(where: {status: {_eq: SUSPENDED_ACCOUNT}}) {
    aggregate {
      count(columns: status)
    }
  }
}`;
