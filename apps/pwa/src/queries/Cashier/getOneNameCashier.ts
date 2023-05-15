export const getOneNameCashier = `
query MyQuery($id: String = "") {
  user_by_pk(id: $id) {
    employee_name
  }
}
`;
