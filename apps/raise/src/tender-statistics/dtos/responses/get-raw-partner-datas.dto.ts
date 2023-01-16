import { ApiProperty } from '@nestjs/swagger';

export class GetRawPartnerDatasResponseDto {
  @ApiProperty()
  created_at: Date | null;

  @ApiProperty()
  user_detail: {
    client_data: {
      governorate: string | null;
      region: string | null;
    } | null;
    roles: {
      user_type_id: string;
    }[];
  };

  @ApiProperty()
  user_status: {
    id: string;
  };
}
