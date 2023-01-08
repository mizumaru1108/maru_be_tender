import { ApiProperty } from '@nestjs/swagger';

export class GetRawPartnerDatasResponseDto {
  @ApiProperty()
  roles: {
    user_type_id: string;
  }[];

  @ApiProperty()
  status: {
    id: string;
  };

  @ApiProperty()
  created_at: Date | null;

  @ApiProperty()
  client_data: {
    governorate: string | null;
    region: string | null;
  } | null;
}
