export type NewMessageModalFormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
};

export interface NewMessageModalFormValues {
  trackType: string;
  employeeId: string;
}
