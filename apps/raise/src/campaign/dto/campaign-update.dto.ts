import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { UpdateImagePayload } from '../../commons/dtos/update-image-payload.dto';
import { CampaignCreateDto } from './campaign-create.dto';

export class CampaignUpdateDto extends CampaignCreateDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateImagePayload)
  updatedImage: UpdateImagePayload[];
}
