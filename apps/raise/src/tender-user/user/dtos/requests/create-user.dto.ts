import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ValidateKsaPhoneNumber } from '../../../../tender-commons/decorators/validate-ksa-phone-number.decorator';

export class TenderCreateUserDto {
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
  @ValidateKsaPhoneNumber()
  mobile_number: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active_user?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  employee_path?: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  user_roles: string[];
}
