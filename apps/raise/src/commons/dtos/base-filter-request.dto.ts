import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

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
}
