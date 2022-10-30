import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class ChangeProposalStateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  proposal_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['approve', 'reject', 'ask_for_revision'], {
    message: 'status must be approve, reject or ask_for_revision',
  })
  action: string;

  /**
   * Required when moderator acceptance
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  tracks_name?: string;

  /**
   * Organization / Client / PartnerId (bacicly the same, translational problem)
   */
  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // @IsUUID()
  // organization_id: string;
}
