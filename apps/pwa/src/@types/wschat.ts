import { FileProp } from '../components/upload';

export type ChatState = {
  conversations: Conversation[];
  isEstablishingConnection: boolean;
  isConnected: boolean;
  activeConversationId?: string | null;
  messageGrouped?: IMassageGrouped[];
};

export type Participant = {
  id: string;
  employee_name: string;
  roles?: string;
  is_online: boolean | null;
  last_login: Date | string;
};

export type TextMessage = {
  id?: string;
  content?: string | null;
  content_title?: string | null;
  content_type_id?: string;
  attachment?: FileProp | null;
  created_at?: Date | string;
  updated_at?: Date | string;
  owner_id?: string | null;
  sender_role_as?: string | null;
  sender?: {
    employee_name: string | null;
  } | null;
  receiver_id?: string | null;
  receiver_role_as?: string | null;
  receiver?: {
    employee_name: string | null;
  } | null;
  read_status?: boolean;
};

export type ImageMessage = {
  id?: string;
  content?: string | null;
  content_title?: string | null;
  content_type_id?: string | null;
  attachment?: FileProp | null;
  created_at?: Date | string;
  updated_at?: Date | string;
  owner_id?: string | null;
  sender_role_as?: string | null;
  sender?: {
    employee_name: string | null;
  } | null;
  receiver_id?: string | null;
  receiver_role_as?: string | null;
  receiver?: {
    employee_name: string | null;
  } | null;
  read_status?: boolean;
};

export type Message = TextMessage | ImageMessage;

export type IMassageGrouped = {
  group_created: Date | string;
  messages: Message[];
};

export type Conversation = {
  id?: string;
  unread_message?: number;
  correspondance_category_id: string;
  messages: Message[] | [];
};
