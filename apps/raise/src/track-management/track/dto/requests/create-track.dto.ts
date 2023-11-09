import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateTrackDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  with_consultation: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  is_grant: boolean;
}
