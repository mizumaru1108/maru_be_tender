import { ClientDataEntity } from '../../../tender-user/client/entities/client-data.entity';
import { ClientFieldEntity } from '../../client-fields/entities/client.field.entity';

export class AuthoritiesEntity {
  authority_id: string;
  name: string;
  is_deleted: boolean;
  entities?: ClientFieldEntity[];
  client_data?: ClientDataEntity[];
}
