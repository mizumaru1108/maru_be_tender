export const getListConversations = `
subscription ListConversationMessage {
  room_chat(order_by: {messages_aggregate: {max: {created_at: desc}}}) {
    id
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
    }
    correspondance_category_id
    participant1 {
      id
      employee_name
      roles {
        role {
          title
        }
      }
      is_online
      last_login
    }
    participant2 {
      id
      employee_name
      roles {
        role {
          title
        }
      }
      is_online
      last_login
    }
  }
}
`;
