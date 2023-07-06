import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  selectLang?: 'ar' | 'en';

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsIn(['attachments', 'plain'], {
    message: 'follow_up_type must be attachments or plain!',
  })
  follow_up_type: 'attachments' | 'plain';

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => TenderFilePayload)
  follow_up_attachment?: TenderFilePayload[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  content?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  employee_only: boolean;
}
