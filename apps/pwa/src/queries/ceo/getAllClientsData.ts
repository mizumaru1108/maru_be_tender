export const allClientData = `query allClientData ($limit: Int = 10, $offset: Int = 0, $_eq: user_type_enum = CLIENT, , $order_by: [user_order_by!] = {employee_name: "asc"}) {
  user(limit: $limit, offset: $offset, where: {roles: {user_type_id: {_eq: $_eq}}}, order_by: $order_by) {
    id
    email
    employee_name
    mobile_number
    client_data {
      governorate
    }
    proposals_aggregate {
      aggregate {
        count
      }
    }
  }


  total: user_aggregate (where: {roles: {user_type_id: {_eq: $_eq}}}) {
    aggregate {
      count
    }
  }
}`;
