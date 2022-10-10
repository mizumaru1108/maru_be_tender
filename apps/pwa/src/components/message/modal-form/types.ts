export interface NewMessageModalFormProps {
  children: React.ReactNode;
  onSubmit: (values: NewMessageModalFormValues) => void;
}

export interface NewMessageModalFormValues {
  trackType: string;
  employeeId: string;
}
