export const moderatorStatistics = `query moderatorStatistics($action: String = "") {
  acceptableRequest: proposal_aggregate(where: {proposal_logs: {action: {_eq: "accept"}}}) {
    aggregate {
      count
    }
  }
  rejectedRequest: proposal_aggregate(where: {proposal_logs: {action: {_eq: "reject"}}}) {
    aggregate {
      count
    }
  }
  pendingRequest: proposal_aggregate(where: {outter_status: {_eq: PENDING}}) {
    aggregate {
      count(columns: id)
    }
  }
  incomingNewRequest: proposal_aggregate(where: {outter_status: {_eq: ONGOING}}) {
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
