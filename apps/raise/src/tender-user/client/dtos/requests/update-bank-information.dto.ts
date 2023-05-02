import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class UpdateBankInformationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;

  /* For relation to banks (bank name) */
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  bank_id?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bank_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bank_account_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bank_account_number: string;

  @ApiProperty()
  @IsNotEmpty()
  card_image: any;
}
