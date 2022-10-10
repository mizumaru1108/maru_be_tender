type message = {
  sender: string;
  dateCreated: string;
  messageBody: string;
  timeCreated: string;
};

export type IContentMessage = {
  data: message[];
};
export type IBodyContent = {
  data: message[];
};

export type IFooterContent = {
  data: message[];
};

type internalExternal = {
  partnerName: string;
  projectName: string;
  message: string;
  footer: Date;
};

export type IMessageMenuItem = {
  data: internalExternal;
  index: number | undefined;
};

export type IMenu = {
  internalData: internalExternal[];
  externalData: internalExternal[];
  accountType: string;
};

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
