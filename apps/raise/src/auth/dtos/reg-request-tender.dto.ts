import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { RoleTenderEnum } from 'src/user/enums/role-enum';

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
  @IsEnum(RoleTenderEnum,
    {
      message: `Enum Valid is CLIENT, ACCOUNTS_MANAGER,  MODERATOR,
                PROJECT_SUPERVISOR, PROJECT_MANAGER,
                CONSULTANT, CEO, FINANCE, CASHIER, ADMIN`
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

  @ApiProperty()
  @IsNotEmpty()
  mobile_data_entry: string;

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
  @IsNotEmpty()
  twitter_acount: string;

  @ApiProperty()
  @IsNotEmpty()
  website: string;

  @ApiProperty()
  @IsNotEmpty()
  entity: string;

  @ApiProperty()
  @IsNotEmpty()
  status: string;

  // bank_informations: 

}


export class RegisterTendersDto {

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => basePayload)
  data?: basePayload;

  @ApiProperty()
  @IsArray()
  roles: Array<string>;
}

