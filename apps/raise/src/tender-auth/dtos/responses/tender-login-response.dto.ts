import { LoginResponse } from '@fusionauth/typescript-client';
import ClientResponse from '@fusionauth/typescript-client/build/src/ClientResponse';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { client_data, user } from '@prisma/client';

export class TenderLoginResponseDto {
  @ApiProperty()
  fusionAuthResponse: ClientResponse<LoginResponse>;

  @ApiProperty()
  userData?: user;

  @ApiProperty()
  clientData?: client_data | null;
}
