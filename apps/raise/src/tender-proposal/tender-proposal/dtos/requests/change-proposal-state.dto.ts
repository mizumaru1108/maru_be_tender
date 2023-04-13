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

import { ModeratorChangeStatePayload } from './moderator-change-state.dto';
import { SupervisorChangeStatePayload } from './supervisor-change-state.dto';
import { CeoChangeStatePayload } from './ceo-change-state.dto';
import { ProjectManagerChangeStatePayload } from './project-manager-change-state-payload.dto';

export class ChangeProposalStateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  selectLang?: 'ar' | 'en';

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
  @IsOptional()
  @Type(() => ProjectManagerChangeStatePayload)
  @ValidateNested()
  project_manager_payload?: ProjectManagerChangeStatePayload;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => CeoChangeStatePayload)
  @ValidateNested()
  ceo_payload?: CeoChangeStatePayload;

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
}
