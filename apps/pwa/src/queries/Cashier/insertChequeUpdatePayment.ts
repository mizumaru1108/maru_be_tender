export const insertChequeUpdatePayment = `mutation MyMutation($cheque: cheque_insert_input = {}, $paymentId: String = "", $newState: payment_set_input = {}) {
  insert_cheque_one(object: $cheque) {
    id
  }
  update_payment_by_pk(pk_columns: {id: $paymentId}, _set: $newState) {
    id
  }
}
`;
