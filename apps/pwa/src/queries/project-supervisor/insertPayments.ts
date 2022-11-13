export const insertPayments = `mutation insertPaymentsAndUpdateProposal($payments: [payment_insert_input!] = {}, $proposalId: String, $approveProposalPayloads: proposal_set_input = {}) {
  insert_payment(objects: $payments) {
    affected_rows
  }
  update_proposal(where: {id: {_eq: $proposalId}}, _set: $approveProposalPayloads) {
      returning {
        id
        inner_status
        outter_status
        state
      }
    }
}

`;
