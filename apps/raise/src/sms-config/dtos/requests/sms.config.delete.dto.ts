import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SmsConfigDeleteDto {
  @ApiProperty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  id: string[];
}
