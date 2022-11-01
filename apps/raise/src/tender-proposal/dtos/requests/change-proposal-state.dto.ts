import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
   * for moderator acceptance
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  user_id: string;

  /**
   * for moderator acceptance
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  track_name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  notes?: string;

  /**
   * Organization / Client / PartnerId (bacicly the same, translational problem)
   */
  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // @IsUUID()
  // organization_id: string;
}
