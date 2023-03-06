import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ValidateKsaPhoneNumber966 } from '../../../tender-commons/decorators/validate-ksa-phone-number-966.decorator';
import { ValidateSaIBAN } from '../../../tender-commons/decorators/validate-sa-iban.decorator';
import { TenderFilePayload } from '../../../tender-commons/dto/tender-file-payload.dto';

export class bankData {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bank_account_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(24, {
    message: 'IBAN must be 24 characters',
  })
  @MaxLength(24, {
    message: 'IBAN must be 24 characters',
  })
  @ValidateSaIBAN()
  bank_account_number: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bank_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => TenderFilePayload)
  @ValidateNested()
  card_image: TenderFilePayload;
}

// for registering
class registerClient {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  selectLang?: 'ar' | 'en';

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
  @Type(() => TenderFilePayload)
  @ValidateNested()
  board_ofdec_file: TenderFilePayload;

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
  @Type(() => TenderFilePayload)
  @ValidateNested()
  license_file: TenderFilePayload;

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
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => bankData)
  bank_informations: bankData;
}

export class RegisterTenderDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => registerClient)
  data: registerClient;
}
