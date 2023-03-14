import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AskClosingReportDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  number_of_beneficiaries: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  target_beneficiaries: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  execution_place: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_duration: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_repeated: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  number_of_volunteer: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  number_of_staff: number;
}
