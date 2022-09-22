import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @IsEmail()
  user_type_id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  employee_path: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  employees_permissions: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
