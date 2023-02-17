import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray } from 'class-validator';

export class CampaignSetDeletedFlagDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  readonly campaignIds: string[];
}
