export const CreateProposel = `
  mutation ($createdProposel: [proposal_insert_input!] = {}) {
    insert_proposal(objects: $createdProposel) {
      affected_rows
    }
  }
`;
