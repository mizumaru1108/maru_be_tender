import { UserStatusLogEntity } from './user-status-log.entity';
import { UserEntity } from './user.entity';

export class UserStatusEntity {
  id: string;
  // client_log      : ClientLogEntity
  client_log: any;
  user?: UserEntity[];
  user_status_log?: UserStatusLogEntity[];
}
