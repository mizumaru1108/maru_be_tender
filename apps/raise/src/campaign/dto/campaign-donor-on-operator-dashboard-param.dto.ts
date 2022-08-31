import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ValidateObjectId } from '../../commons/decorators/validate-object-id.decorator';

export class CampaignDonorOnOperatorDasboardParam {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  @ValidateObjectId()
  campaignId: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  @ValidateObjectId()
  organizationId: string;
}
