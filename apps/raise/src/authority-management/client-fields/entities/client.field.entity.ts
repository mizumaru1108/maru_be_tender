import { ClientDataEntity } from '../../../tender-user/client/entities/client-data.entity';
import { AuthoritiesEntity } from '../../authorities/entities/authorities.entity';

export class ClientFieldEntity {
  client_field_id: string;
  name: string;
  is_deleted: boolean;

  authorities: AuthoritiesEntity[];
  client_data: ClientDataEntity[];
}
