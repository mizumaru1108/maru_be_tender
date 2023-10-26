export const getSummaryClientProposal = `
query getDailyClientStatistics {
  totalProposal: proposal_aggregate {
    aggregate {
      count(distinct: true)
    }
  }
  totalBudget: proposal_aggregate {
    aggregate {
      sum {
        amount_required_fsupport
      }
    }
  }
  totalAcceptingBudget: proposal_aggregate(where: {proposal_logs: {_and: {action: {_in: "accept"}, user_role: {_in: "CEO"}}}}) {
    aggregate {
      sum {
        fsupport_by_supervisor
      }
    }
  }
}

`;
