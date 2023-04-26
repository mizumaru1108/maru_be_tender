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

/**
 * Old track budget totalSpend
 * totalSpendBudget: proposals {
      payments_aggregate(where: {status:{_eq: done}}) {
        aggregate {
          sum {
            payment_amount
          }
        }
      }
    }
 */

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
    totalReservedBudget: proposals_aggregate(where: {inner_status: {_nin: [ACCEPTED_BY_MODERATOR,PROJECT_COMPLETED,REJECTED,REJECTED_BY_SUPERVISOR]}}) {
      aggregate {
        sum {
          fsupport_by_supervisor
        }
      }
    }
    totalSpendBudget: proposals {
      payments_aggregate(where: {status:{_eq: done}}) {
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

export const getOneTrackBudget = `
query getOneTrackBudget($track_id: String!) {
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
    totalReservedBudget: proposals_aggregate(where: {inner_status: {_nin: [ACCEPTED_BY_MODERATOR,PROJECT_COMPLETED,REJECTED,REJECTED_BY_SUPERVISOR]}}) {
      aggregate {
        sum {
          fsupport_by_supervisor
        }
      }
    }
    totalSpendBudget: proposals(where: {inner_status: {_nin: [ACCEPTED_BY_MODERATOR,REJECTED,REJECTED_BY_SUPERVISOR]}}) {
      payments_aggregate(where: {status:{_eq: done}}) {
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
