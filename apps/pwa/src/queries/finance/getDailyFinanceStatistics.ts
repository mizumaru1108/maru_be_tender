export const getDailyFinanceStatistics = `query getDailyFinanceStatistics($first_date: timestamptz = "", $second_date: timestamptz = "") {
  incoming_requests: proposal_aggregate(where: {inner_status: {_eq: ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR}, _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}) {
    aggregate {
      count
    }
  }
}`;
