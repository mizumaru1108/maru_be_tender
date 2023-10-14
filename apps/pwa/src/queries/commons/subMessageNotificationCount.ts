export const messageNotificationCount = `
subscription getNewMessage($user_id: String = "") {
  message_aggregate(where: {receiver_id: { _eq: $user_id }, read_status: { _eq: false }}, order_by: {created_at: asc}) {
    aggregate {
      count
    }
  }
}
`;

export const messageListPopover = `
subscription getNewMessage($user_id: String = "") {
  message(where: {receiver_id: { _eq: $user_id }}, order_by: {created_at: desc}) {
    id
    room_id
    owner_id
    receiver_id
    content_type_id
    read_status
    content_title
    content
    attachment
    updated_at
    created_at
    sender_role_as
    receiver_role_as
    receiver {
      id
      is_online
      employee_name
      last_login
    }
    sender {
      id
      is_online
      employee_name
      last_login
    }
  }
}
`;
