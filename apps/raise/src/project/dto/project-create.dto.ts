import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { PayloadImage } from '../../commons/dtos/payload-image.dto';
import { ProjectCreateUpdateBaseDto } from './project-create-update-base.dto';

export class ProjectCreateDto extends ProjectCreateUpdateBaseDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PayloadImage)
  images: PayloadImage[];
}
