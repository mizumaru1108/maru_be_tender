export const getNonClientDetails = `query getNonClientDetails($userId: String = "") {
  profile: user_by_pk(id: $userId) {
    email
    mobile_number
    employee_name
  }
}
`;
