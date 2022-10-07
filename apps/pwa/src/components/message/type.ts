type message = {
  sender: string;
  dateCreated: string;
  messageBody: string;
  timeCreated: string;
};

export type ContentMessage = {
  data: message[];
};
export type BodyContent = {
  data: message[];
};

export type FooterContent = {
  data: message[];
};

type internalExternal = {
  partnerName: string;
  projectName: string;
  message: string;
  footer: Date;
};

export type Menu = {
  internalData: internalExternal[];
  externalData: internalExternal[];
};

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
