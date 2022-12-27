import { TenderFusionAuthRoles } from '../../../tender-commons/types';
import { Credentials } from 'google-auth-library';
export interface TenderCurrentUser {
  id: string;
  email: string;
  type: TenderFusionAuthRoles[];
  choosenRole: TenderFusionAuthRoles;
  googleSession?: Credentials;
}
