export const insertPayments = `mutation MyMutation($payments: [payment_insert_input!] = {}) {
  insert_payment(objects: $payments) {
    affected_rows
  }
}
`;
