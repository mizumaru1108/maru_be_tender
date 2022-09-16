import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { PayloadImage } from '../../commons/dtos/payload-image.dto';
import { CampaignCreateEditBaseDto } from './campaign-create-edit-base.dto';

export class CampaignCreateDto extends CampaignCreateEditBaseDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PayloadImage)
  images: PayloadImage[];
}
