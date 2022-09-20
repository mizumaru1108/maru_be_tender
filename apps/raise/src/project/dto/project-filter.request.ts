import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class ProjectFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxDiameterSize?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minDiameterSize?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  toiletSize?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  prayerMinCapacity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  prayerMaxCapacity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['Y', 'N'], { message: 'hasAc must be Y or N' })
  hasAc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['Y', 'N'], { message: 'hasClassroom must be Y or N' })
  hasClassroom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['Y', 'N'], { message: 'hasGreenSpace must be Y or N' })
  hasGreenSpace?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['Y', 'N'], { message: 'hasFemaleSection must be Y or N' })
  hasFemaleSection?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['Y', 'N'], { message: 'hasParking must be Y or N' })
  hasParking?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['Y', 'N'], { message: 'isDeleted must be Y or N' })
  isDeleted?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['Y', 'N'], { message: 'isPublished must be Y or N' })
  isPublished?: string;
}
