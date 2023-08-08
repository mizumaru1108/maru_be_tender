import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { TenderFilePayload } from '../../../../tender-commons/dto/tender-file-payload.dto';

class GendersCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  selected_values: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  @IsInt()
  @Min(1)
  @Max(9999999999)
  selected_numbers: number;
}

class BeneficiariesCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  selected_values: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  @IsInt()
  @Min(1)
  @Max(9999999999)
  selected_numbers: number;
}

class ExecutionPlacesCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  selected_values: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
  })
  @IsInt()
  @Min(1)
  @Max(9999999999)
  selected_numbers: number;
}

export class SubmitClosingReportDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  proposal_id: string;

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
  @IsNumber()
  @IsNotEmpty()
  number_project_duration: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_repeated: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  number_project_repeated: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  number_of_volunteer: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  number_of_staff: number;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => TenderFilePayload)
  attachments: TenderFilePayload[];

  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => TenderFilePayload)
  images: TenderFilePayload[];

  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => GendersCreateDto)
  genders: GendersCreateDto[];

  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => BeneficiariesCreateDto)
  beneficiaries: BeneficiariesCreateDto[];

  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => ExecutionPlacesCreateDto)
  execution_places: ExecutionPlacesCreateDto[];
}
