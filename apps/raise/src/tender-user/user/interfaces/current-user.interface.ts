import { TenderFusionAuthRoles } from '../../../tender-commons/types';

export interface TenderCurrentUser {
  id: string;
  email: string;
  type: TenderFusionAuthRoles[];
  choosenRole: TenderFusionAuthRoles;
}
