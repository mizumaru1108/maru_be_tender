import { ClientDataEntity } from '../../../tender-user/client/entities/client-data.entity';
import { AuthoritiesEntity } from '../../authorities/entities/authorities.entity';

export class EntitiesEntity {
  entity_id: string;
  name: string;
  authority_id: string;
  authority_detail: AuthoritiesEntity;
  is_deleted: boolean;

  client_data?: ClientDataEntity[];
}
