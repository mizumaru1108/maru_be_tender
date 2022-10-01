export const acceptableRequest = `
query acceptableRequest {
  proposal_aggregate(where: {outter_status: {_in: COMPLETED}}) {
    aggregate {
      count(columns: outter_status)
    }
  }
}
`;
export const rejectedRequest = `
query rejectedRequest {
  proposal_aggregate(where: {outter_status: {_in: CANCELED}}) {
    aggregate {
      count(columns: outter_status)
    }
  }
}
`;

export const pendingRequest = `
query pendingRequest {
  proposal_aggregate(where: {outter_status: {_in: ONGOING}}) {
    aggregate {
      count(columns: project_name)
    }
  }
}
`;
export const incomingNewRequest = `
query incomingNewRequest {
  proposal_aggregate(where: {outter_status: {_in: PENDING}}) {
    aggregate {
      count(columns: outter_status)
    }
  }
}
`;
export const totalRequest = `
  query totalRequest {
    proposal_aggregate(where: {outter_status: {}}) {
      aggregate {
        count(columns: outter_status)
      }
    }
  }
`;
