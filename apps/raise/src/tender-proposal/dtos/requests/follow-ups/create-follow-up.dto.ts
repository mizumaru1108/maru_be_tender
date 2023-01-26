import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TenderFilePayload } from '../../../../tender-commons/dto/tender-file-payload.dto';

export class CreateProposalFollowUpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  proposal_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsIn(['attachments', 'plain'], {
    message: 'follow_up_type must be attachments or plain!',
  })
  follow_up_type: 'attachments' | 'plain';

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @Type(() => TenderFilePayload)
  @ValidateNested()
  @IsArray()
  follow_up_attachment?: TenderFilePayload[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  content?: string;
}
