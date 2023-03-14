import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TenderFilePayload } from '../../../../tender-commons/dto/tender-file-payload.dto';

export class AskClosingReportDto {
  @ApiProperty()
  @IsNumber()
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

  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => TenderFilePayload)
  attacments: TenderFilePayload[];

  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => TenderFilePayload)
  images: TenderFilePayload[];
}
