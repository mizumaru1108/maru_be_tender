export type ChatState = {
  // isLoading: boolean;
  // error: Error | string | null;
  conversations: Conversation[];
  isEstablishingConnection: boolean;
  isConnected: boolean;
  // activeConversationId: null | string;
};

export type Participant = {
  id: string;
  employee_name: string;
  roles: string;
  is_online: boolean | null;
  last_login: Date | string;
};

export type TextMessage = {
  id: string;
  content: string | null;
  content_title: string | null;
  content_type_id: string;
  attachment: string | null;
  created_at: Date | string;
};

export type ImageMessage = {
  id: string;
  content: string | null;
  content_title: string | null;
  content_type_id: string;
  attachment: string | null;
  created_at: Date | string;
};

export type Message = TextMessage | ImageMessage;

export type Conversation = {
  id?: string;
  correspondance_category_id: string;
  messages: Message[] | [];
  participant1: Participant | null;
  participant2: Participant | null;
};
