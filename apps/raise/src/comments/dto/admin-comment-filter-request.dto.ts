import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CommentFilterRequest } from './comment-filter-request.dto';

export class AdminCommentFilterRequest extends CommentFilterRequest {
  /**
   * Apply to find by commentOwnerId.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  commentOwnerId?: string;
}
