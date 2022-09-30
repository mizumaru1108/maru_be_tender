import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsEmpty, IsOptional } from 'class-validator';
import { RoleTenderEnum } from '../enums/role-enum';

export class RegisterFromFusionAuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  country?: string;

  @ApiProperty()
  state?: string;

  @ApiProperty()
  address?: string;

  @ApiProperty()
  mobile?: string;

}

export class RegFromFusionAuthTenderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employee_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  user_type_id: string;

  @ApiProperty()
  @IsOptional()
  employees_permissions?: string[];

  @ApiProperty()
  @IsOptional()
  is_active?: boolean;

}

export class RegisterFromFusionAuthTenderDto {
  email: string;
  password: string;
  employee_name: string;
  employee_path: string;
  id?: string;
  authority: string;
  board_ofdec_file: string;
  center_administration: string;
  ceo_mobile: string;
  ceo_name: string;
  data_entry_mail: string;
  entity_mobile: string;
  governorate: string;
  headquarters: string;
  license_number: string;
  license_expired: string;
  license_file: string;
  license_issue_date: string;
  data_entry_mobile: string;
  num_of_beneficiaries: string;
  num_of_employed_facility: string;
  phone: string;
  region: string;
  twitter_acount: string;
  website: string;
  entity: string;
  status: string;
  bank_informations: string[];
}