import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GovernorateDeleteDto {
  @ApiProperty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  governorate_id: string[];
}
