import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class PayloadContentLanguage {
  @ApiProperty()
  @IsString()
  language: string;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiProperty()
  @IsBoolean()
  active: boolean;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;
}
