import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ValidateObjectIdDecorator } from '../../commons/decorators/validate-object-id.decorator';
import { BaseFilterRequest } from '../../commons/dtos/base-filter-request.dto';

export class GetAllMyCampaignFilterDto extends BaseFilterRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  organizationId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  isPublished: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  campaignId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  campaignType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn([
    'campaignName',
    'campaignType',
    'contentLanguage',
    'createdAt',
    'updatedAt',
    'status',
    'milestoneCount',
  ])
  sortBy: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(['asc', 'desc'])
  sortMethod: string;
}
