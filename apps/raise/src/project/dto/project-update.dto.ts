import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { UpdateImagePayload } from '../../commons/dtos/update-image-payload.dto';
import { ProjectCreateUpdateBaseDto } from './project-create-update-base.dto';

export class ProjectUpdateDto extends ProjectCreateUpdateBaseDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  updatedImage: UpdateImagePayload[];
}
