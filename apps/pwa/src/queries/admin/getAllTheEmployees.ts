export const getAllTheEmployees = `
query getAllTheEmployees {
  user(where: {roles: {user_type_id: {_neq: ADMIN}, _and: {user_type_id: {_neq: CLIENT}}}}) {
    id
    email
    name: employee_name
    activation: status_id
    permissions: roles {
      role: user_type_id
    }
  }
}
`;

export const getOneEmployee = `
query getOneEmployee($id: String = "") {
  data: user_by_pk(id: $id) {
    email
    employee_name
    employee_path
    mobile_number
    user_role: roles {
      role: user_type_id
    }
  }
}
`;
