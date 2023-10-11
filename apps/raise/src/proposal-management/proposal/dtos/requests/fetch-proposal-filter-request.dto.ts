import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { BaseFilterRequest } from '../../../../commons/dtos/base-filter-request.dto';
import { OutterStatusEnum } from '../../../../tender-commons/types/proposal';
import { Transform, Type } from 'class-transformer';

export class FetchProposalFilterRequest extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  project_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  // @IsEnum(OutterStatusEnum, {
  //   message: `Status must be one of ${Object.values(OutterStatusEnum).join(
  //     ', ',
  //   )}`,
  //   each: true,
  // })
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.toUpperCase();
    }
    return value;
  })
  outter_status?: OutterStatusEnum[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(999999999999999999)
  @IsNotEmpty()
  project_number?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  employee_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  project_track?: string[];
}
