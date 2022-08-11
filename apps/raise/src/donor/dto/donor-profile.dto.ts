import { ApiProperty } from '@nestjs/swagger';

export class DonorUpdateProfileDto {

  @ApiProperty()
  readonly isAnonymous: boolean;

  @ApiProperty()
  readonly about: string;

  @ApiProperty()
  readonly city: string;

  @ApiProperty()
  readonly state: string;

  @ApiProperty()
  readonly zipcode: string;

  @ApiProperty()
  readonly address: string;

  @ApiProperty()
  readonly country: string;

  @ApiProperty()
  readonly facebook: string;

  @ApiProperty()
  readonly twitter: string;

  @ApiProperty()
  readonly linkedin: string;

  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly lastName: string;

  @ApiProperty()
  readonly gender: string;

  @ApiProperty()
  readonly mobile: string;

  @ApiProperty()
  readonly profilePic: string;

  @ApiProperty()
  readonly isEmailChecklist: boolean;

  @ApiProperty()
  readonly anonymous: boolean;
}
