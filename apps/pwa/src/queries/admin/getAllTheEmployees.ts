export const getAllTheEmployees = `query getAllTheEmployees {
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
