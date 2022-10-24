import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLetterOfSupportDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  size: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;
}
