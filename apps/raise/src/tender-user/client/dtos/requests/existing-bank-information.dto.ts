import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { UploadFilesJsonbDto } from '../../../../tender-commons/dto/upload-files-jsonb.dto';

export class ExistingClientBankInformation {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  user_id?: string;

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
  @ValidateNested()
  @Type(() => UploadFilesJsonbDto)
  card_image: UploadFilesJsonbDto;
}
