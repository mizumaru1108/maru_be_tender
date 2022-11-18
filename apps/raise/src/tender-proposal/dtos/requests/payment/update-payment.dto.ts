import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsOptional,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { UploadFilesJsonbDto } from '../../../../tender-commons/dto/upload-files-jsonb.dto';

class CreateChequeDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  deposit_date: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UploadFilesJsonbDto)
  transfer_receipt: UploadFilesJsonbDto;
}

export class UpdatePaymentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  payment_id: string;

  @ApiProperty()
  @IsString()
  @IsIn(['accept', 'reject', 'edit', 'upload_receipt', 'issue'], {
    message: 'action must be accept, reject, issue, edit or upload_receipt',
  })
  action: 'accept' | 'reject' | 'edit' | 'upload_receipt' | 'issue';

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @Type(() => CreateChequeDto)
  cheque: CreateChequeDto;
}
