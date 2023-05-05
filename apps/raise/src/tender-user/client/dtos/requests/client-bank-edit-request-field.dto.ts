import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ExistingClientBankInformation } from './existing-bank-information.dto';
import { UpdateBankInformationDto } from './update-bank-information.dto';

export class ClientBankEditRequestFieldDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  selectLang?: 'ar' | 'en';

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
  updatedBanks?: ExistingClientBankInformation[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => ExistingClientBankInformation)
  deletedBanks?: ExistingClientBankInformation[];
}
