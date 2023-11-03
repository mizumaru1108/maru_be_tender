import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class ProposalConfigUpdateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  proposal_config_id: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  applying_status: boolean;

  @ApiProperty()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
  })
  @IsInt()
  @IsNotEmpty()
  indicator_of_project_duration_days: number;

  @ApiProperty()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
  })
  @IsInt()
  @IsNotEmpty()
  number_of_days_to_meet_business: number;

  @ApiProperty()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
  })
  @IsInt()
  @IsNotEmpty()
  hieght_project_budget: number;

  @ApiProperty()
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
  })
  @IsInt()
  @IsNotEmpty()
  number_of_allowing_projects: number;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  ending_date: Date;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  starting_date: Date;
}
