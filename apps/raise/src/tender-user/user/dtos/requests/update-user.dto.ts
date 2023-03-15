import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { GetByUUIDQueryParamDto } from '../../../../commons/dtos/get-by-uuid-query-param.dto';
import { ValidateKsaPhoneNumber966 } from '../../../../tender-commons/decorators/validate-ksa-phone-number-966.decorator';
import { TenderAppRoleEnum } from '../../../../tender-commons/types';

export class UpdateUserDto extends GetByUUIDQueryParamDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  selectLang?: 'ar' | 'en';

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  activate_user: boolean;

  @ApiProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(8, {
    message: `Please insert at least 8 character`,
  })
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employee_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employee_path: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateKsaPhoneNumber966()
  mobile_number: string;

  @ApiProperty()
  @IsArray()
  @IsEnum(TenderAppRoleEnum, {
    message: `Status must be one of ${Object.values(TenderAppRoleEnum).join(
      ', ',
    )}`,
    each: true,
  })
  user_roles: TenderAppRoleEnum[];
}
