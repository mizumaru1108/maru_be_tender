import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ChangeProposalStateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  proposal_id: string;

  /**
   * Organization / Client / PartnerId (bacicly the same, translational problem)
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  organization_id: string;
}
