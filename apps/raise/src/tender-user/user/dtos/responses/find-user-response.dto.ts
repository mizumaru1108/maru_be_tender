import { ApiProperty } from '@nestjs/swagger';
import { user, user_role } from '@prisma/client';

// (alias) type user_role = {
//   id: string;
//   user_id: string;
//   user_type_id: string;
// }

// (property) client_data?: {
//   id: string;
//   entity: string | null;
//   client_field: string | null;
// } | null | undefined

// (property) schedule?: {
//   id: string;
//   user: user;
//   start_time: string | null;
//   end_time: string | null;
// }[] | undefined

export class FindUserResponse {
  @ApiProperty()
  data: (user & {
    roles: user_role[];
    client_data?: {
      id: string;
      entity: string | null;
      client_field: string | null;
    } | null;
    schedule?: {
      id: string;
      start_time: string | null;
      end_time: string | null;
      time_gap?: string[] | []; // manually added
    }[];
  })[];

  @ApiProperty()
  total: number;
}
