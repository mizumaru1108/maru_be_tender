import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsIn,
  IsUUID,
  Max,
  MinLength,
  IsInt,
  Min,
} from 'class-validator';
import { BaseFilterRequest } from '../../../../commons/dtos/base-filter-request.dto';

export class AppointmentFilterRequest extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(['tentative', 'confirmed', 'declined', 'done'], {
    message: 'Status must be one of tentative, confirmed, declined, done',
  })
  status?: 'tentative' | 'confirmed' | 'declined' | 'done';

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(12)
  month: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @Min(1970)
  @Max(new Date().getFullYear() + 2)
  year: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  user_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  employee_id?: string;
}
