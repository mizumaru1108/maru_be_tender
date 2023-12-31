export const getListConversations = `
subscription ListConversationMessage($user_id: String = "") {
  room_chat(order_by: {messages_aggregate: {max: {created_at: desc}}}) {
    id
    correspondance_category_id
    messages_aggregate(where: {read_status: {_eq: false}, owner_id: {_neq: $user_id}}) {
      aggregate {
        count
      }
    }
    messages(limit: 1, order_by: {created_at: desc}) {
      id
      content
      content_title
      attachment
      created_at
      content_type_id
      owner_id
      sender_role_as
      receiver_id
      receiver_role_as
      read_status
      receiver {
        employee_name
        client_data {
          entity
        }
      }
      sender {
        employee_name
      }
    }
  }
}

`;
