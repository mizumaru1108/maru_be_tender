export const moderatorStatistics = `query moderatorStatistics {
  acceptableRequest: proposal_aggregate(where: {outter_status: {_in: COMPLETED}}) {
    aggregate {
      count(columns: outter_status)
    }
  }
  rejectedRequest: proposal_aggregate(where: {outter_status: {_in: CANCELED}}) {
    aggregate {
      count(columns: outter_status)
    }
  }
  pendingRequest: proposal_aggregate(where: {outter_status: {_in: PENDING}}) {
    aggregate {
      count(columns: project_name)
    }
  }
  incomingNewRequest: proposal_aggregate(where: {outter_status: {_in: ONGOING}}) {
    aggregate {
      count(columns: outter_status)
    }
  }
  totalRequest: proposal_aggregate(where: {outter_status: {}}) {
    aggregate {
      count(columns: outter_status)
    }
  }
}`;
