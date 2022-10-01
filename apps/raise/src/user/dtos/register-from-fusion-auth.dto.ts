import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsEnum, IsEmpty, IsOptional, IsEmail, ValidateNested } from 'class-validator';
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

class bankData {
  @ApiProperty()
  @IsString()
  @IsOptional()
  bank_account_name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bank_account_number: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bank_name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  card_image: string;
}
export class RegisterFromFusionAuthTenderDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id_: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  employee_name: string;


  @ApiProperty()
  @IsString()
  employee_path: string;

  @ApiProperty()
  @IsString()
  authority: string;

  @ApiProperty()
  @IsString()
  board_ofdec_file: string;

  @ApiProperty()
  @IsString()
  center_administration: string;

  @ApiProperty()
  @IsString()
  ceo_mobile: string;

  @ApiProperty()
  @IsString()
  ceo_name: string;

  @ApiProperty()
  @IsString()
  data_entry_mail: string;

  @ApiProperty()
  @IsString()
  entity_mobile: string;

  @ApiProperty()
  @IsString()
  governorate: string;

  @ApiProperty()
  @IsString()
  headquarters: string;

  @ApiProperty()
  @IsString()
  license_number: string;

  @ApiProperty()
  @IsString()
  license_expired: string;


  @ApiProperty()
  @IsString()
  license_file: string;

  @ApiProperty()
  @IsString()
  license_issue_date: string;

  @ApiProperty()
  @IsString()
  data_entry_mobile: string;

  @ApiProperty()
  @IsString()
  num_of_beneficiaries?: number;

  @ApiProperty()
  @ApiProperty()
  @IsString()
  num_of_employed_facility?: number;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  region: string;

  @ApiProperty()
  @IsString()
  twitter_acount: string;

  @ApiProperty()
  @IsString()
  website: string;

  @ApiProperty()
  @IsString()
  entity: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  data_entry_name: string;

  @ApiProperty()
  @IsString()
  date_of_esthablistmen: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  mobile_data_entry: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => bankData)
  bank_informations: bankData;
}