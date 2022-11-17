import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SetupPaymentPayloadDto } from '../setup-payment-payload.dto';

export class ChangeProposalStateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  proposal_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['approve', 'reject', 'edit_request'], {
    message: 'status must be approve, reject or edit_request',
  })
  action: string;

  /**
   * for moderator acceptance
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  supervisor_user_id?: string;

  /**
   * for moderator acceptance
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  track_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  notes?: string | undefined;

  @ApiPropertyOptional()
  @IsOptional()
  procedures?: string | undefined;

  @ApiPropertyOptional()
  @IsOptional()
  amandements?: any | undefined;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => SetupPaymentPayloadDto)
  @ValidateNested()
  setupPaymentPayload?: SetupPaymentPayloadDto;

  /**
   * Organization / Client / PartnerId (bacicly the same, translational problem)
   */
  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // @IsUUID()
  // organization_id: string;
}
