import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ValidateObjectIdDecorator } from '../../commons/decorators/validate-object-id.decorator';

export class UpdateCampaignStatusDto {
  /**
   * For permission guard
   */
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @ValidateObjectIdDecorator()
  organizationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @ValidateObjectIdDecorator()
  campaignId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @ValidateObjectIdDecorator()
  vendorId: string;
}
