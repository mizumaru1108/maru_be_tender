import { ArrayNotEmpty, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ItemSetDeletedFlagDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  readonly itemIds: string[];
}
