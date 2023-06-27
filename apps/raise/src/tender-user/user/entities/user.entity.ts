import { BankInformationEntity } from '../../../bank/entities/bank-information.entity';
import { FileManagerEntity } from '../../../tender-file-manager/entities/file-manager.entity';
import { ProposalEntity } from '../../../tender-proposal/tender-proposal/entities/proposal.entity';
import { TrackEntity } from '../../../tender-track/track/entities/track.entity';
import { ClientDataEntity } from '../../client/entities/client-data.entity';
import { UserRoleEntity } from './user-role.entity';
import { UserStatusEntity } from './user-status.entity';

export class UserEntity {
  id: string;
  employee_name?: string | null;
  mobile_number?: string | null;
  email: string;
  created_at?: Date | null = new Date();
  updated_at?: Date | null = new Date();
  employee_path?: string | null;
  last_login?: Date | null = null;
  status_id: string;
  address?: string | null = null;
  google_session: any; // jsonb
  is_online?: boolean | null = null;
  track_id?: string | null = null;
  uid?: number | null = null;
  bank_information?: BankInformationEntity[];
  roles: UserRoleEntity[];
  file_manager?: FileManagerEntity[];
  track?: TrackEntity;
  proposal_proposal_project_manager_idTouser?: ProposalEntity[];
  proposals?: ProposalEntity[];
  proposal_proposal_supervisor_idTouser?: ProposalEntity[];
  client_data?: ClientDataEntity;
  status: UserStatusEntity;
  // appointment_appointment_employee_idTouser                                   appointment[]                 @relation("appointment_employee_idTouser")
  // appointment_appointment_user_idTouser                                       appointment[]                 @relation("appointment_user_idTouser")
  // client_log                                                                  client_log[]
  // contact_us_contact_us_receiver_idTouser                                     contact_us[]                  @relation("contact_us_receiver_idTouser")
  // contact_us_contact_us_sender_idTouser                                       contact_us[]                  @relation("contact_us_sender_idTouser")
  // edit_requests_edit_requests_reviewer_idTouser                               edit_requests[]               @relation("edit_requests_reviewer_idTouser")
  // edit_requests_edit_requests_user_idTouser                                   edit_requests[]               @relation("edit_requests_user_idTouser")
  // email_record_email_record_receiver_idTouser                                 email_record[]                @relation("email_record_receiver_idTouser")
  // email_record_email_record_sender_idTouser                                   email_record[]                @relation("email_record_sender_idTouser")
  // employees_permissions_employees_permissionsTouser                           employees_permissions[]
  // message_messageTouser                                                       message[]
  // message_message_receiver_idTouser                                           message[]                     @relation("message_receiver_idTouser")
  // notifications                                                               notification[]                @relation("notification_user_idTouser")
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
  // user_status_log_userTouser_status_log_account_manager_id                    user_status_log[]             @relation("userTouser_status_log_account_manager_id")
  // user_status_log_userTouser_status_log_user_id                               user_status_log[]             @relation("userTouser_status_log_user_id")
}
