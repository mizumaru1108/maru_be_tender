import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RoleTenderEnum } from '../../user/enums/role-enum';

export class RegReqTenderDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employee_name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEnum(RoleTenderEnum, {
    message: `Enum Valid is CLIENT, ACCOUNTS_MANAGER,  MODERATOR,
                PROJECT_SUPERVISOR, PROJECT_MANAGER,
                CONSULTANT, CEO, FINANCE, CASHIER, ADMIN`,
  })
  user_type_id: RoleTenderEnum;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  roles: Array<string>;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  employee_path: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  employees_permissions: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  is_active: boolean;
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
class basePayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  license_number: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  employee_name: string;

  @ApiProperty()
  @IsNotEmpty()
  employee_path: string;

  @ApiProperty()
  @IsNotEmpty()
  authority: string;

  @ApiProperty()
  @IsNotEmpty()
  board_ofdec_file: string;

  @ApiProperty()
  @IsNotEmpty()
  center_administration: string;

  @ApiProperty()
  @IsNotEmpty()
  ceo_mobile: string;

  @ApiProperty()
  @IsNotEmpty()
  ceo_name: string;

  @ApiProperty()
  @IsNotEmpty()
  date_of_esthablistmen: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  data_entry_mail: string;

  @ApiProperty()
  @IsNotEmpty()
  entity_mobile: string;

  @ApiProperty()
  @IsNotEmpty()
  governorate: string;

  @ApiProperty()
  @IsNotEmpty()
  headquarters: string;

  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // mobile_data_entry: string;

  @ApiProperty()
  @IsNotEmpty()
  license_expired: string;

  @ApiProperty()
  @IsNotEmpty()
  license_file: string;

  @ApiProperty()
  @IsNotEmpty()
  license_issue_date: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  data_entry_mobile: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  num_of_beneficiaries: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  num_of_employed_facility: number;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  region: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  twitter_acount: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  website: string;

  @ApiProperty()
  @IsNotEmpty()
  entity: string;

  @ApiProperty()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsNotEmpty()
  data_entry_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  client_field: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  vat: boolean;

  @ApiProperty()
  @ValidateNested()
  @Type(() => bankData)
  bank_informations: bankData;
}

export class RegisterTendersDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => basePayload)
  data: basePayload;

  @ApiProperty()
  @IsArray()
  roles: Array<string>;
}
