export const getDailyTrackBudget = `
query getDailyTrackTotalBudget {
  totalBudget: proposal_aggregate {
    aggregate {
      sum {
        amount_required_fsupport
      }
    }
  }
  totalAcceptingBudget: proposal_aggregate {
    aggregate {
      sum {
        fsupport_by_supervisor
      }
    }
  }
}
`;

// `
// query getDailyTrackTotalBudget($first_date: timestamptz = "", $second_date: timestamptz = "") {
//   totalBudget: proposal(where: { _and: {updated_at: {_gte: $first_date}, _and: {updated_at: {_lt: $second_date}}}}, distinct_on: id) {
//     amount_required_fsupport
//   }
// }
// `;
