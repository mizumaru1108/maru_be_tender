type messageContent = {
  sender: string;
  dateCreated: string;
  messageBody: string;
  timeCreated: string;
};

export type ContentMessage = {
  data: messageContent[];
};
export type BodyContent = {
  data: messageContent[];
};

export type FooterContent = {
  data: messageContent[];
};

type correspondanceData = {
  partnerName: string;
  projectName: string;
  message: string;
  footer: Date;
};

export type Menu = {
  internalTabData: correspondanceData[];
  externalTabData: correspondanceData[];
};

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
