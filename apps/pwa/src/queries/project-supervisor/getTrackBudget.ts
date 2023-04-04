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

export const getTrackBudgetAdmin = `
query getTrackBudgetAdmin {
  track {
    name
    totalBudget: sections_aggregate{
      aggregate{
        sum{
          budget
        }
      }
    }
    totalReservedBudget: proposals_aggregate {
      aggregate {
        sum {
          fsupport_by_supervisor
        }
      }
    }
    totalSpendBudget: proposals {
      payments_aggregate(where: {status:{_eq: DONE}}) {
        aggregate {
          sum {
            payment_amount
          }
        }
      }
    }
  }
}
`;
// export const getTrackBudgetAdmin = `
// query getTrackBudgetAdmin {
//   track {
//     name
//     totalBudget: sections_aggregate{
//       aggregate{
//         sum{
//           budget
//         }
//       }
//     }
//     totalSpendBudget: proposals_aggregate(where: {inner_status: {_in: PROJECT_COMPLETED}}) {
//       aggregate {
//         sum {
//           fsupport_by_supervisor
//         }
//       }
//     }
//   }
// }
// `;

export const getOneTrackBudget = `
query getOneTrackBudget($track_id: project_tracks_enum) {
  track(where: {name: {_eq: $track_id}}){
    id
    name
    totalBudget: sections_aggregate{
      aggregate{
        sum{
          budget
        }
      }
    }
    totalSpendBudget: proposals_aggregate(where: {inner_status: {_in: PROJECT_COMPLETED}}) {
      aggregate {
        sum {
          fsupport_by_supervisor
        }
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
