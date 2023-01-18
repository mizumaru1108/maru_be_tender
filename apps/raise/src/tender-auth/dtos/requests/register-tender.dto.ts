import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { ValidateKsaPhoneNumber966 } from '../../../tender-commons/decorators/validate-ksa-phone-number-966.decorator';

import { UploadFilesJsonbDto } from '../../../tender-commons/dto/upload-files-jsonb.dto';
class bankData {
  @ApiProperty()
  @IsString()
  bank_account_name: string;

  @ApiProperty()
  @IsString()
  bank_account_number: string;

  @ApiProperty()
  @IsString()
  bank_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => UploadFilesJsonbDto)
  @ValidateNested()
  card_image: UploadFilesJsonbDto;
}

// for registering
class registerClient {
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
  @IsString()
  @IsNotEmpty()
  employee_name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  employee_path?: string;

  @ApiProperty()
  @IsNotEmpty()
  authority: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => UploadFilesJsonbDto)
  @ValidateNested()
  board_ofdec_file: UploadFilesJsonbDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  center_administration?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateKsaPhoneNumber966()
  ceo_mobile: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  ceo_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateKsaPhoneNumber966()
  chairman_mobile: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  chairman_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date_of_esthablistmen: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  data_entry_mail: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateKsaPhoneNumber966()
  entity_mobile: string;

  @ApiProperty()
  @IsNotEmpty()
  governorate: string;

  @ApiProperty()
  @IsNotEmpty()
  headquarters: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  license_expired: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => UploadFilesJsonbDto)
  @ValidateNested()
  license_file: UploadFilesJsonbDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  license_issue_date: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateKsaPhoneNumber966()
  data_entry_mobile: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  num_of_beneficiaries: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  num_of_employed_facility: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ValidateKsaPhoneNumber966()
  phone?: string;

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  status?: string;

  @ApiProperty()
  @IsNotEmpty()
  data_entry_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsIn(['main', 'sub'], {
    message: 'client_field must be either main or sub',
  })
  client_field: string;

  @ApiProperty()
  @IsArray()
  @Type(() => bankData)
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  bank_informations: bankData[];
}

export class RegisterTenderDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => registerClient)
  data: registerClient;
}
