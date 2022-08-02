import { ArrayNotEmpty, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CampaignSetDeletedFlagDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  readonly campaignIds: string[];
}
