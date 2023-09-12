import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseFilterRequest } from '../../../../commons/dtos/base-filter-request.dto';
import { OutterStatusEnum } from '../../../../tender-commons/types/proposal';
export enum ProposalSelectEnum {
  AMOUNT_REQUIRED_FSUPPORT = 'AMOUNT_REQUIRED_FSUPPORT',
  BANK_ACCOUNT_NAME = 'BANK_ACCOUNT_NAME',
  BANK_ACCOUNT_NUMBER = 'BANK_ACCOUNT_NUMBER',
  BANK_NAME = 'BANK_NAME',
  EMAIL = 'EMAIL',
  EXECUTION_TIME = 'EXECUTION_TIME',
  GOVERNORATE = 'GOVERNORATE',
  MOBILE_NUMBER = 'MOBILE_NUMBER',
  NUM_OFPROJECT_BENEFICIARIES = 'NUM_OF_PROJECT_BENEFICIARIES',
  PM_NAME = 'PM_NAME',
  PROJECET_LOCATION = 'PROJECET_LOCATION',
  PROJECT_BENEFICIARIES = 'PROJECT_BENEFICIARIES',
  PROJECT_GOALS = 'PROJECT_GOALS',
  PROJECT_IDEA = 'PROJECT_IDEA',
  PROJECT_IMPLEMENT_DATE = 'PROJECT_IMPLEMENT_DATE',
  PROJECT_LOCATION = 'PROJECT_LOCATION',
  PROJECT_NAME = 'PROJECT_NAME',
  PROJECT_OUTPUTS = 'PROJECT_OUTPUTS',
  PROJECT_RISKS = 'PROJECT_RISKS',
  PROJECT_STRENGTHS = 'PROJECT_STRENGTH',
  REGION = 'REGION',
}
export class ProposalReportListQueryDto extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.split(',');
    }
    return value;
  })
  include_relations?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsEnum(ProposalSelectEnum, {
    message: `Selected Column must be one of ${Object.values(
      ProposalSelectEnum,
    ).join(', ')}`,
    each: true,
  })
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.toUpperCase().split(',');
    }
    return value;
  })
  selected_columns?: ProposalSelectEnum[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsEnum(OutterStatusEnum, {
    message: `Outter status must be one of ${Object.values(
      OutterStatusEnum,
    ).join(', ')}`,
    each: true,
  })
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.toUpperCase().split(',');
    }
    return value;
  })
  outter_status?: OutterStatusEnum[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  partner_name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.split(',');
    }
    return value;
  })
  partner_id?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.split(',');
    }
    return value;
  })
  region_id?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.split(',');
    }
    return value;
  })
  benificiary_id?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.split(',');
    }
    return value;
  })
  governorate_id?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => {
    if (value && typeof value === 'string') {
      return value.split(',');
    }
    return value;
  })
  track_id?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsDateString()
  @IsNotEmpty()
  start_date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsDateString()
  @IsNotEmpty()
  end_date?: string;
}
