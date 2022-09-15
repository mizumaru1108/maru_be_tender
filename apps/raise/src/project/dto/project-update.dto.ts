import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { UpdateImagePayload } from '../../commons/dtos/update-image-payload.dto';
import { ProjectCreateDto } from './project-create.dto';

export class ProjectUpdateDto extends ProjectCreateDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  updatedImage: UpdateImagePayload[];
}
