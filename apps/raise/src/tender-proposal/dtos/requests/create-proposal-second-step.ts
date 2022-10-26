import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
// form2: {
//   num_ofproject_binicficiaries: undefined, // number
//   project_goals: '', // string
//   project_outputs: '', // string
//   project_strengths: '', // string
//   project_risks: '', // string
// },
export class CreateProposalSecondStepDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  num_ofproject_binicficiaries: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_goals: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_outputs: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_strengths: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_risks: string;
}
