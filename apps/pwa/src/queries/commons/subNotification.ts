// export const subNotification = `subscription subNotification ($user_id: String = "") {
//   notification (where: {user_id: {_eq: $user_id}}, order_by: {created_at: desc}){
//     id
//     subject
//     content
//     read_status
//     created_at
//     message {
//       id
//       content_type_id
//       content_title
//       content
//       created_at
//       attachment
//     read_status
//     room_id
//       sender {
//         email
//       }
//     }
//     proposal {
//       id
//     }
//     appointment {
//       id
//       calendar_url
//       meeting_url
//       client {
//         id
//         employee_name
//         email
//         created_at
//         client_data {
//           entity
//           authority
//         }
//       }
//     }
//   }
// }`;

export const subNotification = `
subscription subNotification ($user_id: String = "") {
  notification (where: {user_id: {_eq: $user_id}, shown: {_eq: true}}, order_by: {created_at: desc}){
    id
    proposal_id
    appointment_id
    subject
    content
    read_status
    shown
    created_at
    type
    specific_type
    message {
      id
      content_type_id
      content_title
      content
      created_at
      attachment
    read_status
    room_id
      sender {
        email
      }
    }
    proposal {
      id
      inner_status
      outter_status
      state
      payments {
        id
        payment_date
        status
        cheques {
          transfer_receipt
          id
        }
      }
    }
  }
}
`;

export const subNotificationClient = `
subscription subNotificationClient ($user_id: String = "") {
  notification (where: {user_id: {_eq: $user_id}, shown: {_eq: true}}, order_by: {created_at: desc}){
    id
    proposal_id
    appointment_id
    subject
    content
    read_status
    shown
    created_at
    type
    specific_type
    message {
      id
      content_type_id
      content_title
      content
      created_at
      attachment
    read_status
    room_id
      sender {
        email
      }
    }
    proposal {
      id
      inner_status
      outter_status
      payments {
        id
        payment_date
        status
        cheques {
          transfer_receipt
          id
        }
      }
    }
    appointment {
      id
      calendar_url
      meeting_url
      client {
        id
        employee_name
        email
        created_at
        client_data {
          entity
          authority
        }
      }
    }
  }
}
`;

export const notifAccManager = `subscription notifAccManager ($user_id: String = "") {
  notification (where: {user_id: {_eq: $user_id}, shown: {_eq: true}}, order_by: {created_at: desc}){
    id
    proposal_id
    appointment_id
    subject
    content
    read_status
    shown
    created_at
    type
    specific_type
    message {
      id
      content_type_id
      content_title
      content
      created_at
      attachment
    read_status
    room_id
      sender {
        email
      }
    }
    proposal {
      id
      inner_status
      outter_status
      state
    }
  }
}`;
