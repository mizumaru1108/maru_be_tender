import { ArrayNotEmpty, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectSetDeletedFlagDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  readonly projectIds: string[];
}
