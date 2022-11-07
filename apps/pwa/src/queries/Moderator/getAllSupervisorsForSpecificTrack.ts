export const getAllSupervisorsForSpecificTrack = `query MyQuery($employee_path: project_tracks_enum = "") {
  users: user(where: {user_type_id: {_eq: PROJECT_SUPERVISOR}, _and: {is_active: {_eq: true}, _and: {employee_path: {_eq: $employee_path}}}}) {
    id
    name: employee_name
  }
}

`;
