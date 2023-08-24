import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ValidateKsaPhoneNumber966 } from '../../../../tender-commons/decorators/validate-ksa-phone-number-966.decorator';
import { CreateBankInformationDto } from './create-bank-information.dto';
import { ExistingClientBankInformation } from './existing-bank-information.dto';
import { UpdateBankInformationDto } from './update-bank-information.dto';

export class ClientEditRequestFieldDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  selectLang?: 'ar' | 'en';

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  entity?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  authority?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  authority_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  headquarters?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date_of_esthablistmen?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  num_of_beneficiaries?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  num_of_employed_facility?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  governorate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  region?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ValidateKsaPhoneNumber966()
  entity_mobile?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  center_administration?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  twitter_acount?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  license_number?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  license_expired?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  license_issue_date?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  license_file?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNotEmpty({ each: true })
  board_ofdec_file?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  ceo_mobile?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  ceo_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  data_entry_mobile?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  data_entry_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  data_entry_mail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  client_field?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  client_field_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  chairman_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  chairman_mobile?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CreateBankInformationDto)
  created_banks?: CreateBankInformationDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => UpdateBankInformationDto)
  updated_banks?: UpdateBankInformationDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => ExistingClientBankInformation)
  deleted_banks?: ExistingClientBankInformation[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => ExistingClientBankInformation)
  old_banks?: ExistingClientBankInformation[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => ExistingClientBankInformation)
  bank_information?: ExistingClientBankInformation[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => ExistingClientBankInformation)
  createdBanks?: ExistingClientBankInformation[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => ExistingClientBankInformation)
  updatedBanks?: ExistingClientBankInformation[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => ExistingClientBankInformation)
  deletedBanks?: ExistingClientBankInformation[];
}
