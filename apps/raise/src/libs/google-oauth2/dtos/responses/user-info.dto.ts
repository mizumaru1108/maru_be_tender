import { ApiProperty } from '@nestjs/swagger';

export class UserInfo {
  @ApiProperty()
  id: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  verified_email: boolean;
  @ApiProperty()
  name: string;
  @ApiProperty()
  given_name: string;
  @ApiProperty()
  family_name: string;
  @ApiProperty()
  picture: string;
  @ApiProperty()
  locale: string;
}
