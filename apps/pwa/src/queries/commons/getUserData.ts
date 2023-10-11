export const getUserData = `
query GetUserData($id: String!) {
  user: user_by_pk(id: $id) {
    track_id
    email
    employee_name
    id
    mobile_number
  }
}
`;
