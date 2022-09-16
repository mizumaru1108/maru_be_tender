import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { UpdateImagePayload } from '../../commons/dtos/update-image-payload.dto';
import { CampaignCreateEditBaseDto } from './campaign-create-edit-base.dto';

export class CampaignUpdateDto extends CampaignCreateEditBaseDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateImagePayload)
  updatedImage: UpdateImagePayload[];
}
