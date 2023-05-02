import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';
import { TenderFilePayload } from '../../../../tender-commons/dto/tender-file-payload.dto';

export class CreateBankInformationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bank_name: string;

  /* For relation to banks (bank name) */
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bank_id: string;

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
  @ValidateNested()
  @Type(() => TenderFilePayload)
  card_image: TenderFilePayload;
}
