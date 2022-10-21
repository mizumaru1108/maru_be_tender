export type BaseAmandementRequest = {
  notes: string;
};

export type AmandementRequestProps = {
  pageName: string;
  headline: string;
  children?: React.ReactNode;
  onSubmit: (data: BaseAmandementRequest) => void;
};
