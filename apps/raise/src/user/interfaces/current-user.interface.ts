import { RoleEnum } from '../enums/role-enum';

export interface ICurrentUser {
  id: string;
  email: string;
  type?: RoleEnum;
}
