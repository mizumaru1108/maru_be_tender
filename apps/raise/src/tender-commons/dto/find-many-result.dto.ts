import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class FindManyResult<T> {
  @ApiProperty()
  data?: T | T[] | [];

  @ApiProperty()
  @IsNumber()
  total: number;
}
