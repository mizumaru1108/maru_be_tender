import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
