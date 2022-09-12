import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { CampaignMilestone } from '../../../schema/campaign-milestone.schema';
import { Campaign } from '../../../schema/campaign.schema';

export class AddMilestoneResponseDto {
  /**
   * updated campaign data
   */
  @ApiProperty()
  @IsNotEmpty()
  updatedCampaign: Campaign;

  /**
   * milestone that was added to the campaign
   */
  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ each: true })
  addedMilestones: CampaignMilestone[];
}
