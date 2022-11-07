export const getAllTheEmployees = `query MyQuery {
  users: user(where: {user_type_id: {_neq: CLIENT}, _and: {user_type_id: {_neq: ADMIN}}}) {
    id
    email
    name: employee_name
    activation: is_active
    permissions: user_type_id
  }
}
`;
