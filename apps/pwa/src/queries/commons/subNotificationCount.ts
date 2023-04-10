export const notificationCount = `
subscription notificationCount($user_id: String = "") {
  notification_aggregate(where: {user_id: {_eq: $user_id}, read_status: {_eq: false}}, order_by: {created_at: desc}) {
    aggregate {
      count
    }
  }
}
`;
