import { AuthUser } from '../../../@types/auth';
import { FusionAuthRoles } from '../../../@types/commons';

export type NewMessageModalFormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  user: AuthUser;
  activeRole: string;
  corespondence: string;
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
  client_data: {
    id: string;
    entity: string;
  };
}
