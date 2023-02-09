import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsOptional,
  ValidateNested,
  IsDate,
} from 'class-validator';
import { TenderFilePayload } from '../../../../tender-commons/dto/tender-file-payload.dto';
import { UploadFilesJsonbDto } from '../../../../tender-commons/dto/upload-files-jsonb.dto';

class CreateChequeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  deposit_date: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TenderFilePayload)
  transfer_receipt: TenderFilePayload;
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
  @ValidateNested()
  @Type(() => CreateChequeDto)
  cheque: CreateChequeDto;
}
