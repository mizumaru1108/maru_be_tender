export const getDailyTrackBudget = `
query getDailyTrackTotalBudget($first_date: timestamptz = "", $second_date: timestamptz = "") {
  totalBudget: proposal(where: { _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}, distinct_on: id) {
    amount_required_fsupport
  }
}
`;
