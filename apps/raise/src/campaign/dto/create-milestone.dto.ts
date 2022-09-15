import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateMilestoneDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  detail: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  representationalValue: number;

  @ApiProperty()
  @IsDateString()
  @IsString()
  @IsNotEmpty()
  deadline: string;
}
