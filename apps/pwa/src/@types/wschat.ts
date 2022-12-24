export type ChatState = {
  // isLoading: boolean;
  // error: Error | string | null;
  conversations: Conversation[];
  isEstablishingConnection: boolean;
  isConnected: boolean;
  // activeConversationId: null | string;
};

export type TextMessage = {
  id: string;
  body: string;
  contentType: 'text';
  attachments: string[];
  createdAt: Date;
  senderId: string;
};

export type ImageMessage = {
  id: string;
  body: string;
  contentType: 'image';
  attachments: string[];
  createdAt: Date;
  senderId: string;
};

export type Message = TextMessage | ImageMessage;

export type Conversation = {
  // id: string;
  // participants: Participant[];
  // type: string;
  // unreadCount: number;
  // messages: Message[];
  room_id?: string;
  partner_id: string;
  sender_id: string;
  correspondence_type_id: string;
  partner_selected_role: string;
  partner_username: string;
  content: Message[];
};

export type Participant = {
  id: string;
  // name: string;
  // username: string;
  // avatar: string;
  // address?: string;
  // phone?: string;
  // email?: string;
  // lastActivity?: Date | string | number;
  // status?: 'online' | 'offline' | 'away' | 'busy';
  // position?: string;
};
