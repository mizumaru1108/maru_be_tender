// export const getAllSupervisorsForSpecificTrack = `
// query getAllSupervisors($employee_path: project_tracks_enum = MOSQUES) {
//   users: user(where: {status_id: {_eq: ACTIVE_ACCOUNT}, _and: {roles: {user_type_id: {_eq: PROJECT_SUPERVISOR}}, _and: {employee_path: {_eq: $employee_path}, _or: {employee_path: {_is_null: false}}}}}) {
//     id
//     name: employee_name
//   }
// }

// `;

export const getAllSupervisorsForSpecificTrack = `
query getAllSupervisors($track_id: String = "") {
  users: user(where: {status_id: {_eq: ACTIVE_ACCOUNT}, _and: {roles: {user_type_id: {_eq: PROJECT_SUPERVISOR}}, track_id: {_eq: $track_id}}}) {
    id
    name: employee_name
  }
}
`;

// export const getAllSupervisorsForSpecificTrack = `
// query getAllSupervisors($track_id: String = "") {
//   users: user(where: {status_id: {_eq: ACTIVE_ACCOUNT}, _and: {track_id: {_eq: $track_id}}}) {
//     id
//     name: employee_name
//   }
// }

// `;
