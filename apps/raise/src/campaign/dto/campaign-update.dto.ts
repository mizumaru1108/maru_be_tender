import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { UpdateImagePayload } from '../../commons/dtos/update-image-payload.dto';
import { CampaignCreateDto } from './campaign-create.dto';

export class CampaignUpdateDto extends CampaignCreateDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  updatedImage: UpdateImagePayload[];
}
