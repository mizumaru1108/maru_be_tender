import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
export class TenderCreateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  selectLang?: 'AR' | 'EN';

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employee_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mobile_number: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsBoolean()
  activate_user: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employee_path: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  user_roles: string[];
}
