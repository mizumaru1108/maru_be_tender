import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateLetterOfSupportDto } from './create-letter-of-support.dto';

export class CreateProposalFirstStepDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_idea: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_location: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_implement_date: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  execution_time: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_beneficiaries: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => CreateLetterOfSupportDto)
  @ValidateNested()
  letter_ofsupport_req: CreateLetterOfSupportDto;
}
