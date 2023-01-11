import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProposalAction } from '../../../enum/proposalAction.enum';
import { SetupPaymentPayloadDto } from '../setup-payment-payload.dto';
import { ModeratorChangeStatePayload } from './moderator-change-state.dto';

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
