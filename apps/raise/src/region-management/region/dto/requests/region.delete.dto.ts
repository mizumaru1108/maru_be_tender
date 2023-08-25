import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegionDeleteDto {
  @ApiProperty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  region_id: string[];
}
