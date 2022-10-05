export const incomingRequest = `
query MyQuery {
  proposal(where: {inner_status: {_eq: ACCEPTED_BY_CEO_FOR_PAYMENT_SPESIFICATION}}) {
     id
     created_at
     project_idea
     project_name
     payments {
       id
       payment_amount
       payment_date
     }
   }
 }
`;
export const paymentReq = `
mutation MyMutation($objects: [cheque_insert_input!] = {}) {
  insert_cheque(objects: $objects) {
    affected_rows
  }
}
`;
