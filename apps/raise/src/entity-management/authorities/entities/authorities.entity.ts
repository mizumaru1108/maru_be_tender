import { ClientDataEntity } from '../../../tender-user/client/entities/client-data.entity';
import { EntitiesEntity } from '../../entities/entities/entities.entity';

export class AuthoritiesEntity {
  authority_id: string;
  name: string;
  is_deleted: boolean;
  entities?: EntitiesEntity[];
  client_data?: ClientDataEntity[];
}
