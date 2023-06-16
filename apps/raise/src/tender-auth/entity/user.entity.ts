export class UserEntity {
  id: string;
  employee_name: string;
  mobile_number: string;
  email: string;
  created_at: Date = new Date();
  updated_at: Date = new Date();
  employee_path: string;
  last_login?: Date;
  status_id: string;
  address: string;
  google_session: any; // jsonb
  is_online: boolean;
  track_id?: string;
  uid?: number;
  // appointment_appointment_employee_idTouser                                   appointment[]                 @relation("appointment_employee_idTouser")
  // appointment_appointment_user_idTouser                                       appointment[]                 @relation("appointment_user_idTouser")
  // bank_information                                                            bank_information[]
  // client_data                                                                 client_data?                  @relation("client_data_user_idTouser")
  // client_log                                                                  client_log[]
  // contact_us_contact_us_receiver_idTouser                                     contact_us[]                  @relation("contact_us_receiver_idTouser")
  // contact_us_contact_us_sender_idTouser                                       contact_us[]                  @relation("contact_us_sender_idTouser")
  // edit_requests_edit_requests_reviewer_idTouser                               edit_requests[]               @relation("edit_requests_reviewer_idTouser")
  // edit_requests_edit_requests_user_idTouser                                   edit_requests[]               @relation("edit_requests_user_idTouser")
  // email_record_email_record_receiver_idTouser                                 email_record[]                @relation("email_record_receiver_idTouser")
  // email_record_email_record_sender_idTouser                                   email_record[]                @relation("email_record_sender_idTouser")
  // employees_permissions_employees_permissionsTouser                           employees_permissions[]
  // file_manager                                                                file_manager[]
  // message_messageTouser                                                       message[]
  // message_message_receiver_idTouser                                           message[]                     @relation("message_receiver_idTouser")
  // notifications                                                               notification[]                @relation("notification_user_idTouser")
  // proposal_proposal_project_manager_idTouser                                  proposal[]                    @relation("proposal_project_manager_idTouser")
  // proposals                                                                   proposal[]
  // proposal_proposal_supervisor_idTouser                                       proposal[]                    @relation("proposal_supervisor_idTouser")
  // proposal_asked_edit_request_proposal_asked_edit_request_sender_idTouser     proposal_asked_edit_request[] @relation("proposal_asked_edit_request_sender_idTouser")
  // proposal_asked_edit_request_proposal_asked_edit_request_supervisor_idTouser proposal_asked_edit_request[] @relation("proposal_asked_edit_request_supervisor_idTouser")
  // proposal_edit_request_proposal_edit_request_reviewer_idTouser               proposal_edit_request[]       @relation("proposal_edit_request_reviewer_idTouser")
  // proposal_edit_request_proposal_edit_request_user_idTouser                   proposal_edit_request[]       @relation("proposal_edit_request_user_idTouser")
  // proposal_follow_up_proposal_follow_up_user_idTouser                         proposal_follow_up[]          @relation("proposal_follow_up_user_idTouser")
  // proposal_log                                                                proposal_log[]
  // room_chat_as_participant1                                                   room_chat[]                   @relation("room_chat_participant1_user_idTouser")
  // room_chat_as_participant2                                                   room_chat[]                   @relation("room_chat_participant2_user_idTouser")
  // schedule                                                                    schedule[]
  // employee_track                                                              project_tracks?               @relation(fields: [employee_path], references: [id], onDelete: NoAction, onUpdate: NoAction)
  // track                                                                       track?                        @relation(fields: [track_id], references: [id], onDelete: Cascade)
  // status                                                                      user_status                   @relation(fields: [status_id], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "user_user_status_id_fkey")
  // roles                                                                       user_role[]
  // user_status_log_userTouser_status_log_account_manager_id                    user_status_log[]             @relation("userTouser_status_log_account_manager_id")
  // user_status_log_userTouser_status_log_user_id                               user_status_log[]             @relation("userTouser_status_log_user_id")
}
