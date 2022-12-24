import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class BaseFilterRequest {
  /**
   * Page
   */
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  /**
   * Limit
   */
  @ApiPropertyOptional({ default: 10 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;

  /**
   * sorting
   */
  @ApiPropertyOptional({ default: 'desc' })
  @IsString()
  @IsIn(['asc', 'desc'], {
    message: 'sort must be either asc or desc',
  })
  @IsOptional()
  sort?: 'asc' | 'desc';

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sorting_field?: string;
}
