import { AuthUser } from '../../@types/auth';

type messageContent = {
  sender: string;
  dateCreated: string;
  messageBody: string;
  timeCreated: string;
};

export type IContentMessage = {
  data: messageContent[];
};
export type IBodyContent = {
  data: messageContent[];
};

export type IFooterContent = {
  data: messageContent[];
};

type correspondanceData = {
  roomId: string;
  partnerName: string;
  projectName: string;
  message: string;
  footer: Date;
};

export type IMessageMenuItem = {
  data: correspondanceData[];
  getRoomId: (id: string) => void;
};

export type IMenu = {
  // internalData: correspondanceData[];
  // externalData: correspondanceData[];
  accountType: string;
  user: AuthUser;
  fetching: boolean;
  // roomId: (id: string) => void;
};

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export type IFilterMessage = {
  name: string;
  options: { label: string; value: string; Role?: string }[];
};
