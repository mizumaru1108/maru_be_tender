// export const getAllClient = `
// query getAllClient {
//   user(where: {roles: {user_type_id: {_eq: CLIENT}}}) {
//     id
//     email
//     client_data {
//       created_at
//       entity
//       updated_at
//     }
//     status_id
//   }
// }
// `;

// export const getAllClient = `
// query getAllClient {
//   user(where: {roles: {user_type_id: {_eq: CLIENT}}}) {
//     id
//     email
//     status_id
//     created_at
//     employee_name
//     updated_at
//   }
// }
// `;

export const getAllClient = `
query getAllClient($_nin: [user_status_enum!] = ACTIVE_ACCOUNT) {
  user(where: {roles: {user_type_id: {_eq: CLIENT}}, client_data: {user: {status_id: {_nin: $_nin}}}}) {
    id
    email
    status_id
    created_at
    employee_name
    updated_at
    client_data {
      entity
      entity_mobile
      created_at
      updated_at
    }
  }
}


`;
