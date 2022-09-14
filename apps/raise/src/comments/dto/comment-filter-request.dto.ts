import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsUUID,
  IsIn,
} from 'class-validator';
import { ValidateObjectIdDecorator } from '../../commons/decorators/validate-object-id.decorator';
import { BaseFilterRequest } from '../../commons/dtos/base-filter-request.dto';
import { SortMethod } from '../../commons/enums/sortby-method';

export class CommentFilterRequest extends BaseFilterRequest {
  /**
   * Apply to find by commentOwnerId.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  commentOwnerId?: string;

  /**
   * Apply to find by commentOwnerId.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  organizationId?: string;

  /**
   * Apply to filter comments by campaignId
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  parentCommentId?: string;

  /**
   * Apply to find by campaignId
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  campaignId?: string;

  /**
   * Apply to find by projectId
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  projectId?: string;

  /**
   * Apply to find by itemId.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  itemId?: string;

  /**
   * sort by querry
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsIn(['createdAt', 'updatedAt'])
  sortBy?: string;

  /**
   * sort by querry
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SortMethod, { message: `sortMethod must be "asc" or "desc"` })
  sortMethod?: SortMethod;
}
