export const getListMessageByRoom = `
subscription getListMessageByRoom($activeConversationId: String!) {
  message(where: {room_id: {_eq: $activeConversationId}}, order_by: {created_at: asc}) {
    id
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
