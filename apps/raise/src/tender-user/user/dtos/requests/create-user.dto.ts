import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ValidateKsaPhoneNumber9665 } from '../../../../tender-commons/decorators/validate-ksa-phone-number-9665.decorator';

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
  @ValidateKsaPhoneNumber9665()
  mobile_number?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  activate_user?: boolean;

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
