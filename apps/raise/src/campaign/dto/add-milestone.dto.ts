import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { ValidateObjectIdDecorator } from '../../commons/decorators/validate-object-id.decorator';
import { CampaignMilestoneDto } from './campaign-milestone.dto';

export class AddMilestoneDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  organizationId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  campaignId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addedMilestone: CampaignMilestoneDto;
}
