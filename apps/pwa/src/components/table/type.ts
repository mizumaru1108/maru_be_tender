export type IPropsTablesList = {
  id?: string | null;
  partner_name?: string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  account_status?: string | null;
  events?: string | null;
  share?: boolean;
  shareLink?: string;
  update_status?: boolean | false;
  status_id?: string | null;
  user?: userTypes | null;
  email?: string | null;
};
type userTypes = {
  client_data?: {
    entity?: string;
  };
};

export type IPropsPortalReportEmployee = {
  id?: string | null;
  employee_name?: string | null;
  createdAt?: Date | string | null;
  account_type?: string | null;
  sections?: string | null;
  number_of_clock?: string | null;
};
