import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ValidateObjectIdDecorator } from '../../commons/decorators/validate-object-id.decorator';
import { BaseFilterRequest } from '../../commons/dtos/base-filter-request.dto';

export class ProjectFilterRequest extends BaseFilterRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  organizationId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  createdBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  updatedBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  appliedBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  operatorUserId?: string;

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
