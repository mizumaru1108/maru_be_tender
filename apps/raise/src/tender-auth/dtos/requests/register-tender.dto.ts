import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UploadProposalFilesDto } from '../../../tender-commons/dto/upload-proposal-files.dto';
import { ValidateKsaPhoneNumber } from '../../../tender-commons/decorators/validate-ksa-phone-number.decorator';
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
  @Type(() => UploadProposalFilesDto)
  @ValidateNested()
  card_image: UploadProposalFilesDto;
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
  @Type(() => UploadProposalFilesDto)
  @ValidateNested()
  board_ofdec_file: UploadProposalFilesDto;

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
  @IsString()
  @IsNotEmpty()
  @ValidateKsaPhoneNumber()
  entity_mobile: string;

  @ApiProperty()
  @IsNotEmpty()
  governorate: string;

  @ApiProperty()
  @IsNotEmpty()
  headquarters: string;

  @ApiProperty()
  @IsNotEmpty()
  license_expired: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => UploadProposalFilesDto)
  @ValidateNested()
  license_file: UploadProposalFilesDto;

  @ApiProperty()
  @IsNotEmpty()
  license_issue_date: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateKsaPhoneNumber()
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
  @IsString()
  @ValidateKsaPhoneNumber()
  phone: string;

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
  client_field: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  vat: boolean;

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
