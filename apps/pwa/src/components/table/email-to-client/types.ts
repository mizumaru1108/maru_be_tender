export type EmailToClient = {
  id: string;
  employee_name: string;
  email_content: string;
};

export interface EmailToClienRow {
  row: EmailToClient;
  selected?: boolean;
  onSelectRow?: VoidFunction;
}
