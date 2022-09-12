import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { CampaignMilestone } from '../../../schema/campaign-milestone.schema';
import { Campaign } from '../../../schema/campaign.schema';

export class UpdateMilestoneResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  updatedCampaign: Campaign;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  editedValues: CampaignMilestone[];
}
