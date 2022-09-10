import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ValidateObjectIdDecorator } from '../../commons/decorators/validate-object-id.decorator';

export class CampaignApplyVendorDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  @ValidateObjectIdDecorator()
  campaignId: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  @ValidateObjectIdDecorator()
  organizationId: string;
}
