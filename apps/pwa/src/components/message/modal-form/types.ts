export type NewMessageModalFormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
};

export interface NewMessageModalFormValues {
  trackType: string;
  employeeId: string;
}

export interface UserDataTracks {
  id: string;
  employee_name: string;
  roles: {
    user_type_id: string;
  }[];
  is_online: boolean | null;
  last_login: Date | string;
}
