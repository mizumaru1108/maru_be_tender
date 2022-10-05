export const updatePayment = `mutation MyMutation2($id: String = "", $newState: payment_set_input = {}) {
  update_payment_by_pk(pk_columns: {id: $id}, _set: $newState) {
    id
  }
}
`;
