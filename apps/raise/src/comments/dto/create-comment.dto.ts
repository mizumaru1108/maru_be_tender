import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ValidateObjectId } from '../../commons/decorators/validate-object-id.decorator';

export class CreateCommentDto {
  /**
   * Add it if you want this comment to be a reply to another comment
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectId()
  parentCommentId?: string;

  /**
   * Add it if you want comment to campaign.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectId()
  campaignId?: string;

  /**
   * Add it if you want comment to project.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectId()
  projectId?: string;

  /**
   * Add it if you want to comment to item.
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectId()
  itemId?: string;

  /**
   * Content of the item
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content?: string;
}
