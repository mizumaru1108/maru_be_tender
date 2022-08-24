import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ValidateObjectId } from '../../commons/decorators/validate-object-id.decorator';
import { BaseFilterRequest } from '../../commons/dtos/base-filter-request.dto';
import { SortBy } from '../../commons/enums/sortby-enum';

export class CommentFilterRequest extends BaseFilterRequest {
  /**
   * Apply to filter comments by campaignId
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectId()
  parentCommentId?: string;

  /**
   * Apply to find by campaignId
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectId()
  campaignId?: string;

  /**
   * Apply to find by projectId
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectId()
  projectId?: string;

  /**
   * Apply to find by itemId.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectId()
  itemId?: string;

  /**
   * sort by querry
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy;
}
