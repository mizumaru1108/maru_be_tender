export const allClientData = `query allClientData ($limit: Int = 10, $offset: Int = 0, $order_by: [client_data_order_by!] = {}) {
  client_data (limit: $limit, offset: $offset, order_by: $order_by){
    id
    entity
    data_entry_mail
    data_entry_mobile
    user_id
    governorate
    user {
      proposals_aggregate {
      aggregate {
        count
      }
    }
  }
}

  total: client_data_aggregate {
    aggregate {
      count
    }
  }
}`;
