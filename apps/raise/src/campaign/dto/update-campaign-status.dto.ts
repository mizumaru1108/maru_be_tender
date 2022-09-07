import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ValidateObjectId } from '../../commons/decorators/validate-object-id.decorator';

export class UpdateCampaignStatusDto {
  /**
   * For permission guard
   */
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @ValidateObjectId()
  organizationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @ValidateObjectId()
  campaignId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @ValidateObjectId()
  vendorId: string;
}
