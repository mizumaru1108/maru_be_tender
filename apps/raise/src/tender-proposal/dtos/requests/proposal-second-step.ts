import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
export class CreateProposalSecondStepDto {
  @ApiProperty()
  @IsNumber()
  num_ofproject_binicficiaries: number;

  @ApiProperty()
  @IsNumber()
  project_goals: number;

  @ApiProperty()
  @IsNumber()
  project_outputs: number;

  @ApiProperty()
  @IsNumber()
  project_strengths: number;

  @ApiProperty()
  @IsNumber()
  project_risks: number;
}
