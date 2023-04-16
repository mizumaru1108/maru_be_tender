export const getOnePayments = `
query MyQuery($id: String = "") {
  proposal_by_pk(id: $id) {
    payments(order_by: {order: asc}) {
      cheques {
        deposit_date
        id
        number
        payment_id
        transfer_receipt
      }
      id
      order
      payment_amount
      payment_date
      status
    }
  }
}


`;
