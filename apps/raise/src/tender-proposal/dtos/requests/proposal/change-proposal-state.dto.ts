import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProposalAction } from '../../../../tender-commons/types/proposal';

import { SetupPaymentPayloadDto } from '../setup-payment-payload.dto';
import { ModeratorChangeStatePayload } from './moderator-change-state.dto';
import { SupervisorChangeStatePayload } from './supervisor-change-state.dto';

export class ChangeProposalStateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  proposal_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(ProposalAction)
  action: ProposalAction;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => ModeratorChangeStatePayload)
  @ValidateNested()
  moderator_payload?: ModeratorChangeStatePayload;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => SupervisorChangeStatePayload)
  @ValidateNested()
  supervisor_payload?: SupervisorChangeStatePayload;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reject_reason?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  message?: string;

  @ApiPropertyOptional()
  @IsOptional()
  amandements?: any | undefined;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => SetupPaymentPayloadDto)
  @ValidateNested()
  setupPaymentPayload?: SetupPaymentPayloadDto;
}
